const BASE_URL = "http://localhost:5000";

// 🔥 GLOBAL EVENT (cart update trigger)
const notifyCartChange = () => {
  console.log("Triggering cart update 🚀"); // debug
  window.dispatchEvent(new Event("cartUpdated"));
};

// Get products
export const getProducts = async () => {
  const res = await fetch(`${BASE_URL}/products`);
  return res.json();
};

// Add to cart
export const addToCart = async (product_id) => {
  const res = await fetch(`${BASE_URL}/cart`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ product_id }),
  });

  notifyCartChange(); // ✅ trigger update
  return res.json();
};

// Get cart
export const getCart = async () => {
  const res = await fetch(`${BASE_URL}/cart`);
  return res.json();
};

// Remove from cart
export const removeFromCart = async (id) => {
  const res = await fetch(`${BASE_URL}/cart/${id}`, {
    method: "DELETE",
  });

  notifyCartChange(); // ✅ trigger update
  return res.json();
};

// Update quantity
export const updateQuantity = async (id, type) => {
  const res = await fetch(`${BASE_URL}/cart/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ type }),
  });

  notifyCartChange(); // ✅ trigger update
  return res.json();
};

// Place order
export const placeOrder = async () => {
  const res = await fetch(`${BASE_URL}/orders`, {
    method: "POST",
  });

  notifyCartChange(); // ✅ clear cart → update badge
  return res.json();
};

// Get single product
export const getProductById = async (id) => {
  const res = await fetch(`${BASE_URL}/products/${id}`);
  return res.json();
};

// Get cart count
export const getCartCount = async () => {
  const res = await fetch(`${BASE_URL}/cart`);
  const data = await res.json();
  return data.reduce((sum, item) => sum + item.quantity, 0);
};