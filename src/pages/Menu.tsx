import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

/* ================== TYPES ================== */
interface Menu {
  _id: string;
  name: string;
  price: string;
}

interface Inn {
  _id: string;
  innNumber: number;
  name: string;
  type: string;
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

  const [showModal, setShowModal] = useState(false);
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);
  const [menuName, setMenuName] = useState("");
  const [menuPrice, setMenuPrice] = useState<string>("");

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
    if (!menuName.trim() || !menuPrice.trim()) return;

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
    } else {
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
  if (loading) return <div className="p-6 text-center">กำลังโหลดข้อมูล...</div>;
  if (error) return <div className="p-6 text-center text-red-600">{error}</div>;
  if (!inn) return <div className="p-6 text-center">ไม่พบข้อมูลร้าน</div>;

  /* ================== RENDER ================== */
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6">
        <div className="mb-6 border-b pb-4">
          <h1 className="text-3xl font-bold text-gray-800">{inn.name}</h1>
          <p className="text-sm text-gray-500 mt-1">
            ประเภท: {inn.type}
          </p>
        </div>

        <div className="space-y-3">
          {inn.menus.length === 0 && (
            <p className="text-center text-gray-400 py-6">ยังไม่มีเมนู</p>
          )}

          {inn.menus.map((menu) => (
            <div
              key={menu._id}
              className="flex justify-between items-center border rounded-lg px-4 py-3 hover:shadow transition"
            >
              <div>
                <p className="font-semibold text-gray-800">{menu.name}</p>
                <p className="text-sm text-gray-500">{menu.price} บาท</p>
              </div>

              {canEdit && (
                <button
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  onClick={() => openEditModal(menu)}
                >
                  แก้ไข
                </button>
              )}
            </div>
          ))}
        </div>

        {canEdit && (
          <div className="mt-8 text-right">
            <button
              className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              onClick={openAddModal}
            >
              + เพิ่มเมนู
            </button>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-80 space-y-4">
            <h2 className="text-xl font-bold">
              {editingMenu ? "แก้ไขเมนู" : "เพิ่มเมนู"}
            </h2>

            <input
              className="border rounded-md p-2 w-full"
              placeholder="ชื่อเมนู"
              value={menuName}
              onChange={(e) => setMenuName(e.target.value)}
            />

            <input
              type="text"
              className="border rounded-md p-2 w-full"
              placeholder="ราคา เช่น 20-30 / พิเศษ 50"
              value={menuPrice}
              onChange={(e) => setMenuPrice(e.target.value)}
            />

            <div className="flex justify-between items-center">
              {editingMenu && (
                <button
                  className="text-sm text-red-600"
                  onClick={handleDelete}
                >
                  ลบเมนู
                </button>
              )}

              <div className="ml-auto flex gap-2">
                <button onClick={() => setShowModal(false)}>ยกเลิก</button>
                <button
                  className="bg-blue-600 text-white px-4 py-1 rounded"
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




