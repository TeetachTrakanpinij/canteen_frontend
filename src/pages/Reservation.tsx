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

export default function ReservationPage() {
  const { tableId } = useParams<{ tableId: string }>();
  const location = useLocation();
  const state = location.state as { tableNumber?: string };
  const navigate = useNavigate();

  const [duration, setDuration] = useState("10");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const handleReservation = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("กรุณาเข้าสู่ระบบก่อนจองโต๊ะ");
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
        throw new Error(errData.message || "การจองล้มเหลว");
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
        <h1 className="text-xl font-bold mb-4 text-gray-800 text-center">จองโต๊ะ</h1>

        <select
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
        >
          <option value="10">10 นาที</option>
          <option value="15">15 นาที</option>
        </select>

        {error && <p className="text-red-500 mb-3 text-center">{error}</p>}

        <button
          onClick={handleReservation}
          disabled={loading}
          className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 disabled:bg-gray-400 transition font-semibold"
        >
          {loading ? "กำลังจอง..." : "ยืนยันการจอง"}
        </button>
      </div>
    </div>
  );
}




