// src/pages/CanteenJ.tsx
import { useEffect, useState } from "react";
import { getCanteenById, reserveTable } from "../services/canteenService";

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

export default function CanteenJ() {
  const [canteen, setCanteen] = useState<Canteen | null>(null);
  const [loading, setLoading] = useState(true);
  const canteenId = "68c91b1f10f6aa118c5f3094"; // J

  useEffect(() => {
    let isMounted = true; // ป้องกัน setState หลัง unmount
    const fetchCanteen = async () => {
      try {
        const data = await getCanteenById(canteenId);
        if (isMounted) setCanteen(data);
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCanteen(); // เรียกตอนแรก
    const interval = setInterval(fetchCanteen, 1000); // polling ทุก 1 วินาที

    return () => {
      isMounted = false;
      clearInterval(interval); // ล้าง interval เมื่อ component ถูก unmount
    };
  }, [canteenId]);

  const handleReserve = async (tableId: string) => {
    try {
      const res = await reserveTable(tableId);
      alert("Reserved successfully!");
      console.log(res);
      // reload canteen หลังจอง
      const updated = await getCanteenById(canteenId);
      setCanteen(updated);
    } catch (err) {
      alert("Failed to reserve");
      console.error(err);
    }
  };

  if (loading) return <p className="p-4">Loading...</p>;
  if (!canteen) return <p className="p-4">Canteen not found</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Canteen {canteen.name}</h1>
      {canteen.zones.map((zone) => (
        <div key={zone._id} className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Zone {zone.name}</h2>
          <div className="grid grid-cols-3 gap-4">
            {zone.tables.map((table) => {
              let bgColor = "";
              let cursorStyle = "cursor-pointer";

              if (table.status === "Available") {
                bgColor = "bg-green-500 hover:bg-green-600";
              } else if (table.status === "Reserved") {
                bgColor = "bg-yellow-400";
                cursorStyle = "cursor-not-allowed";
              } else {
                bgColor = "bg-red-400";
                cursorStyle = "cursor-not-allowed";
              }

              const isAvailable = table.status === "Available";

              return (
                <button
                  key={table._id}
                  onClick={() => isAvailable && handleReserve(table._id)}
                  className={`p-4 rounded-xl text-white font-semibold ${bgColor} ${cursorStyle}`}
                  disabled={!isAvailable}
                >
                  {table.number}
                  <p className="text-xs mt-1">{table.status}</p>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

