import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import path from "path";
import { storage } from "./storage";
import { insertOrderSchema } from "@shared/schema";
import { z } from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { insertUserSchema } from "@shared/schema";
import { insertProductSchema } from "@shared/schema";

const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "application/pdf"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only PNG, JPG, and PDF files are allowed."));
    }
  },
});

const JWT_SECRET = process.env.JWT_SECRET || "baecuvsecret";

// JWT doğrulama middleware
function authenticateToken(req: any, res: any, next: any) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ success: false, message: "Token gerekli" });
  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.status(403).json({ success: false, message: "Token geçersiz" });
    req.user = user;
    next();
  });
}

// Rol kontrol middleware'i
function requireRole(role: string) {
  return (req: any, res: any, next: any) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ success: false, message: "Yetkisiz erişim" });
    }
    next();
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Create order endpoint
  app.post("/api/orders", upload.single("designFile"), async (req: Request, res) => {
    try {
      const file = req.file;
      
      // Parse and validate order data
      const orderData = {
        printType: req.body.printType,
        metallicColor: req.body.metallicColor || null,
        quantity: parseInt(req.body.quantity),
        unitPrice: req.body.unitPrice,
        subtotal: req.body.subtotal,
        discount: req.body.discount || "0",
        total: req.body.total,
        fileName: file?.originalname || null,
        fileSize: file?.size || null,
        filePath: file?.path || null,
        status: "pending",
      };

      const validatedData = insertOrderSchema.parse(orderData);
      const order = await storage.createOrder(validatedData);

      res.json({
        success: true,
        order,
        message: "Sipariş başarıyla oluşturuldu",
      });
    } catch (error) {
      console.error("Order creation error:", error);
      res.status(400).json({
        success: false,
        message: error instanceof z.ZodError 
          ? "Sipariş bilgileri geçersiz" 
          : "Sipariş oluşturulurken bir hata oluştu",
        error: error instanceof z.ZodError ? error.errors : undefined,
      });
    }
  });

  // Siparişleri sadece giriş yapmış kullanıcılar görebilsin
  app.get("/api/orders", authenticateToken, async (req, res) => {
    try {
      const orders = await storage.getOrders();
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({
        success: false,
        message: "Siparişler alınırken bir hata oluştu",
      });
    }
  });

  // Get single order endpoint
  app.get("/api/orders/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const order = await storage.getOrder(id);
      
      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Sipariş bulunamadı",
        });
      }
      
      res.json(order);
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({
        success: false,
        message: "Sipariş alınırken bir hata oluştu",
      });
    }
  });

  // Update order status endpoint
  app.patch("/api/orders/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      const order = await storage.updateOrderStatus(id, status);
      
      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Sipariş bulunamadı",
        });
      }
      
      res.json({
        success: true,
        order,
        message: "Sipariş durumu güncellendi",
      });
    } catch (error) {
      console.error("Error updating order status:", error);
      res.status(500).json({
        success: false,
        message: "Sipariş durumu güncellenirken bir hata oluştu",
      });
    }
  });

  // Kullanıcı kayıt
  app.post("/api/auth/register", async (req, res) => {
    try {
      const data = insertUserSchema.parse(req.body);
      const existing = await storage.getUserByUsername(data.username);
      if (existing) {
        return res.status(400).json({ success: false, message: "Kullanıcı adı zaten alınmış" });
      }
      const user = await storage.createUser(data);
      res.json({ success: true, user: { id: user.id, username: user.username, role: user.role } });
    } catch (error) {
      res.status(400).json({ success: false, message: "Kayıt başarısız", error });
    }
  });

  // Kullanıcı giriş
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await storage.getUserByUsername(username);
      if (!user) return res.status(401).json({ success: false, message: "Kullanıcı bulunamadı" });
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return res.status(401).json({ success: false, message: "Şifre hatalı" });
      const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
      res.json({ success: true, token, user: { id: user.id, username: user.username, role: user.role } });
    } catch (error) {
      res.status(400).json({ success: false, message: "Giriş başarısız", error });
    }
  });

  // Şifre sıfırlama (kullanıcı adı ve yeni şifre ile)
  app.post("/api/auth/reset-password", async (req, res) => {
    try {
      const { username, newPassword } = req.body;
      const user = await storage.getUserByUsername(username);
      if (!user) return res.status(404).json({ success: false, message: "Kullanıcı bulunamadı" });
      const hashed = await bcrypt.hash(newPassword, 10);
      user.password = hashed;
      res.json({ success: true, message: "Şifre güncellendi" });
    } catch (error) {
      res.status(400).json({ success: false, message: "Şifre sıfırlama başarısız", error });
    }
  });

  // Ürünleri listele
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ success: false, message: "Ürünler alınırken hata oluştu" });
    }
  });

  // Ürün detayı
  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProduct(id);
      if (!product) return res.status(404).json({ success: false, message: "Ürün bulunamadı" });
      res.json(product);
    } catch (error) {
      res.status(500).json({ success: false, message: "Ürün alınırken hata oluştu" });
    }
  });

  // Ürün ekle (admin)
  app.post("/api/products", authenticateToken, requireRole("admin"), async (req, res) => {
    try {
      const data = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(data);
      res.json({ success: true, product });
    } catch (error) {
      res.status(400).json({ success: false, message: "Ürün eklenemedi", error });
    }
  });

  // Ürün güncelle (admin)
  app.put("/api/products/:id", authenticateToken, requireRole("admin"), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = req.body;
      const product = await storage.updateProduct(id, data);
      if (!product) return res.status(404).json({ success: false, message: "Ürün bulunamadı" });
      res.json({ success: true, product });
    } catch (error) {
      res.status(400).json({ success: false, message: "Ürün güncellenemedi", error });
    }
  });

  // Ürün sil (admin)
  app.delete("/api/products/:id", authenticateToken, requireRole("admin"), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteProduct(id);
      res.json({ success: true, message: "Ürün silindi" });
    } catch (error) {
      res.status(400).json({ success: false, message: "Ürün silinemedi", error });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
