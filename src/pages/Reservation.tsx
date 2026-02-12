import { useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Logo from "../assets/logo.png";

interface ReservationResponse {
  message: string;
  reservation: {
    _id: string;
    tableID: string;
    userID: string;
    duration_minutes: number;
    reserved_at: string;
  };
}

interface ReservationProps {
  lang: "th" | "en";
}

export default function ReservationPage({ lang }: ReservationProps) {
  const { tableId } = useParams<{ tableId: string }>();
  const location = useLocation();
  const state = location.state as { tableNumber?: string };
  const navigate = useNavigate();

  const [duration, setDuration] = useState("10");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const translations = {
  th: {
    title: "จองโต๊ะ",
    loginFirst: "กรุณาเข้าสู่ระบบก่อนจองโต๊ะ",
    reserveFail: "การจองล้มเหลว",
    reserving: "กำลังจอง...",
    confirm: "ยืนยันการจอง",
    minute: "นาที",
    
  },
  en: {
    title: "Reserve Table",
    loginFirst: "Please login before making a reservation",
    reserveFail: "Reservation failed",
    reserving: "Reserving...",
    confirm: "Confirm Reservation",
    minute: "minutes",
    
  }
}as const;

const t = translations[lang];

  const handleReservation = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError(t.loginFirst);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await fetch(
        `https://canteen-backend-igyy.onrender.com/api/reservation/${tableId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ duration_minutes: Number(duration) }),
        }
      );

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || t.reserveFail);
      }

      const data: ReservationResponse = await res.json();

      // เก็บ reservation ใน localStorage ให้ Home ใช้
      localStorage.setItem("activeReservation", JSON.stringify(data.reservation));
      setShowPopup(true);

      // กลับหน้า Home
      navigate("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-r from-[#FF8001] to-[#FBC02D] flex flex-col items-center px-4">
      <img src={Logo} alt="Logo" className="w-24 h-24 mt-10 mb-6 sm:mb-8 object-contain" />

      <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-sm w-full flex flex-col items-center">
        <h1 className="text-xl font-bold mb-4 text-gray-800 text-center">{t.title}</h1>

        <select
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
        >
          <option value="10">10 {t.minute}</option>
          <option value="15">15 {t.minute}</option>
        </select>

        {error && <p className="text-red-500 mb-3 text-center">{error}</p>}

        <button
          onClick={handleReservation}
          disabled={loading}
          className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 disabled:bg-gray-400 transition font-semibold"
        >
          {loading ? t.reserving : t.confirm}
        </button>
      </div>
    </div>
  );
}




