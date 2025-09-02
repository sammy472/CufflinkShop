import nodemailer from 'nodemailer';
import { type Order, type OrderItem, type Product } from '@shared/schema';
import dotenv from 'dotenv';
dotenv.config();

// Email configuration
const createTransporter = () => {
  // For development, use ethereal email (fake SMTP service)
  // In production, replace with real SMTP credentials
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER || 'ethereal.user@ethereal.email',
      pass: process.env.SMTP_PASS || 'ethereal.pass',
    },
  });
};

export async function sendOrderNotificationEmail(
  order: Order,
  orderItems: (OrderItem & { product: Product })[],
  adminEmail: string = process.env.ADMIN_EMAIL || 'admin@luxecuffs.com'
) {
  try {
    const transporter = createTransporter();

    const itemsHtml = orderItems
      .map(
        (item) => `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.product.name}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">$${item.price}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">$${(parseFloat(item.price) * item.quantity).toFixed(2)}</td>
        </tr>
      `
      )
      .join('');

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1e40af;">New Order Received - LuxeCuffs</h2>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Order Details</h3>
          <p><strong>Order ID:</strong> ${order.id}</p>
          <p><strong>Order Date:</strong> ${new Date(order.createdAt || new Date()).toLocaleDateString()}</p>
          <p><strong>Payment Status:</strong> ${order.paymentStatus}</p>
        </div>

        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Customer Information</h3>
          <p><strong>Name:</strong> ${order.customerFirstName} ${order.customerLastName}</p>
          <p><strong>Email:</strong> ${order.customerEmail}</p>
          <p><strong>Phone:</strong> ${order.customerPhone}</p>
        </div>

        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Delivery Address</h3>
          <p>${order.shippingStreet}</p>
          <p>${order.shippingCity}, ${order.shippingState} ${order.shippingZipCode}</p>
        </div>

        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Order Items</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #e2e8f0;">
                <th style="padding: 10px; text-align: left;">Product</th>
                <th style="padding: 10px; text-align: center;">Quantity</th>
                <th style="padding: 10px; text-align: right;">Unit Price</th>
                <th style="padding: 10px; text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
        </div>

        <div style="background-color: #1e40af; color: white; padding: 20px; border-radius: 8px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span>Subtotal:</span>
            <span>$${order.subtotal}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span>Shipping:</span>
            <span>$${order.shipping}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span>Tax:</span>
            <span>$${order.tax}</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: bold; border-top: 1px solid rgba(255,255,255,0.3); padding-top: 10px;">
            <span>Total:</span>
            <span>$${order.total}</span>
          </div>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: process.env.FROM_EMAIL || 'noreply@luxecuffs.com',
      to: adminEmail,
      subject: `New Order #${order.id.slice(-8)} - $${order.total}`,
      html: emailHtml,
    });

    console.log(`Order notification email sent for order ${order.id}`);
  } catch (error) {
    console.error('Failed to send order notification email:', error);
  }
}

export async function sendOrderConfirmationEmail(
  order: Order,
  orderItems: (OrderItem & { product: Product })[]
) {
  try {
    const transporter = createTransporter();

    const itemsHtml = orderItems
      .map(
        (item) => `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.product.name}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">$${item.price}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">$${(parseFloat(item.price) * item.quantity).toFixed(2)}</td>
        </tr>
      `
      )
      .join('');

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1e40af;">Thank You for Your Order!</h2>
        
        <p>Dear ${order.customerFirstName},</p>
        <p>Thank you for choosing LuxeCuffs. Your order has been received and is being processed.</p>

        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Order Summary</h3>
          <p><strong>Order ID:</strong> ${order.id}</p>
          <p><strong>Order Date:</strong> ${new Date(order.createdAt || new Date()).toLocaleDateString()}</p>
          <p><strong>Payment Status:</strong> ${order.paymentStatus}</p>
        </div>

        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Delivery Address</h3>
          <p>${order.shippingStreet}</p>
          <p>${order.shippingCity}, ${order.shippingState} ${order.shippingZipCode}</p>
        </div>

        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Order Items</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #e2e8f0;">
                <th style="padding: 10px; text-align: left;">Product</th>
                <th style="padding: 10px; text-align: center;">Quantity</th>
                <th style="padding: 10px; text-align: right;">Unit Price</th>
                <th style="padding: 10px; text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
        </div>

        <div style="background-color: #1e40af; color: white; padding: 20px; border-radius: 8px;">
          <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: bold;">
            <span>Total Paid:</span>
            <span>$${order.total}</span>
          </div>
        </div>

        <p style="margin-top: 20px; color: #64748b;">
          We'll send you shipping confirmation once your order is on its way.
        </p>
      </div>
    `;

    await transporter.sendMail({
      from: process.env.FROM_EMAIL || 'noreply@luxecuffs.com',
      to: order.customerEmail,
      subject: `Order Confirmation #${order.id.slice(-8)} - LuxeCuffs`,
      html: emailHtml,
    });

    console.log(`Order confirmation email sent to ${order.customerEmail}`);
  } catch (error) {
    console.error('Failed to send order confirmation email:', error);
  }
}
