import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Regis from "./pages/Signup";
import LoginSuccess from "./pages/LoginSuccess";
import Profile from "./pages/Profile";
import Editprofile from "./pages/Editprofile";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Regis />} />
        <Route path="/login-success" element={<LoginSuccess />} />

        <Route path="/profile" element={<Profile />} />
        <Route path="/editprofile" element={<Editprofile />} />


      </Routes>
    </Router>
  );
}

export default App;
