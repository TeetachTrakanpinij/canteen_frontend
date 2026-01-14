import { useUser } from "../contexts/UserContext";

export default function MenuPage() {
  const { isAdmin, isChef } = useUser();

  return (
    <div>
      <h2>เมนูอาหาร</h2>

      {(isAdmin || isChef) && (
        <button className="btn btn-success">
          ➕ เพิ่มเมนู
        </button>
      )}
    </div>
  );
}
