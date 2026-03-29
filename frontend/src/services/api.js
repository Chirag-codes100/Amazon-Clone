import { supabase } from "../supabase";

// ✅ GET PRODUCTS
export const getProducts = async () => {
  const { data, error } = await supabase.from("products").select("*");

  if (error) {
    console.error("getProducts error:", error);
    return [];
  }

  return data || [];
};

// ✅ ADD TO CART
export const addToCart = async (product_id) => {
  const { error } = await supabase
    .from("cart")
    .insert([{ product_id, quantity: 1 }]);

  if (error) {
    console.error("addToCart error:", error);
  }

  window.dispatchEvent(new Event("cartUpdated"));
};

// ✅ GET CART
export const getCart = async () => {
  const { data, error } = await supabase
    .from("cart")
    .select("id, quantity, products(name, price, image)");

  if (error) {
    console.error("getCart error:", error);
    return [];
  }

  return data || [];
};

// ✅ CART COUNT
export const getCartCount = async () => {
  const { data, error } = await supabase.from("cart").select("*");

  if (error) {
    console.error("getCartCount error:", error);
    return 0;
  }

  return data?.length || 0;
};

// ✅ GET SINGLE PRODUCT
export const getProductById = async (id) => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("getProductById error:", error);
    return null;
  }

  return data;
};

// ✅ REMOVE FROM CART
export const removeFromCart = async (id) => {
  const { error } = await supabase
    .from("cart")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("removeFromCart error:", error);
  }

  window.dispatchEvent(new Event("cartUpdated"));
};

// ✅ UPDATE CART QUANTITY
export const updateQuantity = async (id, type) => {
  // First get current quantity
  const { data, error } = await supabase
    .from("cart")
    .select("quantity")
    .eq("id", id)
    .single();

  if (error) {
    console.error("fetch quantity error:", error);
    return;
  }

  let newQty = data.quantity;

  if (type === "inc") newQty += 1;
  else if (type === "dec") newQty = Math.max(1, newQty - 1);

  // Update in DB
  const { error: updateError } = await supabase
    .from("cart")
    .update({ quantity: newQty })
    .eq("id", id);

  if (updateError) {
    console.error("update quantity error:", updateError);
  }

  // Refresh UI
  window.dispatchEvent(new Event("cartUpdated"));
};

// ✅ PLACE ORDER
export const placeOrder = async () => {
  // 1. Get cart items
  const { data: cartItems, error } = await supabase
    .from("cart")
    .select("id, product_id, quantity, products(price)");

  if (error) {
    console.error("fetch cart error:", error);
    return null;
  }

  if (!cartItems || cartItems.length === 0) {
    alert("Cart is empty");
    return null;
  }

  // 2. Calculate total
  let total = 0;
  cartItems.forEach((item) => {
    total += item.quantity * item.products.price;
  });

  // 3. Create order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert([{ total }])
    .select()
    .single();

  if (orderError) {
    console.error("order error:", orderError);
    return null;
  }

  // 4. Insert order items
  const orderItems = cartItems.map((item) => ({
    order_id: order.id,
    product_id: item.product_id,
    quantity: item.quantity,
  }));

  await supabase.from("order_items").insert(orderItems);

  // 5. Clear cart
  await supabase.from("cart").delete().neq("id", 0);

  return order.id;
};