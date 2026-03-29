import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCartCount } from "../services/api";

const Navbar = ({ search, setSearch, category, setCategory }) => {
  const [count, setCount] = useState(0);

  const fetchCount = async () => {
    const c = await getCartCount();
    setCount(c);
  };

  useEffect(() => {
    fetchCount();

    const handleUpdate = () => {
      fetchCount();
    };

    window.addEventListener("cartUpdated", handleUpdate);
    window.addEventListener("focus", fetchCount);

    return () => {
      window.removeEventListener("cartUpdated", handleUpdate);
      window.removeEventListener("focus", fetchCount);
    };
  }, []);

  return (
    <div className="bg-[#131921] text-white">

      {/* 🔥 TOP NAV */}
      <div className="flex items-center px-4 py-2 gap-4">

        {/* LOGO */}
        <NavLink
          to="/"
          className={({ isActive }) =>
            `text-2xl font-bold ${
              isActive ? "text-yellow-400" : "hover:text-yellow-400"
            }`
          }
        >
          amazon<span className="text-yellow-400">.in</span>
        </NavLink>

        {/* LOCATION */}
        <div className="text-xs leading-tight cursor-pointer">
          <p className="text-gray-300">Deliver to</p>
          <p className="font-bold">Select your location</p>
        </div>

        {/* 🔥 SEARCH */}
        <div className="flex flex-1 mx-4 border rounded overflow-hidden bg-white">

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-gray-200 text-black px-2 outline-none"
          >
            <option value="">All</option>
            <option value="mobile">Mobile</option>
            <option value="electronics">Electronics</option>
            <option value="laptop">Laptop</option>
            <option value="shoes">Shoes</option>
          </select>

          <input
            type="text"
            placeholder="Search Amazon.in"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-3 py-2 text-black outline-none"
          />

          <button className="bg-yellow-400 px-4 text-black font-bold hover:bg-yellow-500">
            🔍
          </button>
        </div>

        {/* ACCOUNT */}
        <NavLink
          to="/auth"
          className={({ isActive }) =>
            `text-xs leading-tight ${
              isActive ? "text-yellow-400" : "hover:text-yellow-400"
            }`
          }
        >
          <p>Hello, User</p>
          <p className="font-bold">Account & Lists</p>
        </NavLink>

        {/* ORDERS */}
        <NavLink
          to="/orders"
          className={({ isActive }) =>
            `text-xs leading-tight ${
              isActive ? "text-yellow-400" : "hover:text-yellow-400"
            }`
          }
        >
          <p>Returns</p>
          <p className="font-bold">& Orders</p>
        </NavLink>

        {/* 🔥 CART */}
        <NavLink
          to="/cart"
          className={({ isActive }) =>
            `relative flex items-center gap-1 ${
              isActive ? "text-yellow-400 font-bold" : "hover:text-yellow-400"
            }`
          }
        >
          🛒
          <span className="font-bold">Cart</span>

          {count > 0 && (
            <span className="absolute -top-2 left-3 bg-yellow-400 text-black text-xs px-2 rounded-full">
              {count}
            </span>
          )}
        </NavLink>

      </div>

      {/* 🔥 BOTTOM NAV */}
      <div className="bg-[#232f3e] px-4 py-2 flex items-center gap-6 text-sm overflow-x-auto">

        <span className="font-bold cursor-pointer">☰ All</span>

        <NavLink to="/fresh" className={({ isActive }) => isActive ? "underline text-yellow-400" : "hover:underline"}>Fresh</NavLink>
        <NavLink to="/prime" className={({ isActive }) => isActive ? "underline text-yellow-400" : "hover:underline"}>Prime</NavLink>
        <NavLink to="/mx" className={({ isActive }) => isActive ? "underline text-yellow-400" : "hover:underline"}>MX Player</NavLink>
        <NavLink to="/sell" className={({ isActive }) => isActive ? "underline text-yellow-400" : "hover:underline"}>Sell</NavLink>
        <NavLink to="/gift" className={({ isActive }) => isActive ? "underline text-yellow-400" : "hover:underline"}>Gift Cards</NavLink>
        <NavLink to="/basics" className={({ isActive }) => isActive ? "underline text-yellow-400" : "hover:underline"}>AmazonBasics</NavLink>
        <NavLink to="/buy-again" className={({ isActive }) => isActive ? "underline text-yellow-400" : "hover:underline"}>Buy Again</NavLink>
        <NavLink to="/pay" className={({ isActive }) => isActive ? "underline text-yellow-400" : "hover:underline"}>Amazon Pay</NavLink>

      </div>
    </div>
  );
};

export default Navbar;