import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

/* ================== TYPES ================== */
interface Menu {
  _id: string;
  name: string;
  price: string;
  image?: string;
}

interface Inn {
  _id: string;
  innNumber: number;
  name: string;
  type: string;
  arduinoSensor: boolean;
  queueCount: number;
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

  /* ===== MENU MODAL ===== */
  const [showModal, setShowModal] = useState(false);
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);
  const [menuName, setMenuName] = useState("");
  const [menuPrice, setMenuPrice] = useState("");
  const [menuImage, setMenuImage] = useState<File | null>(null); // ✅ รองรับอัปโหลดไฟล์

  /* ===== INN MODAL ===== */
  const [showEditInnModal, setShowEditInnModal] = useState(false);
  const [innName, setInnName] = useState("");
  const [innType, setInnType] = useState("");

  /* ================== QUEUE ================== */
  const increaseQueue = () => {
    if (!canEdit || !canteenId || !innId || !inn) return;

    fetch(
      `https://canteen-backend-igyy.onrender.com/api/inns/${canteenId}/inns/${innId}/queue/increase`,
      { method: "PATCH" }
    )
      .then((res) => res.json())
      .then((data) => {
        setInn({ ...inn, queueCount: data.queueCount });
      })
      .catch(() => alert("เพิ่มคิวไม่สำเร็จ"));
  };

  const decreaseQueue = () => {
    if (!canEdit || !canteenId || !innId || !inn) return;

    fetch(
      `https://canteen-backend-igyy.onrender.com/api/inns/${canteenId}/inns/${innId}/queue/decrease`,
      { method: "PATCH" }
    )
      .then((res) => res.json())
      .then((data) => {
        setInn({ ...inn, queueCount: data.queueCount });
      })
      .catch(() => alert("ลดคิวไม่สำเร็จ"));
  };

  /* ================== FETCH INN ================== */
  const fetchInn = () => {
    if (!innId) return;

    setLoading(true);

    fetch(`https://canteen-backend-igyy.onrender.com/api/inns/${innId}`)
      .then((res) => {
        if (!res.ok) throw new Error("fetch inn failed");
        return res.json();
      })
      .then((data) => {
        setInn({
          ...data,
          queueCount: data.queueCount ?? data.queue ?? 0,
        });
        setError("");
      })
      .catch(() => setError("โหลดข้อมูลร้านไม่สำเร็จ"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchInn();
  }, [innId]);

  /* ================== DELETE INN ================== */
  const handleDeleteInn = () => {
    if (!isAdmin || !canteenId || !innId) return;
    if (!confirm("ต้องการลบร้านนี้หรือไม่?")) return;

    fetch(
      `https://canteen-backend-igyy.onrender.com/api/inns/${canteenId}/inns/${innId}/clear`,
      { method: "PATCH" }
    )
      .then(() => {
        alert("ลบร้านเรียบร้อย");
        navigate(-1);
      })
      .catch(() => alert("ไม่สามารถลบร้านได้"));
  };

  /* ================== MENU HANDLERS ================== */
  const openAddModal = () => {
    setEditingMenu(null);
    setMenuName("");
    setMenuPrice("");
    setMenuImage(null);
    setShowModal(true);
  };

  const openEditModal = (menu: Menu) => {
    setEditingMenu(menu);
    setMenuName(menu.name);
    setMenuPrice(menu.price);
    setMenuImage(null);
    setShowModal(true);
  };

  const handleSaveMenu = () => {
    if (!canEdit || !menuName || !menuPrice) return;

    const formData = new FormData();
    formData.append("name", menuName);
    formData.append("price", menuPrice);
    if (menuImage) formData.append("image", menuImage);

    if (editingMenu) {
      fetch(
        `https://canteen-backend-igyy.onrender.com/api/menus/${editingMenu._id}`,
        {
          method: "PATCH",
          body: formData,
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
          body: formData,
        }
      ).then(() => {
        setShowModal(false);
        fetchInn();
      });
    }
  };

  const handleDeleteMenu = () => {
    if (!canEdit || !editingMenu) return;
    if (!confirm("ต้องการลบเมนูนี้หรือไม่")) return;

    fetch(
      `https://canteen-backend-igyy.onrender.com/api/menus/${editingMenu._id}`,
      { method: "DELETE" }
    ).then(() => {
      setShowModal(false);
      fetchInn();
    });
  };

  /* ================== INN EDIT ================== */
  const openEditInnModal = () => {
    if (!inn || !canEdit) return;
    setInnName(inn.name);
    setInnType(inn.type);
    setShowEditInnModal(true);
  };

  const handleSaveInn = () => {
    if (!canEdit) return;

    fetch(
      `https://canteen-backend-igyy.onrender.com/api/inns/${canteenId}/inns/${innId}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: innName, type: innType }),
      }
    )
      .then(() => {
        setShowEditInnModal(false);
        fetchInn();
      })
      .catch(() => alert("แก้ไขร้านไม่สำเร็จ"));
  };

  /* ================== UI STATES ================== */
  if (loading)
    return <div className="h-screen flex items-center justify-center">กำลังโหลด...</div>;
  if (error)
    return (
      <div className="h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    );
  if (!inn) return null;

  /* ================== RENDER ================== */
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 to-yellow-400 p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl p-6">
        <div className="grid md:grid-cols-3 gap-6">
          {/* ================= LEFT ================= */}
          <div className="bg-gray-50 rounded-xl p-6 space-y-4">
            <h1 className="text-2xl font-bold">{inn.name}</h1>

            <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
              {inn.type}
            </span>

            {canEdit && (
              <button
                onClick={openEditInnModal}
                className="text-blue-600 text-sm hover:underline block"
              >
                แก้ไขข้อมูลร้าน
              </button>
            )}

            {isAdmin && (
              <button
                onClick={handleDeleteInn}
                className="w-full bg-red-600 text-white py-2 rounded-lg"
              >
                ลบร้าน
              </button>
            )}

            {/* QUEUE */}
            <div className="border rounded-xl p-4 text-center space-y-3">
              <p className="text-gray-500">จำนวนคิว</p>
              <p className="text-4xl font-bold">{inn.queueCount}</p>

              {canEdit && (
                <div className="flex justify-center gap-4">
                  <button
                    onClick={decreaseQueue}
                    className="px-4 py-2 bg-gray-200 rounded-lg"
                  >
                    -
                  </button>
                  <button
                    onClick={increaseQueue}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg"
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ================= RIGHT ================= */}
          <div className="md:col-span-2 bg-gray-50 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">MENU</h2>

            <div className="grid sm:grid-cols-2 gap-4">
              {inn.menus.map((menu) => (
                <div key={menu._id} className="bg-white rounded-xl shadow overflow-hidden">
                  <div className="h-32 bg-gray-200 flex items-center justify-center">
                    {menu.image ? (
                      <img src={menu.image} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-gray-400">ไม่มีรูป</span>
                    )}
                  </div>

                  <div className="p-4 flex justify-between">
                    <div>
                      <p className="font-semibold">{menu.name}</p>
                      <p className="text-sm text-gray-500">{menu.price} บาท</p>
                    </div>

                    {canEdit && (
                      <button
                        onClick={() => openEditModal(menu)}
                        className="text-blue-600 text-sm"
                      >
                        แก้ไข
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {canEdit && (
              <div className="flex justify-end mt-6">
                <button
                  onClick={openAddModal}
                  className="bg-green-600 text-white px-6 py-3 rounded-xl"
                >
                  + เพิ่มเมนู
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================= MODAL MENU ================= */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-96 p-6 space-y-4">
            <h2 className="text-xl font-bold">
              {editingMenu ? "แก้ไขเมนู" : "เพิ่มเมนู"}
            </h2>

            <input
              className="w-full border px-3 py-2 rounded"
              placeholder="ชื่อเมนู"
              value={menuName}
              onChange={(e) => setMenuName(e.target.value)}
            />

            <input
              className="w-full border px-3 py-2 rounded"
              placeholder="ราคา"
              value={menuPrice}
              onChange={(e) => setMenuPrice(e.target.value)}
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setMenuImage(e.target.files ? e.target.files[0] : null)
              }
            />

            <div className="flex justify-between items-center">
              {editingMenu && (
                <button
                  onClick={handleDeleteMenu}
                  className="text-red-600 text-sm"
                >
                  ลบเมนู
                </button>
              )}

              <div className="ml-auto flex gap-3">
                <button onClick={() => setShowModal(false)}>ยกเลิก</button>
                <button
                  onClick={handleSaveMenu}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  บันทึก
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL INN ================= */}
      {showEditInnModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-96 p-6 space-y-4">
            <h2 className="text-xl font-bold">แก้ไขข้อมูลร้าน</h2>

            <input
              className="w-full border px-3 py-2 rounded"
              value={innName}
              onChange={(e) => setInnName(e.target.value)}
            />

            <select
              className="w-full border px-3 py-2 rounded"
              value={innType}
              onChange={(e) => setInnType(e.target.value)}
            >
              <option value="food">ร้านอาหาร</option>
              <option value="drink">ร้านเครื่องดื่ม</option>
              <option value="storage">เก็บจาน</option>
            </select>

            <div className="flex justify-end gap-3">
              <button onClick={() => setShowEditInnModal(false)}>ยกเลิก</button>
              <button
                onClick={handleSaveInn}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                บันทึก
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuPage;









