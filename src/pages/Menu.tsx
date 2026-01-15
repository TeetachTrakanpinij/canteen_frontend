import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

/* ================== TYPES ================== */
interface Menu {
  _id: string;
  name: string;
  price: number;
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

  /* ===== MODAL STATES (เพิ่ม / แก้ไข) ===== */
  const [showModal, setShowModal] = useState(false);
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);
  const [menuName, setMenuName] = useState("");

  // 🔧 แก้ตรงนี้: ให้ราคาพิมพ์เลขได้ลื่น
  const [menuPrice, setMenuPrice] = useState<number | "">("");

  /* ===== FETCH INN ===== */
  const fetchInn = () => {
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
      .catch(() => {
        setError("โหลดข้อมูลร้านไม่สำเร็จ");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchInn();
  }, [innId]);

  /* ===== MODAL CONTROLS ===== */
  const openAddModal = () => {
    setEditingMenu(null);
    setMenuName("");
    setMenuPrice("");
    setShowModal(true);
  };

  const openEditModal = (menu: Menu) => {
    setEditingMenu(menu);
    setMenuName(menu.name);
    setMenuPrice(menu.price);
    setShowModal(true);
  };

  /* ===== SAVE (ADD / EDIT) ===== */
  const handleSave = () => {
    // 🔧 แก้ตรงนี้: ป้องกันราคาว่าง
    if (!menuName || menuPrice === "" || menuPrice <= 0) return;

    // EDIT
    if (editingMenu) {
      fetch(
        `https://canteen-backend-igyy.onrender.com/api/menus/${editingMenu._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: menuName,
            price: menuPrice,
          }),
        }
      ).then(() => {
        setShowModal(false);
        fetchInn();
      });
    }
    // ADD
    else {
      fetch(
        `https://canteen-backend-igyy.onrender.com/api/menus/${innId}/menus`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: menuName,
            price: menuPrice,
          }),
        }
      ).then(() => {
        setShowModal(false);
        fetchInn();
      });
    }
  };

  /* ===== DELETE ===== */
  const handleDelete = () => {
    if (!editingMenu) return;
    if (!confirm("ต้องการลบเมนูนี้หรือไม่")) return;

    fetch(
      `https://canteen-backend-igyy.onrender.com/api/menus/${editingMenu._id}`,
      { method: "DELETE" }
    ).then(() => {
      setShowModal(false);
      fetchInn();
    });
  };

  /* ===== UI STATES ===== */
  if (loading) return <div className="p-6">กำลังโหลดข้อมูล...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!inn) return <div className="p-6">ไม่พบข้อมูลร้าน</div>;

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
            <div>
              <p className="font-medium">{menu.name}</p>
              <p className="text-gray-600 text-sm">{menu.price} บาท</p>
            </div>

            {canEdit && (
              <button
                className="text-sm text-blue-600 hover:underline"
                onClick={() => openEditModal(menu)}
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
            onClick={openAddModal}
          >
            + เพิ่มเมนู
          </button>
        </div>
      )}

      {/* ===== MODAL ===== */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded p-6 w-80 space-y-4">
            <h2 className="text-xl font-bold">
              {editingMenu ? "แก้ไขเมนู" : "เพิ่มเมนู"}
            </h2>

            <input
              className="border p-2 w-full"
              placeholder="ชื่อเมนู"
              value={menuName}
              onChange={(e) => setMenuName(e.target.value)}
            />

            {/* 🔧 แก้เฉพาะ input ราคา */}
            <input
              type="number"
              className="border p-2 w-full"
              placeholder="ราคา"
              min={0}
              step={1}
              value={menuPrice}
              onChange={(e) => {
                const value = e.target.value;
                setMenuPrice(value === "" ? "" : Number(value));
              }}
            />

            <div className="flex justify-between">
              {editingMenu && (
                <button className="text-red-600" onClick={handleDelete}>
                  ลบเมนู
                </button>
              )}

              <div className="ml-auto space-x-2">
                <button onClick={() => setShowModal(false)}>ยกเลิก</button>
                <button
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                  onClick={handleSave}
                >
                  บันทึก
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuPage;


