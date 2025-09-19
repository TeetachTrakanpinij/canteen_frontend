import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Regis from "./pages/Signup";
import LoginSuccess from "./pages/LoginSuccess";
import Profile from "./pages/Profile";
import Editprofile from "./pages/Editprofile";
import { UserProvider } from "./contexts/UserContext"; 
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import CanteenDetail from "./pages/CanteenDetail";

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          {/* หน้าแรก */}
          <Route path="/" element={<Home />} />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Regis />} />
          <Route path="/login-success" element={<LoginSuccess />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Protected Pages */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/editprofile" element={<Editprofile />} />

          {/* กรณีเส้นทางไม่ถูกต้อง */}
          <Route path="*" element={<Navigate to="/" replace />} />

          <Route path="/canteen/:canteenId" element={<CanteenDetail />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
