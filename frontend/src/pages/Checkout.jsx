import { useEffect, useState } from "react";
import { getCart, placeOrder } from "../services/api";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getCart().then(setCart);
  }, []);

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleOrder = async () => {
    const res = await placeOrder();
    navigate(`/order/${res.orderId}`);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen grid grid-cols-1 md:grid-cols-3 gap-6">

      {/* LEFT: ADDRESS */}
      <div className="md:col-span-2 bg-white p-6 rounded shadow">

        <h2 className="text-xl font-bold mb-4">Shipping Address</h2>

        <input className="w-full border p-2 mb-3 rounded" placeholder="Full Name" />
        <input className="w-full border p-2 mb-3 rounded" placeholder="Address" />

        <div className="grid grid-cols-2 gap-3">
          <input className="border p-2 rounded" placeholder="City" />
          <input className="border p-2 rounded" placeholder="State" />
        </div>

        <div className="grid grid-cols-2 gap-3 mt-3">
          <input className="border p-2 rounded" placeholder="ZIP Code" />
          <input className="border p-2 rounded" placeholder="Phone" />
        </div>

        {/* REVIEW */}
        <h3 className="mt-6 font-bold">Review Items</h3>

        {cart.map((item) => (
          <div key={item.id} className="flex gap-3 mt-3">
            <img src={item.image} className="w-16 h-16 object-contain" />
            <div>
              <p>{item.name}</p>
              <p className="font-bold">₹{item.price}</p>
            </div>
          </div>
        ))}
      </div>

      {/* RIGHT: SUMMARY */}
      <div className="bg-white p-6 rounded shadow h-fit">

        <button
          onClick={handleOrder}
          className="bg-yellow-400 w-full py-2 rounded font-semibold hover:bg-yellow-500"
        >
          Place Order
        </button>

        <h2 className="mt-4 font-bold">Order Summary</h2>

        <div className="mt-2 text-sm space-y-2">
          <div className="flex justify-between">
            <span>Items ({cart.length})</span>
            <span>₹{total}</span>
          </div>

          <div className="flex justify-between">
            <span>Shipping</span>
            <span>FREE</span>
          </div>

          <div className="flex justify-between text-lg font-bold text-red-600">
            <span>Total</span>
            <span>₹{total}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;