// Mock data management for WMS

const STORAGE_KEYS = {
  PRODUCTS: 'wms_products',
  WAREHOUSES: 'wms_warehouses',
  INVENTORY: 'wms_inventory',
  ORDERS: 'wms_orders',
};

// Initialize default data
const initializeData = () => {
  if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
    const defaultProducts = [
      { id: 1, sku: 'SKU-001', name: 'Laptop Dell XPS 13', uom: 'pcs' },
      { id: 2, sku: 'SKU-002', name: 'iPhone 14 Pro', uom: 'pcs' },
      { id: 3, sku: 'SKU-003', name: 'Samsung Galaxy S23', uom: 'pcs' },
      { id: 4, sku: 'SKU-004', name: 'Sony WH-1000XM5', uom: 'pcs' },
      { id: 5, sku: 'SKU-005', name: 'Apple MacBook Pro 14"', uom: 'pcs' },
      { id: 6, sku: 'SKU-006', name: 'iPad Air', uom: 'pcs' },
      { id: 7, sku: 'SKU-007', name: 'AirPods Pro', uom: 'pcs' },
      { id: 8, sku: 'SKU-008', name: 'Magic Mouse', uom: 'pcs' },
    ];
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(defaultProducts));
  }

  if (!localStorage.getItem(STORAGE_KEYS.WAREHOUSES)) {
    const defaultWarehouses = [
      { id: 1, name: 'Hanoi Warehouse', address: '123 Nguyen Trai, Thanh Xuan, Hanoi' },
      { id: 2, name: 'HCM Warehouse', address: '456 Nguyen Hue, District 1, Ho Chi Minh City' },
      { id: 3, name: 'Da Nang Warehouse', address: '789 Bach Dang, Hai Chau, Da Nang' },
    ];
    localStorage.setItem(STORAGE_KEYS.WAREHOUSES, JSON.stringify(defaultWarehouses));
  }

  if (!localStorage.getItem(STORAGE_KEYS.INVENTORY)) {
    const defaultInventory = [
      { id: 1, product_id: 1, product_sku: 'SKU-001', product_name: 'Laptop Dell XPS 13', warehouse_id: 1, warehouse_name: 'Hanoi Warehouse', location_code: 'A-01-01', quantity: 45 },
      { id: 2, product_id: 2, product_sku: 'SKU-002', product_name: 'iPhone 14 Pro', warehouse_id: 1, warehouse_name: 'Hanoi Warehouse', location_code: 'A-01-02', quantity: 120 },
      { id: 3, product_id: 3, product_sku: 'SKU-003', product_name: 'Samsung Galaxy S23', warehouse_id: 1, warehouse_name: 'Hanoi Warehouse', location_code: 'A-01-03', quantity: 8 },
      { id: 4, product_id: 4, product_sku: 'SKU-004', product_name: 'Sony WH-1000XM5', warehouse_id: 2, warehouse_name: 'HCM Warehouse', location_code: 'B-02-01', quantity: 75 },
      { id: 5, product_id: 5, product_sku: 'SKU-005', product_name: 'Apple MacBook Pro 14"', warehouse_id: 2, warehouse_name: 'HCM Warehouse', location_code: 'B-02-02', quantity: 32 },
      { id: 6, product_id: 6, product_sku: 'SKU-006', product_name: 'iPad Air', warehouse_id: 2, warehouse_name: 'HCM Warehouse', location_code: 'B-02-03', quantity: 5 },
      { id: 7, product_id: 7, product_sku: 'SKU-007', product_name: 'AirPods Pro', warehouse_id: 3, warehouse_name: 'Da Nang Warehouse', location_code: 'C-03-01', quantity: 95 },
      { id: 8, product_id: 8, product_sku: 'SKU-008', product_name: 'Magic Mouse', warehouse_id: 3, warehouse_name: 'Da Nang Warehouse', location_code: 'C-03-02', quantity: 0 },
    ];
    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(defaultInventory));
  }

  if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
    const defaultOrders = [
      { id: 1, order_number: 'IN-1730001', type: 'IN', warehouse_id: 1, reference: 'PO-2024-001', created_by: 1, status: 'NEW', created_at: '2025-11-17T08:30:00' },
      { id: 2, order_number: 'OUT-1730002', type: 'OUT', warehouse_id: 1, reference: 'SO-2024-001', created_by: 1, status: 'NEW', created_at: '2025-11-17T09:15:00' },
      { id: 3, order_number: 'IN-1730003', type: 'IN', warehouse_id: 2, reference: 'PO-2024-002', created_by: 1, status: 'NEW', created_at: '2025-11-16T14:20:00' },
      { id: 4, order_number: 'OUT-1730004', type: 'OUT', warehouse_id: 2, reference: 'SO-2024-002', created_by: 1, status: 'NEW', created_at: '2025-11-15T11:45:00' },
    ];
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(defaultOrders));
  }
};

// Products
export const getProducts = () => {
  initializeData();
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
};

export const saveProducts = (products: any[]) => {
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
};

// Warehouses
export const getWarehouses = () => {
  initializeData();
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.WAREHOUSES) || '[]');
};

export const saveWarehouses = (warehouses: any[]) => {
  localStorage.setItem(STORAGE_KEYS.WAREHOUSES, JSON.stringify(warehouses));
};

// Inventory
export const getInventory = () => {
  initializeData();
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.INVENTORY) || '[]');
};

export const saveInventory = (inventory: any[]) => {
  localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(inventory));
};

// Orders
export const getOrders = () => {
  initializeData();
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
};

export const saveOrder = (order: any) => {
  initializeData();
  const orders = getOrders();
  const products = getProducts();
  const warehouses = getWarehouses();
  const inventory = getInventory();
  
  const newOrder = {
    id: Math.max(0, ...orders.map((o: any) => o.id)) + 1,
    ...order,
    created_by: 1,
    status: 'NEW',
    created_at: new Date().toISOString(),
  };
  
  orders.push(newOrder);
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  
  // Update inventory based on order type
  const warehouse = warehouses.find((w: any) => w.id === order.warehouse_id);
  
  order.items.forEach((item: any) => {
    const product = products.find((p: any) => p.id === item.product_id);
    const invIndex = inventory.findIndex(
      (i: any) => i.product_id === item.product_id && i.warehouse_id === order.warehouse_id
    );
    
    if (invIndex >= 0) {
      // Update existing inventory
      if (order.type === 'IN') {
        inventory[invIndex].quantity += item.quantity;
      } else {
        inventory[invIndex].quantity -= item.quantity;
      }
    } else if (order.type === 'IN') {
      // Create new inventory record for inbound
      const newInv = {
        id: Math.max(0, ...inventory.map((i: any) => i.id)) + 1,
        product_id: item.product_id,
        product_sku: product.sku,
        product_name: product.name,
        warehouse_id: order.warehouse_id,
        warehouse_name: warehouse.name,
        location_code: `${warehouse.name.charAt(0)}-01-${inventory.length + 1}`,
        quantity: item.quantity,
      };
      inventory.push(newInv);
    }
  });
  
  saveInventory(inventory);
};
