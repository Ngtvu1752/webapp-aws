const mysql = require('mysql2/promise'); 
const dbcreds = require('./DbConfig');

const pool = mysql.createPool({
    host: dbcreds.DB_HOST,
    user: dbcreds.DB_USER,
    password: dbcreds.DB_PWD,
    database: dbcreds.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    charset: 'utf8mb4'
});


// --- Users ---
async function login(username) {
    // Lưu ý: Trong thực tế cần check password_hash. Demo này chỉ lấy user theo username
    const users = await pool.query("SELECT * FROM users WHERE username = ?", [username]).then(([rows]) => rows);
    if (users.length === 0) return null;
    return users[0];
}

// --- Products ---
async function getAllProducts() {
    const [rows] = await pool.query("SELECT * FROM products");
    return rows;
}

async function addProduct(sku, name, uom, price) { 
    const [result] = await pool.query(
        "INSERT INTO products (sku, name, uom, price) VALUES (?, ?, ?, ?)", 
        [sku, name, uom, price]
    );
    return { id: result.insertId, sku, name, uom, price };
}

async function updateProduct(id, sku, name, uom, price) { 
    await pool.query(
        "UPDATE products SET sku = ?, name = ?, uom = ?, price = ? WHERE id = ?", 
        [sku, name, uom, price, id]
    );
    return { id, sku, name, uom, price };
}

async function deleteProduct(id) {
    await pool.query("DELETE FROM products WHERE id = ?", [id]);
    return { message: "Deleted" };
}

// --- Warehouses ---
async function getAllWarehouses() {
    const [rows] = await pool.query("SELECT * FROM warehouses");
    return rows;
}

async function addWarehouse(name, address) {
    const [result] = await pool.query("INSERT INTO warehouses (name, address) VALUES (?, ?)", [name, address]);
    return { id: result.insertId, name, address };
}

// --- Inventory ---
async function getInventory() {
    const sql = `
        SELECT i.*, 
               p.sku as product_sku, 
               p.name as product_name, 
               p.price as product_price,  -- Lấy thêm cột giá
               w.name as warehouse_name, 
               l.code as location_code 
        FROM inventory i
        JOIN products p ON i.product_id = p.id
        JOIN warehouses w ON i.warehouse_id = w.id
        LEFT JOIN locations l ON i.location_id = l.id
    `;
    const [rows] = await pool.query(sql);
    return rows;
}

// --- Orders ---
async function createOrder(orderData) {
    // orderData: { order_number, type, warehouse_id, reference, created_by, items: [{product_id, quantity}] }
    
    // 1. Insert Order
    const [orderResult] = await pool.query(
        "INSERT INTO orders (order_number, type, warehouse_id, reference, created_by, status) VALUES (?, ?, ?, ?, ?, 'NEW')",
        [orderData.order_number, orderData.type, orderData.warehouse_id, orderData.reference, orderData.created_by]
    );
    const orderId = orderResult.insertId;

    // 2. Insert Items & Update Inventory
    for (const item of orderData.items) {
        await pool.query(
            "INSERT INTO order_items (order_id, product_id, quantity) VALUES (?, ?, ?)",
            [orderId, item.product_id, item.quantity]
        );

        // Simple Inventory Update Logic (Cần logic phức tạp hơn cho location trong thực tế)
        // Check if inventory exists for product + warehouse
        const [inv] = await pool.query(
            "SELECT id, quantity FROM inventory WHERE product_id = ? AND warehouse_id = ?",
            [item.product_id, orderData.warehouse_id]
        );

        if (inv.length > 0) {
            let newQty = inv[0].quantity;
            if (orderData.type === 'IN') newQty += parseFloat(item.quantity);
            else newQty -= parseFloat(item.quantity);
            
            await pool.query("UPDATE inventory SET quantity = ? WHERE id = ?", [newQty, inv[0].id]);
        } else if (orderData.type === 'IN') {
            await pool.query(
                "INSERT INTO inventory (product_id, warehouse_id, quantity) VALUES (?, ?, ?)",
                [item.product_id, orderData.warehouse_id, item.quantity]
            );
        }
    }

    return { message: "Order created successfully", orderId };
}

async function getStats() {
    const [products] = await pool.query("SELECT COUNT(*) as count FROM products");
    const [ordersIn] = await pool.query("SELECT COUNT(*) as count FROM orders WHERE type='IN' AND DATE(created_at) = CURDATE()");
    const [ordersOut] = await pool.query("SELECT COUNT(*) as count FROM orders WHERE type='OUT' AND DATE(created_at) = CURDATE()");
    const [lowStock] = await pool.query("SELECT COUNT(*) as count FROM inventory WHERE quantity < 10");

    return {
        totalProducts: products[0].count,
        inboundToday: ordersIn[0].count,
        outboundToday: ordersOut[0].count,
        lowStockItems: lowStock[0].count
    };
}

async function getAllOrders() {
    const [rows] = await pool.query("SELECT * FROM orders");
    return rows;
}
async function updateWarehouse(id, name, address) {
    await pool.query("UPDATE warehouses SET name = ?, address = ? WHERE id = ?", [name, address, id]);
    return { id, name, address };
}

async function deleteWarehouse(id) {
    await pool.query("DELETE FROM warehouses WHERE id = ?", [id]);
    return { message: "Deleted" };
}
module.exports = { 
    login, 
    getAllProducts, addProduct, updateProduct, deleteProduct,
    getAllWarehouses, addWarehouse,
    getInventory,
    createOrder,
    getAllOrders,
    getStats,
    updateWarehouse,
    deleteWarehouse
};