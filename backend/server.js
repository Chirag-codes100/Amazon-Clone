const PORT = process.env.PORT || 5000;
const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const app = express();
app.use(cors());
app.use(express.json());

const db = new sqlite3.Database("./database.db");

// ================= DATABASE SETUP =================
db.serialize(() => {
  // Products Table
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      price REAL,
      image TEXT,
      category TEXT,
      description TEXT,
      stock INTEGER
    )
  `);

  // Cart Table
  db.run(`
    CREATE TABLE IF NOT EXISTS cart (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER,
      quantity INTEGER DEFAULT 1
    )
  `);

  // ✅ Orders Table
  db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      total REAL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // ✅ Order Items Table
  db.run(`
    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER,
      product_id INTEGER,
      quantity INTEGER
    )
  `);

  // ✅ Seed Data (only once)
  db.get("SELECT COUNT(*) as count FROM products", (err, row) => {
    if (row.count === 0) {
      db.run(`
        INSERT INTO products (name, price, image, category, description, stock)
        VALUES
        ('iPhone 14 Pro Max', 129999, 'https://images.unsplash.com/photo-1678652197831-2d180705cd2c', 'mobile', 'Apple smartphone', 10),

        ('Boat Rockerz Headphones', 1999, 'https://images.unsplash.com/photo-1518444065439-e933c06ce9cd', 'electronics', 'Wireless headphones', 20),

        ('HP Laptop 15s', 55999, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8', 'laptop', 'HP laptop', 15),

        ('Nike Running Shoes', 4999, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff', 'shoes', 'Sports shoes', 25)
      `);
    }
  });
});

// ================= PRODUCTS =================

// Get all products
app.get("/products", (req, res) => {
  db.all("SELECT * FROM products", [], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

// Get single product
app.get("/products/:id", (req, res) => {
  db.get("SELECT * FROM products WHERE id = ?", [req.params.id], (err, row) => {
    if (err) return res.status(500).json(err);
    res.json(row);
  });
});

// ================= CART =================

// Add to cart
app.post("/cart", (req, res) => {
  const { product_id } = req.body;

  db.get(
    "SELECT * FROM cart WHERE product_id = ?",
    [product_id],
    (err, row) => {
      if (row) {
        db.run(
          "UPDATE cart SET quantity = quantity + 1 WHERE product_id = ?",
          [product_id]
        );
      } else {
        db.run(
          "INSERT INTO cart (product_id, quantity) VALUES (?, 1)",
          [product_id]
        );
      }

      res.json({ message: "Added to cart" });
    }
  );
});

// Get cart
app.get("/cart", (req, res) => {
  db.all(
    `SELECT cart.id, cart.product_id, products.name, products.price, products.image, cart.quantity
     FROM cart
     JOIN products ON cart.product_id = products.id`,
    [],
    (err, rows) => {
      if (err) return res.status(500).json(err);
      res.json(rows);
    }
  );
});

// Update quantity
app.put("/cart/:id", (req, res) => {
  const { type } = req.body;

  if (type === "inc") {
    db.run("UPDATE cart SET quantity = quantity + 1 WHERE id = ?", [req.params.id]);
  } else {
    db.run(
      "UPDATE cart SET quantity = CASE WHEN quantity > 1 THEN quantity - 1 ELSE 1 END WHERE id = ?",
      [req.params.id]
    );
  }

  res.json({ message: "Quantity updated" });
});

// Remove item
app.delete("/cart/:id", (req, res) => {
  db.run("DELETE FROM cart WHERE id = ?", [req.params.id], function (err) {
    if (err) return res.status(500).json(err);
    res.json({ message: "Item removed" });
  });
});

// ================= ORDERS =================

// Place order
app.post("/orders", (req, res) => {
  db.all(
    `SELECT cart.product_id, cart.quantity, products.price
     FROM cart
     JOIN products ON cart.product_id = products.id`,
    [],
    (err, cartItems) => {
      if (cartItems.length === 0) {
        return res.json({ message: "Cart is empty" });
      }

      let total = 0;

      cartItems.forEach((item) => {
        total += item.quantity * item.price;
      });

      // Create order
      db.run(
        "INSERT INTO orders (total) VALUES (?)",
        [total],
        function (err) {
          const orderId = this.lastID;

          // Insert order items
          cartItems.forEach((item) => {
            db.run(
              "INSERT INTO order_items (order_id, product_id, quantity) VALUES (?, ?, ?)",
              [orderId, item.product_id, item.quantity]
            );
          });

          // Clear cart
          db.run("DELETE FROM cart");

          res.json({ orderId });
        }
      );
    }
  );
});

// ================= SERVER =================
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
