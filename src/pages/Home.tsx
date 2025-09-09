import { Link } from "react-router-dom";
import { User } from "lucide-react";

export default function Home() {
  return (
    <div className="font-thai bg-white min-h-screen flex flex-col">
      {/* Header */}
      <header className="relative flex items-center justify-between p-4 border-b">
        {/* Logo */}
        <div className="font-bold text-xl">Logo</div>

        {/* All Canteen (ตรงกลางเสมอ) */}
        <h1 className="absolute left-1/2 transform -translate-x-1/2 text-orange-500 font-semibold text-lg">
          All Canteen
        </h1>

        {/* Language + Profile */}
        <div className="flex items-center gap-2">
          {/* Language Switch */}
          <div className="flex items-center border rounded-full overflow-hidden text-sm">
            <button className="px-2 py-1 bg-gray-200">TH</button>
            <button className="px-2 py-1 bg-orange-400 text-white">EN</button>
          </div>
          {/* Profile */}
          <Link
            to="/login"
            className="p-2 border rounded-full hover:bg-gray-100"
          >
            <User className="w-5 h-5" />
          </Link>
        </div>
      </header>

      {/* Welcome text */}
      <main className="flex flex-col items-center flex-1 mt-6">
        <p className="text-lg">
          Welcome ~{" "}
          <span className="text-orange-500 font-semibold">Name</span>
        </p>

        {/* Canteen list */}
        <div className="w-full max-w-md mt-6 flex flex-col gap-4 px-6">
          {/* Canteen A */}
          <Link
            to="/canteen-a"
            className="flex justify-between items-center border-2 border-yellow-400 rounded-xl px-4 py-3 shadow hover:bg-yellow-50 transition"
          >
            <span>Canteen A</span>
            <span>22/50</span>
          </Link>

          {/* Canteen B */}
          <Link
            to="/canteen-b"
            className="flex justify-between items-center border-2 border-red-400 rounded-xl px-4 py-3 shadow hover:bg-red-50 transition"
          >
            <span>Canteen B</span>
            <span>47/50</span>
          </Link>

          {/* Canteen C */}
          <Link
            to="/canteen-c"
            className="flex justify-between items-center border-2 border-green-400 rounded-xl px-4 py-3 shadow hover:bg-green-50 transition"
          >
            <span>Canteen C</span>
            <span>10/50</span>
          </Link>
        </div>
      </main>
    </div>
  );
}

