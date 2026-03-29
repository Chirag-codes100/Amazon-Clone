import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ ADD THIS
import { getCart, removeFromCart, updateQuantity } from "../services/api";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate(); // ✅ ADD THIS

  const fetchCart = async () => {
    const data = await getCart();
    setCart(data);
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleRemove = async (id) => {
    await removeFromCart(id);
    fetchCart();
  };

  const handleQuantity = async (id, type) => {
    await updateQuantity(id, type);
    fetchCart();
  };

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>

      <div className="grid grid-cols-3 gap-6">

        {/* LEFT */}
        <div className="col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex bg-white p-4 rounded shadow"
            >
              <img
                src={item.image}
                className="w-32 h-32 object-contain"
              />

              <div className="ml-4 flex-1">
                <h2 className="font-semibold">{item.name}</h2>
                <p className="text-green-600 font-bold">
                  ₹{item.price}
                </p>

                <div className="flex items-center mt-3 gap-2">
                  <button
                    onClick={() => handleQuantity(item.id, "dec")}
                    className="px-3 py-1 bg-gray-300 rounded"
                  >
                    -
                  </button>

                  <span className="px-4">{item.quantity}</span>

                  <button
                    onClick={() => handleQuantity(item.id, "inc")}
                    className="px-3 py-1 bg-gray-300 rounded"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => handleRemove(item.id)}
                  className="text-red-500 mt-2"
                >
                  Remove
                </button>

                
              </div>
            </div>
          ))}
        </div>


        {/* RIGHT */}
        <div className="bg-white p-6 rounded shadow h-fit">
          <h2 className="text-xl font-semibold">
            Subtotal ({cart.length} items)
          </h2>

          <p className="text-2xl font-bold mt-2">
            ₹{total}
          </p>

          {/* ✅ FIXED BUTTON */}
          <button
            onClick={() => navigate("/checkout")}
            className="bg-yellow-400 w-full mt-4 py-2 rounded hover:bg-yellow-500"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;