import { users, orders, type User, type InsertUser, type Order, type InsertOrder } from "@shared/schema";
import bcrypt from "bcrypt";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createOrder(order: InsertOrder): Promise<Order>;
  getOrder(id: number): Promise<Order | undefined>;
  getOrders(): Promise<Order[]>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private orders: Map<number, Order>;
  private currentUserId: number;
  private currentOrderId: number;

  constructor() {
    this.users = new Map();
    this.orders = new Map();
    this.currentUserId = 1;
    this.currentOrderId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const hashedPassword = await bcrypt.hash(insertUser.password, 10);
    const user: User = { ...insertUser, id, password: hashedPassword, role: (insertUser as any).role || 'user' };
    this.users.set(id, user);
    return user;
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = this.currentOrderId++;
    const order: Order = {
      ...insertOrder,
      id,
      status: insertOrder.status || "pending",
      metallicColor: insertOrder.metallicColor || null,
      discount: insertOrder.discount || "0",
      fileName: insertOrder.fileName || null,
      fileSize: insertOrder.fileSize || null,
      filePath: insertOrder.filePath || null,
      customerName: insertOrder.customerName || null,
      customerEmail: insertOrder.customerEmail || null,
      customerPhone: insertOrder.customerPhone || null,
      createdAt: new Date(),
    };
    this.orders.set(id, order);
    return order;
  }

  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (order) {
      const updatedOrder = { ...order, status };
      this.orders.set(id, updatedOrder);
      return updatedOrder;
    }
    return undefined;
  }
}

export const storage = new MemStorage();
