import { useNavigate } from "react-router-dom";
import { addToCart } from "../services/api";
import { useState } from "react";

function ProductCard({ product }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async (e) => {
    e.stopPropagation(); // prevent redirect
    try {
      setLoading(true);

      await addToCart(product.id);

      // ✅ Trigger navbar update
      window.dispatchEvent(new Event("cartUpdated"));

      alert("Added to cart 🛒");
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 shadow rounded hover:shadow-xl transition flex flex-col justify-between">

      {/* CLICKABLE AREA */}
      <div
        onClick={() => navigate(`/product/${product.id}`)}
        className="cursor-pointer"
      >
        {/* Image */}
        <img
          src={product.image}
          alt={product.name}
          className="h-40 w-full object-contain"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/200";
          }}
        />

        {/* Name */}
        <h2 className="text-sm font-medium mt-2 line-clamp-2">
          {product.name}
        </h2>
      </div>

      {/* Price */}
      <p className="text-lg font-bold mt-1">
        ₹{product.price}
      </p>

      {/* Button */}
      <button
        onClick={handleAddToCart}
        disabled={loading}
        className="bg-yellow-400 w-full mt-2 py-2 rounded hover:bg-yellow-500 transition disabled:opacity-50"
      >
        {loading ? "Adding..." : "Add to Cart"}
      </button>

    </div>
  );
}

export default ProductCard;