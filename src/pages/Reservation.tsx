import { useState } from "react";
import { useParams, useLocation } from "react-router-dom";
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
  const [duration, setDuration] = useState("10");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [reservationId, setReservationId] = useState<string | null>(null);
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
      setReservationId(data.reservation._id);
      setShowPopup(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!reservationId) return;

    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("กรุณาเข้าสู่ระบบก่อนยกเลิกการจอง");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `https://canteen-backend-igyy.onrender.com/api/reservation/${reservationId}/cancel`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "ยกเลิกไม่สำเร็จ");
      }
      setShowPopup(false);
      setReservationId(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleScanQR = () => {
    alert("เปิดกล้องสแกน QR Code (ใส่ QR scanner component ที่นี่)");
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-r from-[#FF8001] to-[#FBC02D] flex flex-col  items-center px-4">
      {/* โลโก้เหนือกล่อง */}
      <img
        src={Logo}
        alt="Logo"
        className="w-24 h-24 mt-10 mb-6 sm:mb-8 object-contain"
      />

      {/* กล่องตรงกลาง */}
      <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-sm w-full flex flex-col items-center">
        {/* Header */}
        <h1 className="text-xl font-bold mb-4 text-gray-800 text-center">
          จองโต๊ะ
        </h1>

        {/* เลือกเวลา */}
        <select
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
        >
          <option value="10">10 นาที</option>
          <option value="15">15 นาที</option>
        </select>

        {/* Error */}
        {error && <p className="text-red-500 mb-3 text-center">{error}</p>}

        {/* ปุ่มยืนยัน */}
        <button
          onClick={handleReservation}
          disabled={loading}
          className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 disabled:bg-gray-400 transition font-semibold"
        >
          {loading ? "กำลังจอง..." : "ยืนยันการจอง"}
        </button>
      </div>

      {/* Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-sm text-center">
            <h2 className="text-xl font-bold mb-3 text-gray-800">
              การจองสำเร็จ!
            </h2>
            <p className="mb-3 text-gray-700 text-sm">
              คุณได้จองโต๊ะเรียบร้อยแล้ว
              <br />
              สามารถสแกน QR Code หรือยกเลิกการจองได้
            </p>
            <div className="flex justify-between gap-3">
              <button
                onClick={handleScanQR}
                className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition text-sm"
              >
                สแกน QR Code
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition text-sm"
              >
                ยกเลิกการจอง
              </button>
            </div>
            <button
              onClick={() => setShowPopup(false)}
              className="mt-3 text-gray-500 underline text-sm"
            >
              ปิด
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


