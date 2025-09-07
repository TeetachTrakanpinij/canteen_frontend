import { ChevronLeft } from "lucide-react";

export default function Regis() {
  return (
    <div className="bg-gradient-to-r from-[#FF8001] to-[#FBC02D] h-screen">
        <div className="fixed">
                {/* Back button */}
            <button
                onClick={() => (window.location.href = "/")}
                className=""
            >
            <ChevronLeft className="w-10 h-10 ml-10 mt-10 text-icon" />
            </button>
        </div>

        <div className="flex items-center justify-center h-screen">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-6">
          Smart Canteen Sign Up
        </h1>

        {/* Name */}
        <input
          type="text"
          placeholder="Full Name"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-[#FF8001]"
        />

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-[#FF8001]"
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-[#FF8001]"
        />

        {/* Confirm Password */}
        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-[#FF8001]"
        />

        {/* Button */}
        <button className="w-full bg-[#FF8001] hover:bg-[#FBC02D] text-white font-semibold py-2 rounded-lg transition">
          Sign Up
        </button>

        {/* Footer */}
        <p className="text-sm text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-[#FF8001] hover:underline">
            Log In Here!
          </a>
        </p>
      </div>
    </div>
    </div>
  );
}
