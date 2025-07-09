import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import path from "path";
import { storage } from "./storage";
import { insertOrderSchema } from "@shared/schema";
import { z } from "zod";

const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "application/pdf"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only PNG, JPG, and PDF files are allowed."));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Create order endpoint
  app.post("/api/orders", upload.single("designFile"), async (req, res) => {
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

  // Get all orders endpoint
  app.get("/api/orders", async (req, res) => {
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

  const httpServer = createServer(app);
  return httpServer;
}
