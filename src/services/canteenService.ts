// src/services/canteenService.ts
export const getCanteenById = async (id: string) => {
  const res = await fetch(`https://canteen-backend-ten.vercel.app/api/canteen/${id}`);
  if (!res.ok) throw new Error("Failed to fetch canteen");
  return res.json();
};

// สมมุติ API จองโต๊ะ (คุณต้องแก้ตาม backend จริง)
export const reserveTable = async (tableId: string) => {
  const token = localStorage.getItem("authToken");
  const res = await fetch(`https://canteen-backend-ten.vercel.app/api/reservations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify({ tableId }),
  });
  if (!res.ok) throw new Error("Failed to reserve table");
  return res.json();
};


