import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ListFilter } from "lucide-react";

interface Table {
  _id: string;
  number: number | string;
  status: "Available" | "Reserved" | "Unavailable";
}

interface Zone {
  _id: string;
  name: string;
  tables?: Table[];
}

interface Inn {
  _id: string;
  name: string | null;
  arduinoSensor: boolean;
  type?: string; // ✅ เพิ่มเพื่อเช็ค storage
  queueCount: number;
}

interface Canteen {
  _id: string;
  name: string;
  zones?: Zone[];
  inns?: Inn[];
}

interface CanteenDetailProps {
  lang: "th" | "en";
}

export default function CanteenDetail({ lang }: CanteenDetailProps) {
  const { canteenId } = useParams<{ canteenId?: string }>();
  const [canteen, setCanteen] = useState<Canteen | null>(null);
  const [loading, setLoading] = useState(true);

  const [filterStatus, setFilterStatus] =
    useState<"All" | "Available" | "Reserved" | "Unavailable">("All");

  const t = {
    th: {
      loading: "กำลังโหลด...",
      notFound: "ไม่พบโรงอาหาร",
      quantity: "จำนวน",
      density: "ความหนาแน่น",
      zone: "โซน",
      all: "ทั้งหมด",
      available: "ว่าง",
      reserved: "จองแล้ว",
      unavailable: "ไม่ว่าง",
      normal: "ปกติ",
      medium: "ปานกลาง",
      high: "สูง",
    },
    en: {
      loading: "Loading...",
      notFound: "Canteen not found",
      quantity: "Quantity",
      density: "Density",
      zone: "Zone",
      all: "All",
      available: "Available",
      reserved: "Reserved",
      unavailable: "Unavailable",
      normal: "Normal",
      medium: "Medium",
      high: "High",
    },
  }[lang];

  useEffect(() => {
  if (!canteenId) return;

  const fetchCanteen = async () => {
    try {
      // 1️⃣ ดึงข้อมูล canteen (ไว้สร้างกล่อง)
      const canteenRes = await fetch(
        `https://canteen-backend-igyy.onrender.com/api/canteen/${canteenId}`
      );
      if (!canteenRes.ok) throw new Error("fetch canteen failed");

      const canteenData = await canteenRes.json();

      // 2️⃣ ดึง queue ของแต่ละร้าน
      const innsWithQueue = await Promise.all(
        (canteenData.inns || []).map(async (inn: any) => {
          // ❌ storage ไม่ต้องมีคิว
          if (
            inn.type?.toLowerCase() === "storage" ||
            inn.name === "เก็บจาน"
          ) {
            return inn;
          }

          try {
            const innRes = await fetch(
              `https://canteen-backend-igyy.onrender.com/api/inns/${inn._id}`
            );
            const innData = await innRes.json();

            return {
              ...inn,
              queueCount: innData.queueCount ?? 0,
            };
          } catch {
            return {
              ...inn,
              queueCount: 0,
            };
          }
        })
      );

      // 3️⃣ set ครั้งเดียว
      setCanteen({
        ...canteenData,
        inns: innsWithQueue,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  fetchCanteen();
  const interval = setInterval(fetchCanteen, 3000); // realtime
  return () => clearInterval(interval);
}, [canteenId]);


  if (loading) return <p className="p-4">{t.loading}</p>;
  if (!canteen) return <p className="p-4 text-red-500">{t.notFound}</p>;

  const zoneA = canteen.zones?.find((z) => z.name === "A");
  const zoneB = canteen.zones?.find((z) => z.name === "B");

  const allTables = canteen.zones?.flatMap((z) => z.tables || []) || [];
  const usedTables = allTables.filter((t) => t.status !== "Available");
  const densityPercent = allTables.length
    ? (usedTables.length / allTables.length) * 100
    : 0;

  return (
    <div className="p-4 font-thai bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4 bg-white p-4 rounded-lg shadow">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-700">
            {t.quantity}: {usedTables.length}/{allTables.length}
          </span>
          <ListFilter className="w-5 h-5 text-gray-500" />
          <select
            value={filterStatus}
            onChange={(e) =>
              setFilterStatus(e.target.value as typeof filterStatus)
            }
            className="border rounded-lg px-3 py-1 text-sm"
          >
            <option value="All">{t.all}</option>
            <option value="Available">{t.available}</option>
            <option value="Reserved">{t.reserved}</option>
            <option value="Unavailable">{t.unavailable}</option>
          </select>
        </div>

      </div>

      {/* ===== SINGLE CANTEEN MAP ===== */}
      <div className="bg-white border-2 border-gray-300 rounded-xl p-4 overflow-x-auto">
        <div className="min-w-[900px]">
      {/* Shops */}
        <div className="grid grid-cols-6 gap-3 mb-6">
          {canteen.inns?.map((inn) => {
            const isStorage =
              inn.type?.toLowerCase() === "storage" || inn.name === "เก็บจาน";

            const isOpen = inn.arduinoSensor === true;

            const shopBox = (
              <div
                className={`relative h-14 border-2 flex flex-col items-center justify-center font-semibold text-sm
                  ${
                    isStorage
                      ? "bg-gray-200 border-gray-400 text-gray-500 cursor-not-allowed"
                      : isOpen
                      ? "bg-green-100 border-green-600 hover:scale-105"
                      : "bg-gray-300 border-gray-500 text-slate-500 hover:scale-105"
                  }`}
              >
                {/* ชื่อร้าน */}
                <span>{inn.name}</span>

                {/* คิว (ไม่แสดงถ้าเป็น storage) */}
                {!isStorage && (
                  <span className="text-xs text-gray-600">
                    คิว: {inn.queueCount}
                  </span>
                )}
              </div>
            );

            if (isStorage) {
              return <div key={inn._id}>{shopBox}</div>;
            }

            return (
              <Link
                key={inn._id}
                to={`/canteen/${canteen._id}/inns/${inn._id}/menu`}
              >
                {shopBox}
              </Link>
            );
          })}
        </div>


          {/* MAP BODY */}
          <div className="grid grid-cols-[6fr_1fr_3fr] gap-4">
            {/* LEFT : ZONE B */}
            <div className="grid grid-cols-6 grid-flow-row gap-3">
              {zoneB?.tables
                ?.filter(
                  (t) => filterStatus === "All" || t.status === filterStatus
                )
                .map((table) => (
                  <TableBoxTW
                    key={table._id}
                    table={table}
                    clickable={false} // ✅ ไม่ hover
                  />
                ))}
            </div>

            <div className="flex justify-center">
              <div className="w-6" />
            </div>

            {/* RIGHT : ZONE A */}
            <div className="grid grid-cols-3 gap-x-3 gap-y-1">
              {zoneA?.tables
                ?.filter(
                  (t) => filterStatus === "All" || t.status === filterStatus
                )
                .slice(0, 9)
                .map((table) => (
                  <TableBoxTW
                    key={table._id}
                    table={table}
                    clickable={true}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function DensityStatus({
  densityPercent,
  lang,
}: {
  densityPercent: number;
  lang: "th" | "en";
}) {
  const t = {
    th: { density: "ความหนาแน่น", normal: "ปกติ", medium: "ปานกลาง", high: "สูง" },
    en: { density: "Density", normal: "Normal", medium: "Medium", high: "High" },
  }[lang];

  let label = t.normal;
  let color = "border-green-500 bg-green-100";

  if (densityPercent >= 70)
    (color = "border-red-500 bg-red-100"), (label = t.high);
  else if (densityPercent >= 35)
    (color = "border-yellow-500 bg-yellow-100"), (label = t.medium);

  return (
    <span className={`px-3 py-1 border rounded-lg text-sm ${color}`}>
      {t.density}: {label} ({densityPercent.toFixed(1)}%)
    </span>
  );
}

function TableBoxTW({
  table,
  clickable = true,
}: {
  table: Table;
  clickable?: boolean;
}) {
  const base =
    "h-20 border-2 rounded-md flex items-center justify-center font-bold text-sm transition-transform";

  const style =
    table.status === "Available"
      ? clickable
        ? "bg-green-100 border-green-600 hover:scale-105"
        : "bg-green-100 border-green-600"
      : table.status === "Reserved"
      ? "bg-yellow-100 border-yellow-500"
      : "bg-red-100 border-red-600";

  if (clickable && table.status === "Available") {
    return (
      <Link to={`/tables/${table._id}`} className={`${base} ${style}`}>
        {table.number}
      </Link>
    );
  }

  return <div className={`${base} ${style}`}>{table.number}</div>;
}








