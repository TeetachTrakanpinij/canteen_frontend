import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

interface Table {
  _id: string;
  number: string;
  status: string;
}

interface Zone {
  _id: string;
  name: string;
  tables: Table[];
}

interface Canteen {
  _id: string;
  name: string;
  zones: Zone[];
}

export default function CanteenDetail() {
  const { canteenId } = useParams<{ canteenId: string }>();
  const [canteen, setCanteen] = useState<Canteen | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!canteenId) return;

    const fetchCanteen = async () => {
      try {
        const res = await fetch(`https://canteen-backend-ten.vercel.app/api/canteen/${canteenId}`);
        const data: Canteen = await res.json();
        setCanteen(data);
      } catch (err) {
        console.error("Error fetching canteen:", err);
      } finally {
        setLoading(false);
      }
    };

    // เรียกครั้งแรกทันที
    fetchCanteen();

    // ตั้ง interval polling ทุก 3 วินาที
    const interval = setInterval(fetchCanteen, 3000);

    // ล้าง interval เมื่อ component unmount หรือ canteenId เปลี่ยน
    return () => clearInterval(interval);
  }, [canteenId]);

  if (loading) return <p className="p-4">กำลังโหลด...</p>;
  if (!canteen) return <p className="p-4 text-red-500">ไม่พบโรงอาหาร</p>;

  return (
    <div className="p-4">
      {/* ชื่อโรงอาหาร */}
      <h1 className="text-2xl font-bold mb-4">{canteen.name}</h1>

      {/* Zones */}
      {canteen.zones.map((zone) => (
        <div key={zone._id} className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Zone {zone.name}</h2>

          {/* Tables */}
          <div className="grid grid-cols-3 gap-3">
            {zone.tables.map((table) => (
              <div
                key={table._id}
                className={`p-3 rounded-lg text-center border font-semibold ${
                  table.status === "Available"
                    ? "bg-green-100 border-green-400"
                    : table.status === "Reserved"
                    ? "bg-yellow-100 border-yellow-400"
                    : "bg-red-100 border-red-400"
                }`}
              >
                <p>{table.number}</p>
                <p>{table.status}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
