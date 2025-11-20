const wmsService = require("./WMSService");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 4000;

app.use(bodyParser.json());
app.use(cors());

// Health Check
app.get("/health", (req, res) => res.json("WMS Backend is healthy"));

// --- Auth ---
app.post("/api/login", async (req, res) => {
  //fix me
  try {
    const user = await wmsService.login(req.body.username);
    if (user) res.json(user);
    else res.status(401).json({ message: "User not found" });
  } catch (err) {
    console.error("Lỗi API /api/login:", err);
    res.status(500).json({ error: err.message });
  }
});

// --- Products ---
app.get("/api/products", async (req, res) => {
  //fix me
  try {
    const results = await wmsService.getAllProducts();
    res.json(results);
  } catch (err) {
    console.error("Lỗi API /api/products GET:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/products", async (req, res) => {
  //fix me
  try {
    const { sku, name, uom, price } = req.body;
    const result = await wmsService.addProduct(sku, name, uom, price);
    res.json(result);
  } catch (err) {
    console.error("Lỗi API /api/products POST:", err);
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/products/:id", async (req, res) => {
  //fix me
  try {
    const { sku, name, uom, price } = req.body;
    const result = await wmsService.updateProduct(
      req.params.id,
      sku,
      name,
      uom,
      price
    );
    res.json(result);
  } catch (err) {
    console.error("Lỗi API /api/products PUT:", err);
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/products/:id", async (req, res) => {
  //fix me
  try {
    await wmsService.deleteProduct(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error("Lỗi API /api/products DELETE:", err);
    res.status(500).json({ error: err.message });
  }
});

// --- Warehouses ---
app.get("/api/warehouses", async (req, res) => {
  //fix me
  try {
    const results = await wmsService.getAllWarehouses();
    res.json(results);
  } catch (err) {
    console.error("Lỗi API /api/warehouses GET:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/warehouses", async (req, res) => {
  //fix me
  try {
    const { name, address } = req.body;
    const result = await wmsService.addWarehouse(name, address);
    res.json(result);
  } catch (err) {
    console.error("Lỗi API /api/warehouses POST:", err);
    res.status(500).json({ error: err.message });
  }
});

// --- Inventory ---
app.get("/api/inventory", async (req, res) => {
  //fix me
  try {
    const results = await wmsService.getInventory();
    res.json(results);
  } catch (err) {
    console.error("Lỗi API /api/inventory GET:", err);
    res.status(500).json({ error: err.message });
  }
});

// --- Orders ---
app.post("/api/orders", async (req, res) => {
  //fix me
  try {
    // req.body khớp với cấu trúc orderData trong service
    const result = await wmsService.createOrder(req.body);
    res.json(result);
  } catch (err) {
    console.error("Lỗi API /api/orders POST:", err);
    res.status(500).json({ error: err.message });
  }
});

// --- Dashboard Stats ---
app.get("/api/stats", async (req, res) => {
  //fix me
  try {
    const results = await wmsService.getStats();
    res.json(results);
  } catch (err) {
    console.error("Lỗi API /api/stats GET:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/orders", async (req, res) => {
  //fix me
  try {
    const results = await wmsService.getAllOrders();
    res.json(results);
  } catch (err) {
    console.error("Lỗi API /api/orders GET:", err);
    res.status(500).json({ error: err.message });
  }
});
app.put("/api/warehouses/:id", async (req, res) => {
  //fix me
  try {
    const { name, address } = req.body;
    const result = await wmsService.updateWarehouse(
      req.params.id,
      name,
      address
    );
    res.json(result);
  } catch (err) {
    console.error("Lỗi API /api/warehouses PUT:", err);
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/warehouses/:id", async (req, res) => {
  //fix me
  try {
    await wmsService.deleteWarehouse(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error("Lỗi API /api/warehouses DELETE:", err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`WMS Backend running at http://localhost:${port}`);
});
