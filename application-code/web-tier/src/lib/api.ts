// src/lib/api.ts
const API_URL = "http://localhost:4000/api"; //fix me

export const api = {
  // Products
  getProducts: async () => {
    const res = await fetch(`${API_URL}/products`);
    return res.json();
  },
  addProduct: async (product: any) => {
    const res = await fetch(`${API_URL}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });
    return res.json();
  },
  updateProduct: async (id: number, product: any) => {
    const res = await fetch(`${API_URL}/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });
    return res.json();
  },
  deleteProduct: async (id: number) => {
    await fetch(`${API_URL}/products/${id}`, { method: "DELETE" });
  },

  // Warehouses
  getWarehouses: async () => {
    const res = await fetch(`${API_URL}/warehouses`);
    return res.json();
  },
  addWarehouse: async (warehouse: any) => {
    const res = await fetch(`${API_URL}/warehouses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(warehouse),
    });
    return res.json();
  },

  // Inventory
  getInventory: async () => {
    const res = await fetch(`${API_URL}/inventory`);
    return res.json();
  },

  // Orders
  createOrder: async (order: any) => {
    const res = await fetch(`${API_URL}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    });
    return res.json();
  },
  // Thêm vào object api
  getOrders: async () => {
    const res = await fetch(`${API_URL}/orders`);
    return res.json();
  },
  // Stats
  getStats: async () => {
    const res = await fetch(`${API_URL}/stats`);
    return res.json();
  },
  updateWarehouse: async (id: number, warehouse: any) => {
    const res = await fetch(`${API_URL}/warehouses/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(warehouse),
    });
    return res.json();
  },
  deleteWarehouse: async (id: number) => {
    await fetch(`${API_URL}/warehouses/${id}`, { method: "DELETE" });
  },
};
