import { type User, type InsertUser, type Product, type InsertProduct, type Order, type InsertOrder, type OrderItem, type InsertOrderItem } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Product methods
  getAllProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  getFeaturedProducts(): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;
  searchProducts(query: string): Promise<Product[]>;
  filterProducts(filters: { material?: string; minPrice?: number; maxPrice?: number }): Promise<Product[]>;
  
  // Order methods
  createOrder(order: InsertOrder): Promise<Order>;
  getOrder(id: string): Promise<Order | undefined>;
  getAllOrders(): Promise<Order[]>;
  updateOrderPaymentStatus(id: string, status: string, stripePaymentIntentId?: string): Promise<Order | undefined>;
  
  // Order item methods
  createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;
  getOrderItems(orderId: string): Promise<OrderItem[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private products: Map<string, Product>;
  private orders: Map<string, Order>;
  private orderItems: Map<string, OrderItem>;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    
    // Create default admin user
    this.createUser({
      username: "admin",
      password: "admin123", // In production, this should be hashed
      email: "admin@luxecuffs.com",
    }).then(user => {
      // Set admin flag after creation
      this.users.set(user.id, { ...user, isAdmin: true });
    });
    
    // Create sample products
    this.initializeSampleProducts();
  }

  private async initializeSampleProducts() {
    const sampleProducts: InsertProduct[] = [
      {
        name: "Classic Gold Heritage",
        description: "Timeless 18k gold cufflinks with intricate vintage engravings",
        price: "299.00",
        imageUrl: "https://images.unsplash.com/photo-1588444650700-7be9fd5c8db2?w=400",
        material: "Gold",
        stock: 10,
        featured: true,
      },
      {
        name: "Modern Silver Edge",
        description: "Contemporary sterling silver with geometric patterns",
        price: "199.00",
        imageUrl: "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400",
        material: "Silver",
        stock: 15,
        featured: true,
      },
      {
        name: "Diamond Prestige",
        description: "Exquisite white gold with genuine diamonds",
        price: "899.00",
        imageUrl: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400",
        material: "Platinum",
        stock: 5,
        featured: true,
      },
      {
        name: "Vintage Brass Collection",
        description: "Antique-inspired brass with ornate detailing",
        price: "149.00",
        imageUrl: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400",
        material: "Brass",
        stock: 20,
        featured: false,
      },
      {
        name: "Titanium Minimalist",
        description: "Ultra-lightweight titanium with brushed finish",
        price: "249.00",
        imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
        material: "Titanium",
        stock: 12,
        featured: false,
      },
      {
        name: "Pearl Elegance",
        description: "Mother-of-pearl with gold accent details",
        price: "399.00",
        imageUrl: "https://images.unsplash.com/photo-1539874754764-5a96559165b0?w=400",
        material: "Gold",
        stock: 8,
        featured: false,
      },
    ];

    for (const product of sampleProducts) {
      await this.createProduct(product);
    }
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      isAdmin: false,
      email: insertUser.email || null,
    };
    this.users.set(id, user);
    return user;
  }

  // Product methods
  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).sort((a, b) => 
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(p => p.featured);
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const newProduct: Product = {
      ...product,
      id,
      stock: product.stock || 0,
      featured: product.featured || false,
      createdAt: new Date(),
    };
    this.products.set(id, newProduct);
    return newProduct;
  }

  async updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const existing = this.products.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...product };
    this.products.set(id, updated);
    return updated;
  }

  async deleteProduct(id: string): Promise<boolean> {
    return this.products.delete(id);
  }

  async searchProducts(query: string): Promise<Product[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.products.values()).filter(p =>
      p.name.toLowerCase().includes(lowercaseQuery) ||
      p.description.toLowerCase().includes(lowercaseQuery) ||
      p.material.toLowerCase().includes(lowercaseQuery)
    );
  }

  async filterProducts(filters: { material?: string; minPrice?: number; maxPrice?: number }): Promise<Product[]> {
    return Array.from(this.products.values()).filter(p => {
      if (filters.material && p.material !== filters.material) return false;
      if (filters.minPrice && parseFloat(p.price) < filters.minPrice) return false;
      if (filters.maxPrice && parseFloat(p.price) > filters.maxPrice) return false;
      return true;
    });
  }

  // Order methods
  async createOrder(order: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const newOrder: Order = {
      ...order,
      id,
      paymentStatus: order.paymentStatus || "pending",
      stripePaymentIntentId: order.stripePaymentIntentId || null,
      createdAt: new Date(),
    };
    this.orders.set(id, newOrder);
    return newOrder;
  }

  async getOrder(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getAllOrders(): Promise<Order[]> {
    return Array.from(this.orders.values()).sort((a, b) => 
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }

  async updateOrderPaymentStatus(id: string, status: string, stripePaymentIntentId?: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    const updated = { 
      ...order, 
      paymentStatus: status,
      ...(stripePaymentIntentId && { stripePaymentIntentId })
    };
    this.orders.set(id, updated);
    return updated;
  }

  // Order item methods
  async createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem> {
    const id = randomUUID();
    const newOrderItem: OrderItem = {
      ...orderItem,
      id,
    };
    this.orderItems.set(id, newOrderItem);
    return newOrderItem;
  }

  async getOrderItems(orderId: string): Promise<OrderItem[]> {
    return Array.from(this.orderItems.values()).filter(item => item.orderId === orderId);
  }
}

export const storage = new MemStorage();
