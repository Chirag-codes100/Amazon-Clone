import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import ProductDetail from "./pages/ProductDetail";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Cart from "./pages/Cart";

// ✅ ADD THESE IMPORTS
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";

function App() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  return (
    <Router>
      <MainLayout
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
      >
        <Routes>
          <Route
            path="/"
            element={<Home search={search} category={category} />}
          />

          <Route path="/cart" element={<Cart />} />
          <Route path="/product/:id" element={<ProductDetail />} />

          {/* 🔥 ADD THESE 2 LINES */}
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order/:id" element={<OrderSuccess />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;