import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FiClipboard } from "react-icons/fi";
import { QrReader } from "react-qr-reader";
import { MdTableRestaurant } from "react-icons/md";


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
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const serverDownRef = useRef(false);
  const notificationTimerRef = useRef<number | null>(null);
  const lastScanRef = useRef<string | null>(null);
  const scanLockRef = useRef(false);

  const translations = {
  th: {
    welcome: "ยินดีต้อนรับ",
    loading: "กำลังโหลด...",
    checkinReservation: "เช็คอินการจอง",
    scanQR: "กรุณาสแกน QR Code ที่โต๊ะ",
    cancelReservation: "ยกเลิกการจอง",
    close: "ปิด",
    tableManagement: "จัดการสถานะโต๊ะ",
    makeUnavailable: "ทำให้โต๊ะไม่ว่าง",
    makeAvailable: "ทำให้โต๊ะว่าง",
    user: "ผู้ใช้",
    canteen:"โรงอาหาร",
    tablestatus: "จัดการสถานะโต๊ะ",
    off: "ทำให้โต๊ะไม่ว่าง",
    on: "ทำให้โต๊ะว่าง"
  },
  en: {
    welcome: "Welcome",
    loading: "Loading...",
    checkinReservation: "Reservation Check-in",
    scanQR: "Please scan the QR code at the table",
    cancelReservation: "Cancel Reservation",
    close: "Close",
    tableManagement: "Table Management",
    makeUnavailable: "Mark as Unavailable",
    makeAvailable: "Mark as Available",
    user: "User",
    canteen: "Canteen",
    tablestatus: "Manage table status",
    off: "Unavailable",
    on: "Avilable"
  }
};

const t = translations[lang];

  




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

  const showNotification = (msg: string) => {
  setNotification(msg);

  if (notificationTimerRef.current) {
    clearTimeout(notificationTimerRef.current);
  }

  notificationTimerRef.current = window.setTimeout(() => {
    setNotification("");
    notificationTimerRef.current = null;
  }, 3000);
};

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

    if (!res.ok) throw new Error("Server error");

    const data: Canteen[] = await res.json();
    setCanteens(data);

    // ✅ ถ้า server เคยล่ม แล้วตอนนี้กลับมา
    if (serverDownRef.current) {
      serverDownRef.current = false;
      setNotification("✅ เชื่อมต่อเซิร์ฟเวอร์อีกครั้งแล้ว");
      

      // 🔁 เปิด interval ใหม่
      intervalRef.current = setInterval(fetchCanteens, 3000);
    }
  } catch (err) {
    // 🛑 เจอ error ครั้งแรก → หยุด interval ทันที
    if (!serverDownRef.current) {
      serverDownRef.current = true;
      setNotification("❌ ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์");
      

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  } finally {
    setLoading(false);
  }
};



  useEffect(() => {
  fetchCanteens();

  intervalRef.current = setInterval(fetchCanteens, 3000);

  return () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };
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
  const handleScanQR = async (tableToken: string) => {
  try {
    const res = await fetch(
      `https://canteen-backend-igyy.onrender.com/api/tables/${tableToken}/checkin`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Check-in failed");
    }

    localStorage.removeItem("activeReservation");
    setReservation(null);

    setNotification("✅ เช็คอินสำเร็จ");
    setTimeout(() => setNotification(""), 3000);

    setShowPopup(false);
    fetchCanteens();
  } catch (err: any) {
    setNotification("❌ เช็คอินไม่สำเร็จ");
    scanProcessedRef.current = false;
  }
};


  /* ================= Scan table control (ไม่สนการจอง) ================= */
  const handleTableControlScan = async (tableToken: string) => {
    console.log("🚀 SEND TABLE ID TO API =", tableToken);
    const endpoint =
      tableScanMode === "checkin"
        ? `/api/reservation/${tableToken}/mark`
        : `/api/reservation/${tableToken}/activate`;

    try {
      const res = await fetch(
        `https://canteen-backend-igyy.onrender.com${endpoint}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 403) {
          setNotification("❌ โต๊ะนี้ถูกล็อกโดยผู้ใช้อื่น");
        } else {
          setNotification(data.message || "❌ ดำเนินการไม่สำเร็จ");
        }
        return;
      }

      setNotification(
        tableScanMode === "checkin"
          ? "🚫 โต๊ะถูกตั้งเป็นไม่ว่างแล้ว"
          : "✅ โต๊ะกลับมาเป็นว่างแล้ว"
      );

      setTimeout(() => setNotification(""), 3000);
      fetchCanteens();
    } catch (err) {
      setNotification("❌ ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์");
    }
    finally {
  setTimeout(() => {
    scanLockRef.current = false;
  }, 1500); // หน่วงให้ยก QR ออกก่อน
}


  };


  const getStatusColor = (blocked = 0, total = 50) => {
  const percent = (blocked / total) * 100;

  if (percent <= 35) {
    return "border-green-500 bg-green-50";
  } else if (percent <= 75) {
    return "border-yellow-500 bg-yellow-50";
  } else {
    return "border-red-500 bg-red-50";
  }
};


  /* ================= UI ================= */
  return (
    <div className="font-thai bg-white min-h-screen flex flex-col">
      <main className="flex flex-col items-center flex-1 mt-6">
        <p className="text-lg">
          {t.welcome}{" "}
          <span className="text-orange-500 font-semibold">
            {user?.nickname ?? user?.name ?? t.user}
          </span>
        </p>

        <div className="w-full max-w-md mt-6 flex flex-col gap-4 px-6">
          {loading ? (
            <p className="text-gray-500 text-center">{t.loading}</p>
          ) : (
            canteens.map((c) => {
              const blocked = c.blockedTables ?? 0;
              const total = c.totalTables ?? 50;

              return (
                <Link
                  key={c._id}
                  to={`/canteen/${c._id}`}
                  className={`flex justify-between items-center 
                    border-2 rounded-xl px-4 py-3 shadow
                    ${getStatusColor(blocked, total)}`}
                >
                  <span className="font-medium">{t.canteen} {c.name}</span>
                  <span className="font-semibold">
                    {blocked}/{total}
                  </span>
                </Link>
              );
            })
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
        disabled={serverDownRef.current}
        onClick={() => {
          if (serverDownRef.current) return;

          scanProcessedRef.current = false;
          setShowTableControl(true);
        }}
        className={`fixed bottom-6 left-6 p-4 rounded-full shadow-lg flex items-center justify-center
          ${
            serverDownRef.current
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-purple-600 text-white"
          }`}
      >
        <MdTableRestaurant size={24} />
      </button>


      {/* Popup เช็คอิน (มีการจอง) */}
      {showPopup && reservation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-5 text-center">
            <h2 className="text-lg font-bold mb-2">{t.checkinReservation}</h2>

            <p className="text-sm text-gray-600 mb-3">
              {t.scanQR}
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
                ❌ {t.cancelReservation}
              </button>

              <button
                onClick={() => {
                  setShowPopup(false);
                  scanProcessedRef.current = false;
                }}
                className="text-gray-500 underline text-sm"
              >
                {t.close}
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Popup จัดการโต๊ะ */}
      {showTableControl && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm text-center">
            <h2 className="text-lg font-bold mb-4">{t.tablestatus}</h2>

            {!tableScanMode ? (
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    scanProcessedRef.current = false;
                    setTableScanMode("checkin");
                  }}
                  className="bg-red-500 text-white py-2 rounded-lg"
                >
                  🚫 {t.off}
                </button>
                <button
                  onClick={() => {
                    scanProcessedRef.current = false;
                    setTableScanMode("activate");
                  }}
                  className="bg-green-500 text-white py-2 rounded-lg"
                >
                  ✅ {t.on}
                </button>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-600 mb-2">
                  {t.scanQR}
                </p>
                <QrReader
                  constraints={{ facingMode: "environment" }}
                  scanDelay={500}
                  onResult={(result) => {
                    console.log("🔥 onResult fired");
                    if (!result) {
                      console.log("❌ no result");
                      return;
                    }
                    if (scanLockRef.current) return;

                    const scannedText = result.getText().trim();

                    if (!scannedText) return;
                    if (scannedText === lastScanRef.current) return;

                    console.log("📸 QR RAW TEXT =", scannedText);

                    scanLockRef.current = true;
                    lastScanRef.current = scannedText;

                    handleTableControlScan(scannedText);
                  }}
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
              {t.close}
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





