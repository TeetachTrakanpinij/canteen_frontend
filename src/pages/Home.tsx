import { useState, useEffect } from "react";
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

  const token = localStorage.getItem("authToken");
  const isLoggedIn = !!token;

  // โหลด reservation จาก localStorage
  useEffect(() => {
    const saved = localStorage.getItem("activeReservation");
    if (saved) {
      const resData: Reservation = JSON.parse(saved);
      if (resData?._id) setReservation(resData);
    }
  }, []);

  // Fetch canteens
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
      console.error("Error fetching canteens:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCanteens();
    const interval = setInterval(fetchCanteens, 3000);
    return () => clearInterval(interval);
  }, [token]);

  // Fetch user profile
  useEffect(() => {
    if (!isLoggedIn || !token) return;

    const fetchUser = async () => {
      try {
        const res = await fetch(
          "https://canteen-backend-igyy.onrender.com/api/user/profile",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) throw new Error("Failed to fetch user");
        const data: UserData = await res.json();
        setUser(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
  }, [isLoggedIn, token]);

  const handleCancel = async () => {
    if (!reservation) return;

    try {
      const res = await fetch(
        `https://canteen-backend-igyy.onrender.com/api/reservation/${reservation._id}/cancel`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!res.ok) throw new Error("ยกเลิกไม่สำเร็จ");

      setReservation(null);
      localStorage.removeItem("activeReservation");
      setShowPopup(false);
      setScanning(false);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ แก้เฉพาะส่วนนี้เท่านั้น
  const handleScanQR = async (scannedText: string) => {
    try {
      if (!reservation) throw new Error("ไม่มีการจองให้สแกน");

      const res = await fetch(
        `https://canteen-backend-igyy.onrender.com/api/reservation/${reservation._id}/checkin`,
        {
          method: "PUT", // ✅ เปลี่ยนจาก POST → PUT
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ qrData: scannedText }), // ✅ ส่ง URL จาก QR ที่สแกนได้
        }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Server error ${res.status}: ${text}`);
      }

      const data = await res.json();
      console.log("Scan success:", data);
      alert("✅ สแกนสำเร็จ! โต๊ะถูกเปลี่ยนสถานะเป็น unavailable");

      setScanning(false);
      setShowPopup(false);
      setReservation(null);
      localStorage.removeItem("activeReservation");

      await fetchCanteens(); // ✅ อัปเดตตารางหลังสแกน
    } catch (err: any) {
      console.error(err);
      setScanError(err.message);
    }
  };

  const t = {
    th: { welcome: "ยินดีต้อนรับ", name: "ผู้ใช้", loading: "กำลังโหลด..." },
    en: { welcome: "Welcome", name: "User", loading: "Loading..." },
  }[lang];

  return (
    <div className="font-thai bg-white min-h-screen flex flex-col">
      <main className="flex flex-col items-center flex-1 mt-6">
        <p className="text-lg">
          {t.welcome}{" "}
          <span className="text-orange-500 font-semibold">
            {user?.nickname ?? user?.name ?? t.name}
          </span>
        </p>

        <div className="w-full max-w-md mt-6 flex flex-col gap-4 px-6">
          {loading ? (
            <p className="text-gray-500 text-center">{t.loading}</p>
          ) : (
            canteens.map((c) => (
              <Link
                key={c._id}
                to={`/canteen/${c._id}`}
                className="flex justify-between items-center border-2 rounded-xl px-4 py-3 shadow hover:bg-gray-50 transition"
                style={{
                  borderColor:
                    c.status === "High"
                      ? "red"
                      : c.status === "Medium"
                      ? "orange"
                      : "green",
                }}
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

      {/* Floating reservation button */}
      {reservation && (
        <>
          <button
            onClick={() => setShowPopup(true)}
            className="fixed bottom-6 right-6 bg-orange-500 text-white p-4 rounded-full shadow-lg hover:bg-orange-600 transition"
          >
            <FiClipboard size={24} />
          </button>

          {showPopup && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
              <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-sm text-center">
                <h2 className="text-xl font-bold mb-3 text-gray-800">
                  การจองของคุณ
                </h2>
                <p className="mb-3 text-gray-700 text-sm">
                  คุณได้จองโต๊ะเรียบร้อยแล้ว
                  <br />
                  เลือกการกระทำต่อไป
                </p>

                {!scanning ? (
                  <div className="flex justify-between gap-3">
                    <button
                      onClick={() => {
                        setScanning(true);
                        setScanError("");
                      }}
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
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <QrReader
                      onResult={(result, error) => {
                        if (result) {
                          const scannedText = result.getText();
                          handleScanQR(scannedText);
                        }
                        if (error) console.error(error);
                      }}
                      constraints={{ facingMode: "environment" }}
                      containerStyle={{ width: "100%" }}
                    />

                    {scanError && (
                      <p className="text-red-500 text-sm">{scanError}</p>
                    )}
                    <button
                      onClick={() => setScanning(false)}
                      className="mt-2 text-gray-500 underline text-sm"
                    >
                      ยกเลิกสแกน
                    </button>
                  </div>
                )}

                <button
                  onClick={() => setShowPopup(false)}
                  className="mt-3 text-gray-500 underline text-sm"
                >
                  ปิด
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}


