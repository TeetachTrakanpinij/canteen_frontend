import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function Checkin() {
  const navigate = useNavigate();
  const { tableId } = useParams<{ tableId?: string }>();

  useEffect(() => {
    const activateTable = async () => {
      if (!tableId) {
        navigate("/"); // ถ้าไม่มี tableId กลับหน้าแรก
        return;
      }

      try {
        const token = localStorage.getItem("authToken"); // ดึง token

        // ✅ สร้าง headers ให้ชัดเจน
        const headers: HeadersInit = {
          "Content-Type": "application/json",
        };
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const res = await fetch(
          `https://canteen-backend-igyy.onrender.com/api/reservation/${tableId}/activate`,
          {
            method: "POST",
            headers,
          }
        );

        if (!res.ok) throw new Error("ไม่สามารถเช็คอินโต๊ะได้");

        // สำเร็จ → redirect ไป /Reservation
        navigate("/Reservation", { replace: true });
      } catch (err) {
        console.error(err);
        alert("เกิดข้อผิดพลาดในการเช็คอินโต๊ะ");
        navigate("/", { replace: true });
      }
    };

    activateTable();
  }, [tableId, navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-lg">กำลังเช็คอินโต๊ะ...</p>
    </div>
  );
}

