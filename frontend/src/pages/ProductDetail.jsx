import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById, addToCart } from "../services/api";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    getProductById(id).then((data) => {
      // ✅ HANDLE BOTH image AND images
      let imgs = [];

      try {
        imgs = data.images ? JSON.parse(data.images) : [];
      } catch {
        imgs = [];
      }

      if (!imgs.length && data.image) {
        imgs = [data.image]; // fallback
      }

      data.images = imgs;
      setProduct(data);
    });
  }, [id]);

  const handleAddToCart = async () => {
    await addToCart(product.id);
    alert("Added to cart 🛒");
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-6 rounded shadow">

        {/* 🔥 LEFT: IMAGE SECTION */}
        <div>
          <img
            src={product.images[current]}
            className="w-full h-[350px] object-contain"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/300";
            }}
          />

          {/* Thumbnails */}
          <div className="flex gap-2 mt-4">
            {product.images.map((img, index) => (
              <img
                key={index}
                src={img}
                onClick={() => setCurrent(index)}
                className={`w-16 h-16 object-contain border cursor-pointer p-1 ${
                  current === index
                    ? "border-yellow-500"
                    : "border-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* 🔥 MIDDLE: DETAILS */}
        <div>
          <h1 className="text-xl font-semibold">{product.name}</h1>

          <p className="text-green-600 text-lg mt-2">
            ₹{product.price}
          </p>

          <p className="mt-4 text-gray-700">
            {product.description || "No description available"}
          </p>

          {/* ✅ ABOUT */}
          <div className="mt-6">
            <h3 className="font-semibold text-lg">About this item</h3>

            <ul className="list-disc ml-5 mt-2 text-gray-700 space-y-1">
              <li>High performance product</li>
              <li>Premium quality materials</li>
              <li>Long-lasting durability</li>
              <li>Best value for money</li>
            </ul>
          </div>

          {/* ✅ TECHNICAL DETAILS */}
          <div className="mt-6">
            <h3 className="font-semibold text-lg">Technical Details</h3>

            <div className="mt-2 text-sm text-gray-700 space-y-1">
              <p><strong>Category:</strong> {product.category}</p>
              <p><strong>Stock:</strong> {product.stock}</p>
              <p><strong>Brand:</strong> Generic</p>
            </div>
          </div>
        </div>

        {/* 🔥 RIGHT: BUY BOX */}
        <div className="border p-4 rounded h-fit shadow-md">

          <p className="text-xl font-bold">₹{product.price}</p>

          <p className="text-green-600 mt-2">
            {product.stock > 0 ? "In Stock" : "Out of Stock"}
          </p>

          {/* Quantity */}
          <div className="mt-3">
            <label className="mr-2">Qty:</label>
            <select className="border px-2 py-1 rounded">
              {[1,2,3,4,5].map((q) => (
                <option key={q}>{q}</option>
              ))}
            </select>
          </div>

          {/* Buttons */}
          <button
            onClick={handleAddToCart}
            className="bg-yellow-400 w-full mt-4 py-2 rounded font-semibold
                       hover:bg-yellow-500 active:scale-95 transition duration-150"
          >
            Add to Cart
          </button>

          <button
            onClick={() => navigate("/checkout")}
            className="bg-orange-400 w-full mt-2 py-2 rounded font-semibold
                       hover:bg-orange-500 active:scale-95 transition duration-150"
          >
            Buy Now
          </button>

          {/* Extra Info */}
          <div className="mt-4 text-sm text-gray-600 space-y-1">
            <p>🔒 Secure transaction</p>
            <p>↩ 10-day return policy</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetail;