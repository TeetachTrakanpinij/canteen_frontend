import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

/* ================== TYPES ================== */
interface Menu {
  _id: string;
  name: string;
}

interface Inn {
  _id: string;
  innNumber: number;
  name: string;
  type: "food" | "drink";
  arduinoSensor: boolean;
  menus: Menu[];
}

/* ================== PAGE ================== */
const MenuPage = () => {
  const { innId } = useParams();
  const { isAdmin, isChef } = useUser();
  const canEdit = isAdmin || isChef;

  const [inn, setInn] = useState<Inn | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ===== FETCH INN ===== */
  useEffect(() => {
    if (!innId) return;

    setLoading(true);

    fetch(`https://canteen-backend-igyy.onrender.com/api/inns/${innId}`)
      .then((res) => {
        if (!res.ok) throw new Error("ไม่พบข้อมูลร้าน");
        return res.json();
      })
      .then((data) => {
        setInn(data);
        setError("");
      })
      .catch((err) => {
        console.error(err);
        setError("โหลดข้อมูลร้านไม่สำเร็จ");
      })
      .finally(() => setLoading(false));
  }, [innId]);

  /* ===== UI STATES ===== */
  if (loading) {
    return <div className="p-6">กำลังโหลดข้อมูล...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  if (!inn) {
    return <div className="p-6">ไม่พบข้อมูลร้าน</div>;
  }

  /* ================== RENDER ================== */
  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* ===== HEADER ===== */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{inn.name}</h1>
        <p className="text-gray-600">
          ประเภท: {inn.type === "food" ? "อาหาร" : "เครื่องดื่ม"}
        </p>
      </div>

      {/* ===== MENU LIST ===== */}
      <div className="space-y-3">
        {inn.menus.length === 0 && (
          <p className="text-gray-500">ยังไม่มีเมนู</p>
        )}

        {inn.menus.map((menu) => (
          <div
            key={menu._id}
            className="border rounded-md p-3 flex justify-between items-center"
          >
            <span className="font-medium">{menu.name}</span>

            {/* admin / chef เท่านั้น */}
            {canEdit && (
              <button
                className="text-sm text-blue-600 hover:underline"
                onClick={() => {
                  console.log("edit menu:", menu._id);
                }}
              >
                แก้ไข
              </button>
            )}
          </div>
        ))}
      </div>

      {/* ===== ADD MENU BUTTON ===== */}
      {canEdit && (
        <div className="mt-6">
          <button
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            onClick={() => {
              console.log("add menu");
            }}
          >
            + เพิ่มเมนู
          </button>
        </div>
      )}
    </div>
  );
};

export default MenuPage;
