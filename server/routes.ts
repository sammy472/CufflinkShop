import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { insertProductSchema, insertOrderSchema, insertOrderItemSchema, adminLoginSchema, checkoutSchema } from "@shared/schema";
import { sendOrderNotificationEmail, sendOrderConfirmationEmail } from "./services/email";
import "dotenv/config";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-08-27.basil",
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Products routes
  app.get("/api/products", async (req, res) => {
    try {
      const { search, material, minPrice, maxPrice } = req.query;
      
      let products;
      if (search) {
        products = await storage.searchProducts(search as string);
      } else if (material || minPrice || maxPrice) {
        products = await storage.filterProducts({
          material: material as string,
          minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
          maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
        });
      } else {
        products = await storage.getAllProducts();
      }
      
      res.json(products);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching products: " + error.message });
    }
  });

  app.get("/api/products/featured", async (req, res) => {
    try {
      const products = await storage.getFeaturedProducts();
      res.json(products);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching featured products: " + error.message });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching product: " + error.message });
    }
  });

  // Admin routes
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = adminLoginSchema.parse(req.body);
      
      const user = await storage.getUserByUsername(username);
      if (!user || user.password !== password || !user.isAdmin) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // In a real app, you'd use proper session management
      res.json({ user: { id: user.id, username: user.username, isAdmin: user.isAdmin } });
    } catch (error: any) {
      res.status(400).json({ message: "Invalid login data: " + error.message });
    }
  });

  app.post("/api/admin/products", async (req, res) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      res.json(product);
    } catch (error: any) {
      res.status(400).json({ message: "Error creating product: " + error.message });
    }
  });

  app.put("/api/admin/products/:id", async (req, res) => {
    try {
      const productData = insertProductSchema.partial().parse(req.body);
      const product = await storage.updateProduct(req.params.id, productData);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error: any) {
      res.status(400).json({ message: "Error updating product: " + error.message });
    }
  });

  app.delete("/api/admin/products/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteProduct(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json({ message: "Product deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: "Error deleting product: " + error.message });
    }
  });

  app.get("/api/admin/orders", async (req, res) => {
    try {
      const orders = await storage.getAllOrders();
      res.json(orders);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching orders: " + error.message });
    }
  });

  app.get("/api/admin/orders/:id", async (req, res) => {
    try {
      const order = await storage.getOrder(req.params.id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      const orderItems = await storage.getOrderItems(req.params.id);
      const itemsWithProducts = await Promise.all(
        orderItems.map(async (item) => {
          const product = await storage.getProduct(item.productId);
          if (!product) throw new Error(`Product ${item.productId} not found`);
          return { ...item, product };
        })
      );
      
      res.json({ order, items: itemsWithProducts });
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching order: " + error.message });
    }
  });

  // Stripe payment route
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { amount, orderId } = req.body;
      
      if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid amount" });
      }
      
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
        metadata: orderId ? { orderId } : {},
      });
      
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      res.status(500).json({ message: "Error creating payment intent: " + error.message });
    }
  });

  // Order creation route
  app.post("/api/orders", async (req, res) => {
    try {
      const { orderData, items } = req.body;
      
      // Validate order data
      const validatedOrderData = checkoutSchema.parse(orderData);
      
      // Calculate totals
      let subtotal = 0;
      const validatedItems = [];
      
      for (const item of items) {
        const product = await storage.getProduct(item.productId);
        if (!product) {
          return res.status(400).json({ message: `Product ${item.productId} not found` });
        }
        if (product.stock < item.quantity) {
          return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
        }
        
        const itemTotal = parseFloat(product.price) * item.quantity;
        subtotal += itemTotal;
        
        validatedItems.push({
          productId: item.productId,
          quantity: item.quantity,
          price: product.price,
        });
      }
      
      const shipping = 15.00; // Fixed shipping rate
      const taxRate = 0.08; // 8% tax rate
      const tax = subtotal * taxRate;
      const total = subtotal + shipping + tax;
      
      // Create order
      const order = await storage.createOrder({
        ...validatedOrderData,
        subtotal: subtotal.toFixed(2),
        shipping: shipping.toFixed(2),
        tax: tax.toFixed(2),
        total: total.toFixed(2),
        paymentStatus: "pending",
      });
      
      // Create order items
      const orderItems = [];
      for (const item of validatedItems) {
        const orderItem = await storage.createOrderItem({
          orderId: order.id,
          ...item,
        });
        const product = await storage.getProduct(item.productId);
        orderItems.push({ ...orderItem, product });
      }
      
      res.json({ order, items: orderItems });
    } catch (error: any) {
      res.status(400).json({ message: "Error creating order: " + error.message });
    }
  });

  // Payment confirmation webhook
  app.post("/api/payment-success", async (req, res) => {
    try {
      const { orderId, paymentIntentId } = req.body;
      
      const order = await storage.updateOrderPaymentStatus(orderId, "paid", paymentIntentId);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      // Get order items with product details
      const orderItems = await storage.getOrderItems(orderId);
      const itemsWithProducts = await Promise.all(
        orderItems.map(async (item) => {
          const product = await storage.getProduct(item.productId);
          if (!product) throw new Error(`Product ${item.productId} not found`);
          return { ...item, product };
        })
      );
      
      // Send email notifications
      await sendOrderNotificationEmail(order, itemsWithProducts);
      await sendOrderConfirmationEmail(order, itemsWithProducts);
      
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: "Error processing payment confirmation: " + error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
