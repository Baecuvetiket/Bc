import { users, orders, type User, type InsertUser, type Order, type InsertOrder, products, type InsertProduct } from "@shared/schema";
import bcrypt from "bcrypt";
import { db } from "./db";
import { eq } from "drizzle-orm";

// Kullanıcı işlemleri
async function getUser(id: number) {
  return db.select().from(users).where(eq(users.id, id)).then(r => r[0]);
}
async function getUserByUsername(username: string) {
  return db.select().from(users).where(eq(users.username, username)).then(r => r[0]);
}
async function createUser(insertUser: InsertUser) {
  const hashedPassword = await bcrypt.hash(insertUser.password, 10);
  const userData = { ...insertUser, password: hashedPassword };
  return db.insert(users).values(userData).returning().then(r => r[0]);
}

// Sipariş işlemleri
async function createOrder(order: InsertOrder) {
  return db.insert(orders).values(order).returning().then(r => r[0]);
}
async function getOrder(id: number) {
  return db.select().from(orders).where(eq(orders.id, id)).then(r => r[0]);
}
async function getOrders() {
  return db.select().from(orders);
}
async function updateOrderStatus(id: number, status: string) {
  return db.update(orders).set({ status }).where(eq(orders.id, id)).returning().then(r => r[0]);
}

// Ürün işlemleri
async function getProducts() {
  return db.select().from(products);
}
async function getProduct(id: number) {
  return db.select().from(products).where(eq(products.id, id)).then(r => r[0]);
}
async function createProduct(data: InsertProduct) {
  return db.insert(products).values(data).returning().then(r => r[0]);
}
async function updateProduct(id: number, data: Partial<InsertProduct>) {
  return db.update(products).set(data).where(eq(products.id, id)).returning().then(r => r[0]);
}
async function deleteProduct(id: number) {
  return db.delete(products).where(eq(products.id, id));
}

export const storage = {
  getUser,
  getUserByUsername,
  createUser,
  createOrder,
  getOrder,
  getOrders,
  updateOrderStatus,
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
