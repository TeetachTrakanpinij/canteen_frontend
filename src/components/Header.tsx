import { useEffect, useState } from "react";
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import { User, ChevronLeft } from "lucide-react";
import Logo from "../assets/logo.png";

interface HeaderProps {
  lang: "th" | "en";
  setLang: (lang: "th" | "en") => void;
  isLoggedIn?: boolean; // สามารถใส่ได้
}

interface UserData {
  imageProfile?: string;
}

interface Canteen {
  _id: string;
  name: string;
}

export default function Header({ lang, setLang }: HeaderProps) {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserData | null>(null);
  const [canteen, setCanteen] = useState<Canteen | null>(null);
  const { canteenId } = useParams<{ canteenId?: string }>();
  const location = useLocation();

  // ดึงข้อมูลโรงอาหารถ้ามี canteenId
  useEffect(() => {
    const fetchCanteen = async () => {
      if (!canteenId) return;
      try {
        const res = await fetch(
          `https://canteen-backend-igyy.onrender.com/api/canteen/${canteenId}`
        );
        const data: Canteen = await res.json();
        setCanteen(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCanteen();
  }, [canteenId]);

  // กำหนดชื่อหน้า
  const pageTitle = (() => {
    if (location.pathname === "/") {
      return lang === "th" ? "โรงอาหารทั้งหมด" : "All Canteens";
    }
    if (location.pathname === "/profile") {
      return lang === "th" ? "โปรไฟล์ของฉัน" : "My Profile";
    }
    if (canteenId && location.pathname.startsWith("/canteen/")) {
      return lang === "th"
        ? `โรงอาหาร ${canteen?.name ?? ""}`
        : `Canteen ${canteen?.name ?? ""}`;
    }
    return "";
  })();

  // แสดง Logo หรือ Back button
  const pageLogo = (() => {
    if (location.pathname === "/") {
      return (
        <div>
          <img src={Logo} alt="Logo" className="h-10 w-16 object-contain" />
        </div>
      );
    }
    return (
      <button onClick={() => navigate(-1)} className="flex items-center">
        <ChevronLeft className="w-8 h-8 ml-1 text-orange-500" />
      </button>
    );
  })();

  // ดึงข้อมูลผู้ใช้
  const token = localStorage.getItem("authToken");
  useEffect(() => {
    if (!token) return;

    const fetchUser = async () => {
      try {
        const res = await fetch(
          "https://canteen-backend-igyy.onrender.com/api/user/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch user");
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
  }, [token]);

  return (
    <header className="font-thai relative flex items-center justify-between px-4 py-3 bg-white shadow-md border-b">
      {/* Left: Logo / Back Button */}
      <div className="flex items-center">{pageLogo}</div>

      {/* Center: Page Title */}
      <h1
        className="text-orange-500 font-bold text-base sm:text-lg md:text-xl truncate text-center
  relative mx-auto w-[70%] sm:w-auto sm:absolute sm:left-1/2 sm:transform sm:-translate-x-1/2 sm:max-w-[60%]"
      >
        {pageTitle}
      </h1>

      {/* Right: Language + Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Language Switch */}
        <div className="flex items-center border rounded-full overflow-hidden text-xs sm:text-sm shadow-sm">
          <button
            onClick={() => setLang("th")}
            className={`px-2 sm:px-3 py-1 transition-colors ${
              lang === "th"
                ? "bg-orange-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            TH
          </button>
          <button
            onClick={() => setLang("en")}
            className={`px-2 sm:px-3 py-1 transition-colors ${
              lang === "en"
                ? "bg-orange-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            EN
          </button>
        </div>

        {/* Profile */}
        <Link
          to={user ? "/profile" : "/login"}
          className="rounded-full border overflow-hidden w-10 h-10 flex items-center justify-center hover:shadow-md transition-shadow"
        >
          {user?.imageProfile ? (
            <img
              src={user.imageProfile}
              alt="User Avatar"
              className="h-full w-full object-cover rounded-full"
            />
          ) : (
            <User className="w-5 h-5 text-gray-500" />
          )}
        </Link>
      </div>
    </header>
  );
}

