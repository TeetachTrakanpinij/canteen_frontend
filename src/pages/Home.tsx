import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="bg-gradient-to-r from-[#FF8001] to-[#FBC02D] h-screen flex flex-col items-center justify-center text-white">
      <h1 className="text-4xl font-bold mb-6">Welcome to Smart Canteen</h1>
      <p className="text-lg mb-10">Your smart way to order and enjoy food 🍴</p>

      <div className="flex gap-4">
        {/* Login Button */}
        <Link
          to="/login"
          className="bg-white text-[#FF8001] font-semibold px-6 py-2 rounded-xl shadow hover:bg-gray-100 transition"
        >
          Log In
        </Link>

        {/* Register Button */}
        <Link
          to="/signup"
          className="bg-[#FF8001] text-white font-semibold px-6 py-2 rounded-xl shadow hover:bg-[#FBC02D] transition"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
}
