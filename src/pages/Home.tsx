import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FiClipboard } from "react-icons/fi";
import { QrReader } from "react-qr-reader";

interface Canteen {
  _id: string;
  name: string;
  status?: "High" | "Medium" | "Low";
  blockedTables?: number;
  totalTables?: number;
}

interface UserData {
  name?: string;
  nickname?: string;
}

interface Reservation {
  _id: string;
  tableID: string;
  userID: string;
  duration_minutes: number;
  reserved_at: string;
  checked_in?: boolean;
}

interface HomeProps {
  lang: "th" | "en";
}

export default function Home({ lang }: HomeProps) {
  const [user, setUser] = useState<UserData | null>(null);
  const [canteens, setCanteens] = useState<Canteen[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanError, setScanError] = useState("");
  const [notification, setNotification] = useState("");

  // ⭐ state สำหรับจัดการโต๊ะ
  const [showTableControl, setShowTableControl] = useState(false);
  const [tableScanMode, setTableScanMode] =
    useState<"checkin" | "activate" | null>(null);

  // ⭐ ตัวล็อก QR ยิงซ้ำ
  const scanProcessedRef = useRef(false);

  const token = localStorage.getItem("authToken");
  const isLoggedIn = !!token;

  /* ================= Load reservation ================= */
  useEffect(() => {
    const saved = localStorage.getItem("activeReservation");
    if (saved) {
      const resData: Reservation = JSON.parse(saved);
      if (resData?._id) setReservation(resData);
    }
  }, []);

  /* ================= Expire reservation ================= */
  useEffect(() => {
    if (!reservation) return;

    const reservedAt = new Date(reservation.reserved_at).getTime();
    const durationMs = reservation.duration_minutes * 60 * 1000;
    const remainingTime = reservedAt + durationMs - Date.now();

    if (remainingTime <= 0) {
      localStorage.removeItem("activeReservation");
      setReservation(null);
      setNotification("หมดเวลาการจอง โต๊ะกลับเป็นว่างแล้ว");
      setTimeout(() => setNotification(""), 3000);
      return;
    }

    const timer = setTimeout(() => {
      localStorage.removeItem("activeReservation");
      setReservation(null);
      setNotification("หมดเวลาการจอง โต๊ะกลับเป็นว่างแล้ว");
      setTimeout(() => setNotification(""), 3000);
    }, remainingTime);

    return () => clearTimeout(timer);
  }, [reservation]);

  /* ================= Fetch canteens ================= */
  const fetchCanteens = async () => {
    try {
      const res = await fetch(
        "https://canteen-backend-igyy.onrender.com/api/canteen/",
        {
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              }
            : undefined,
        }
      );
      const data: Canteen[] = await res.json();
      setCanteens(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCanteens();
    const interval = setInterval(fetchCanteens, 3000);
    return () => clearInterval(interval);
  }, [token]);

  /* ================= Fetch user ================= */
  useEffect(() => {
    if (!isLoggedIn || !token) return;

    fetch("https://canteen-backend-igyy.onrender.com/api/user/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setUser)
      .catch(console.error);
  }, [isLoggedIn, token]);

  /* ================= Cancel reservation ================= */
  const handleCancel = async () => {
    if (!reservation) return;

    try {
      await fetch(
        `https://canteen-backend-igyy.onrender.com/api/reservation/${reservation._id}/cancel`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      localStorage.removeItem("activeReservation");
      setReservation(null);
      setShowPopup(false);
      setScanning(false);
      setNotification("ยกเลิกการจองสำเร็จ");
      setTimeout(() => setNotification(""), 3000);
    } catch {
      setNotification("ยกเลิกไม่สำเร็จ");
    }
  };

  /* ================= Scan check-in (มีการจอง) ================= */
  const handleScanQR = async (tableId: string) => {
    try {
      await fetch(
        `https://canteen-backend-igyy.onrender.com/api/tables/${tableId}/checkin`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      localStorage.removeItem("activeReservation");
      setReservation(null);

      setNotification("✅ เช็คอินสำเร็จ");
      setTimeout(() => setNotification(""), 3000);

      setShowPopup(false);
      fetchCanteens();
    } catch (err: any) {
      setScanError(err.message);
      scanProcessedRef.current = false;
    }
  };

  /* ================= Scan table control (ไม่สนการจอง) ================= */
  const handleTableControlScan = async (tableId: string) => {
    const endpoint =
      tableScanMode === "checkin"
        ? `/api/reservation/${tableId}/checkin`
        : `/api/reservation/${tableId}/activate`;

    try {
      await fetch(
        `https://canteen-backend-igyy.onrender.com${endpoint}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setNotification(
        tableScanMode === "checkin"
          ? "🚫 โต๊ะถูกตั้งเป็นไม่ว่างแล้ว"
          : "✅ โต๊ะกลับมาเป็นว่างแล้ว"
      );
      setTimeout(() => setNotification(""), 3000);

      fetchCanteens();
    } catch {
      setNotification("❌ ดำเนินการไม่สำเร็จ");
    }
  };

  /* ================= UI ================= */
  return (
    <div className="font-thai bg-white min-h-screen flex flex-col">
      <main className="flex flex-col items-center flex-1 mt-6">
        <p className="text-lg">
          ยินดีต้อนรับ{" "}
          <span className="text-orange-500 font-semibold">
            {user?.nickname ?? user?.name ?? "ผู้ใช้"}
          </span>
        </p>

        <div className="w-full max-w-md mt-6 flex flex-col gap-4 px-6">
          {loading ? (
            <p className="text-gray-500 text-center">กำลังโหลด...</p>
          ) : (
            canteens.map((c) => (
              <Link
                key={c._id}
                to={`/canteen/${c._id}`}
                className="flex justify-between items-center border-2 rounded-xl px-4 py-3 shadow"
              >
                <span>{c.name}</span>
                <span>
                  {c.blockedTables ?? 0}/{c.totalTables ?? 50}
                </span>
              </Link>
            ))
          )}
        </div>
      </main>

      {/* ปุ่มเช็คอินจากการจอง */}
      {reservation && (
        <button
          onClick={() => {
            scanProcessedRef.current = false; // ⭐ reset ก่อนเปิด
            setShowPopup(true);
          }}
          className="fixed bottom-6 right-6 bg-orange-500 text-white p-4 rounded-full shadow-lg"
        >
          <FiClipboard size={24} />
        </button>
      )}

      {/* ปุ่มจัดการโต๊ะ */}
      <button
        onClick={() => {
          scanProcessedRef.current = false; // ⭐ reset ก่อนเปิด
          setShowTableControl(true);
        }}
        className="fixed bottom-6 left-6 bg-purple-600 text-white p-4 rounded-full shadow-lg"
      >
        โต๊ะ
      </button>

      {/* Popup เช็คอิน (มีการจอง) */}
      {showPopup && reservation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-5 text-center">
            <h2 className="text-lg font-bold mb-2">เช็คอินการจอง</h2>

            <p className="text-sm text-gray-600 mb-3">
              กรุณาสแกน QR Code ที่โต๊ะ
            </p>

            <div className="w-full overflow-hidden rounded-xl mb-4">
              <QrReader
                onResult={(result) => {
                  if (!result) return;
                  if (scanProcessedRef.current) return;

                  scanProcessedRef.current = true;
                  handleScanQR(result.getText());
                }}
                constraints={{ facingMode: "environment" }}
              />
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={handleCancel}
                className="w-full bg-red-500 text-white py-2 rounded-lg font-semibold"
              >
                ❌ ยกเลิกการจอง
              </button>

              <button
                onClick={() => {
                  setShowPopup(false);
                  scanProcessedRef.current = false;
                }}
                className="text-gray-500 underline text-sm"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Popup จัดการโต๊ะ */}
      {showTableControl && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm text-center">
            <h2 className="text-lg font-bold mb-4">จัดการสถานะโต๊ะ</h2>

            {!tableScanMode ? (
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    scanProcessedRef.current = false;
                    setTableScanMode("checkin");
                  }}
                  className="bg-red-500 text-white py-2 rounded-lg"
                >
                  🚫 ทำให้โต๊ะไม่ว่าง
                </button>
                <button
                  onClick={() => {
                    scanProcessedRef.current = false;
                    setTableScanMode("activate");
                  }}
                  className="bg-green-500 text-white py-2 rounded-lg"
                >
                  ✅ ทำให้โต๊ะว่าง
                </button>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-600 mb-2">
                  กรุณาสแกน QR Code ที่โต๊ะ
                </p>
                <QrReader
                  onResult={(result) => {
                    if (!result) return;
                    if (scanProcessedRef.current) return;

                    scanProcessedRef.current = true;

                    setShowTableControl(false);
                    setTableScanMode(null);

                    handleTableControlScan(result.getText());
                  }}
                  constraints={{ facingMode: "environment" }}
                  containerStyle={{ width: "100%" }}
                />
              </>
            )}

            <button
              onClick={() => {
                setShowTableControl(false);
                setTableScanMode(null);
              }}
              className="mt-4 text-gray-500 underline text-sm"
            >
              ปิด
            </button>
          </div>
        </div>
      )}

      {notification && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded shadow-lg">
          {notification}
        </div>
      )}
    </div>
  );
}





