import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ListFilter } from 'lucide-react';

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

interface Canteen {
  _id: string;
  name: string;
  zones?: Zone[];
}

interface Params {
  canteenId?: string;
}

interface CanteenDetailProps {
  lang: "th" | "en";
}

export default function CanteenDetail({ lang }: CanteenDetailProps) {
  const { canteenId } = useParams<{ canteenId?: string }>();
  const [canteen, setCanteen] = useState<Canteen | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterStatus, setFilterStatus] = useState<
    "All" | "Available" | "Reserved" | "Unavailable"
  >("All");

  // Translation dictionary
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
      high: "สูง"
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
      high: "High"
    }
  }[lang];

  useEffect(() => {
    const fetchCanteen = async () => {
      if (!canteenId) return;
      try {
        const res = await fetch(
          `https://canteen-backend-igyy.onrender.com/api/canteen/${canteenId}`
        );
        const data: Canteen = await res.json();
        setCanteen(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCanteen();
  }, [canteenId]);

  if (loading) return <p className="p-4">{t.loading}</p>;
  if (!canteen) return <p className="p-4 text-red-500">{t.notFound}</p>;

  const allTables = canteen.zones?.flatMap((z) => z.tables || []) || [];
  const usedTables = allTables.filter(
    (t) => t.status === "Reserved" || t.status === "Unavailable"
  );

  const densityPercent = allTables.length
    ? (usedTables.length / allTables.length) * 100
    : 0;

  const getStatusText = (status: string) => {
    switch (status) {
      case "Available": return t.available;
      case "Reserved": return t.reserved;
      case "Unavailable": return t.unavailable;
      default: return status;
    }
  };

  return (
  <div className="p-4 font-thai bg-gray-50 min-h-screen">
    <div className="mb-6 flex items-center justify-between flex-wrap gap-4 bg-white p-4 rounded-lg shadow">
      {/* Left side group */}
      <div className="flex flex-wrap items-center gap-4 w-full md:w-auto justify-between md:justify-start">
        <span className="text-sm text-gray-700">
          {t.quantity}: {usedTables.length}/{allTables.length}
        </span>

        <ListFilter className="w-5 h-5 text-gray-500" />

        {/* ขวา (dropdown) */}
        <div className="ml-auto md:ml-0">
          <select
            value={filterStatus}
            onChange={(e) =>
            setFilterStatus(e.target.value as typeof filterStatus)
          }
          className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
          >
            <option value="All">{t.all}</option>
            <option value="Available">{t.available}</option>
            <option value="Reserved">{t.reserved}</option>
            <option value="Unavailable">{t.unavailable}</option>
          </select>
        </div>
      </div>

      {/* Right side */}
      <DensityStatus densityPercent={densityPercent} lang={lang} />
    </div>

    {/* Zones */}
    {canteen.zones?.map((zone) => (
      <div key={zone._id} className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b-2 border-gray-300 pb-2">
          {t.zone} {zone.name}
        </h2>


        {/* Tables */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {zone.tables
            ?.filter(
              (table) =>
                filterStatus === "All" || table.status === filterStatus
            )
            .map((table) =>
              table.status === "Available" ? (
                <Link
                  key={table._id}
                  to={`/tables/${table._id}`}
                  className="p-4 rounded-lg text-center border font-semibold bg-green-100 border-green-400 hover:bg-green-200 hover:scale-105 transform transition cursor-pointer shadow-sm"
                >
                  <p className="font-bold text-lg">{table.number}</p>
                  <p className="text-sm text-green-700">{getStatusText(table.status)}</p>
                </Link>
              ) : (
                <div
                  key={table._id}
                  className={`p-4 rounded-lg text-center border font-semibold shadow-sm ${
                    table.status === "Reserved"
                      ? "bg-yellow-100 border-yellow-400 text-yellow-700"
                      : "bg-red-100 border-red-400 text-red-700"
                  }`}
                >
                  <p className="font-bold text-lg">{table.number}</p>
                  <p className="text-sm">{getStatusText(table.status)}</p>
                </div>
              )
            )}
        </div>
      </div>
    ))}
  </div>
);

}

// Density Status Component with Language Support
function DensityStatus({ 
  densityPercent, 
  lang 
}: { 
  densityPercent: number;
  lang: "th" | "en";
}) {
  const t = {
    th: {
      density: "ความหนาแน่น",
      normal: "ปกติ",
      medium: "ปานกลาง",
      high: "สูง"
    },
    en: {
      density: "Density",
      normal: "Normal",
      medium: "Medium",
      high: "High"
    }
  }[lang];

  let densityLabel = "";
  let borderColor = "";
  let bgColor = "";

  if (densityPercent < 35) {
    densityLabel = t.normal;
    borderColor = "border-green-500";
    bgColor = "bg-green-100";
  } else if (densityPercent < 70) {
    densityLabel = t.medium;
    borderColor = "border-yellow-500";
    bgColor = "bg-yellow-100";
  } else {
    densityLabel = t.high;
    borderColor = "border-red-500";
    bgColor = "bg-red-100";
  }

  return (
    <span className={`text-sm font-medium px-3 py-1 rounded-lg border ${borderColor} ${bgColor}`}>
      {t.density}: {densityLabel} ({densityPercent.toFixed(1)}%)
    </span>
  );
}
