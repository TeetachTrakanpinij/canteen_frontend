import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      // เก็บ token ไว้ localStorage / cookie
      localStorage.setItem("token", token);
      navigate("/home"); // ไปหน้าแรก
    } else {
      navigate("/login"); // ถ้าไม่มี token
    }
  }, [navigate]);

  return <p>กำลังเข้าสู่ระบบ...</p>;
}
