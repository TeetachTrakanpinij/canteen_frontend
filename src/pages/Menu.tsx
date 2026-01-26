import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  const { innId, canteenId } = useParams();
  const navigate = useNavigate();
  const { isAdmin, isChef } = useUser();
  const canEdit = isAdmin || isChef;

  const [inn, setInn] = useState<Inn | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);
  const [menuName, setMenuName] = useState("");
  const [menuPrice, setMenuPrice] = useState("");

  // ✅ ADD : state สำหรับแก้ไขร้าน
  const [showEditInnModal, setShowEditInnModal] = useState(false);
  const [innName, setInnName] = useState("");
  const [innType, setInnType] = useState("");

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

  /* ================== DELETE INN ================== */
  const handleDeleteInn = () => {
    if (!canteenId || !innId) return;

    const confirmed = confirm(
      "ต้องการลบร้านนี้หรือไม่?\nข้อมูลร้าน เมนู และประเภทจะถูกลบทั้งหมด"
    );
    if (!confirmed) return;

    fetch(
      `https://canteen-backend-igyy.onrender.com/api/inns/${canteenId}/inns/${innId}/clear`,
      { method: "PATCH" }
    )
      .then((res) => {
        if (!res.ok) throw new Error();
        alert("ลบร้านเรียบร้อยแล้ว");
        navigate(-1);
      })
      .catch(() => {
        alert("ไม่สามารถลบร้านได้");
      });
  };

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

  // ✅ ADD : เปิด modal แก้ไขร้าน
  const openEditInnModal = () => {
    if (!inn) return;
    setInnName(inn.name);
    setInnType(inn.type);
    setShowEditInnModal(true);
  };

  /* ===== SAVE MENU ===== */
  const handleSave = () => {
    if (!menuName.trim() || !menuPrice.trim()) return;

    const payload = { name: menuName, price: menuPrice };

    if (editingMenu) {
      fetch(
        `https://canteen-backend-igyy.onrender.com/api/menus/${editingMenu._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
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
          body: JSON.stringify(payload),
        }
      ).then(() => {
        setShowModal(false);
        fetchInn();
      });
    }
  };

  /* ===== DELETE MENU ===== */
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

  // ✅ ADD : บันทึกการแก้ไขร้าน
  const handleSaveInn = () => {
    if (!innName.trim() || !innType.trim()) return;

    fetch(`https://canteen-backend-igyy.onrender.com/api/inns/${canteenId}/inns/${innId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: innName, type: innType }),
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        setShowEditInnModal(false);
        fetchInn();
      })
      .catch(() => alert("แก้ไขร้านไม่สำเร็จ"));
  };

  /* ===== UI STATES ===== */
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        กำลังโหลดข้อมูล...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    );

  if (!inn)
    return (
      <div className="min-h-screen flex items-center justify-center">
        ไม่พบข้อมูลร้าน
      </div>
    );

  /* ================== RENDER ================== */
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-600 via-amber-500 to-yellow-400 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        {/* HEADER */}
        <div className="flex justify-between items-start border-b pb-5 mb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
              {inn.name}
            </h1>
            <span className="inline-block mt-2 px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-700">
              ประเภท: {inn.type}
            </span>

            {/* ✅ ADD : ปุ่มแก้ไขร้าน */}
            {canEdit && (
              <div className="mt-2">
                <button
                  onClick={openEditInnModal}
                  className="text-sm text-blue-600 hover:underline"
                >
                  แก้ไขข้อมูลร้าน
                </button>
              </div>
            )}
          </div>

          {isAdmin && (
            <button
              onClick={handleDeleteInn}
              className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition"
            >
              ลบร้าน
            </button>
          )}
        </div>

        {/* MENU LIST */}
        <div className="space-y-4">
          {inn.menus.length === 0 && (
            <div className="text-center text-gray-400 py-10">
              ยังไม่มีเมนูในร้านนี้
            </div>
          )}

          {inn.menus.map((menu) => (
            <div
              key={menu._id}
              className="flex justify-between items-center bg-gray-50 border rounded-xl px-5 py-4 hover:shadow-md transition"
            >
              <div>
                <p className="font-semibold text-lg text-gray-800">
                  {menu.name}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  ราคา {menu.price} บาท
                </p>
              </div>

              {canEdit && (
                <button
                  onClick={() => openEditModal(menu)}
                  className="text-sm font-medium text-blue-600 hover:underline"
                >
                  แก้ไข
                </button>
              )}
            </div>
          ))}
        </div>

        {/* ADD BUTTON */}
        {canEdit && (
          <div className="mt-10 flex justify-end">
            <button
              onClick={openAddModal}
              className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition shadow"
            >
              + เพิ่มเมนู
            </button>
          </div>
        )}
      </div>

      {/* ===== MODAL : EDIT INN ===== */}
      {showEditInnModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-96 p-6 space-y-4 shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-800">
              แก้ไขข้อมูลร้าน
            </h2>

            <input
              className="w-full border rounded-lg px-3 py-2"
              value={innName}
              onChange={(e) => setInnName(e.target.value)}
              placeholder="ชื่อร้าน"
            />

            <select
              className="w-full border rounded-lg px-3 py-2"
              value={innType}
              onChange={(e) => setInnType(e.target.value)}
            >
              <option value="">เลือกประเภทร้าน</option>
              <option value="food">ร้านอาหาร</option>
              <option value="drink">ร้านเครื่องดื่ม</option>
              <option value="storage">เก็บจาน</option>
            </select>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowEditInnModal(false)}
                className="px-4 py-2 text-gray-500"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleSaveInn}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                บันทึก
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== MODAL MENU (ของเดิม ไม่แตะ) ===== */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-96 p-6 space-y-4 shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-800">
              {editingMenu ? "แก้ไขเมนู" : "เพิ่มเมนู"}
            </h2>

            <input
              className="w-full border rounded-lg px-3 py-2"
              value={menuName}
              onChange={(e) => setMenuName(e.target.value)}
              placeholder="ชื่อเมนู"
            />

            <input
              className="w-full border rounded-lg px-3 py-2"
              value={menuPrice}
              onChange={(e) => setMenuPrice(e.target.value)}
              placeholder="ราคา เช่น 20-30"
            />

            <div className="flex items-center justify-between pt-2">
              {editingMenu && (
                <button
                  className="text-sm text-red-600 hover:underline"
                  onClick={handleDelete}
                >
                  ลบเมนู
                </button>
              )}

              <div className="ml-auto flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-600"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
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








