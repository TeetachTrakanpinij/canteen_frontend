import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface User {
  name: string;
  nickname: string;
  email: string;
  imageProfile?: string;
  role: "user" | "chef" | "admin";
}

interface UserContextType {
  user: User | null;
  setUser: (user: User) => void;
  refreshUser: () => void;

  isLoggedIn: boolean;
  isAdmin: boolean;
  isChef: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const refreshUser = () => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    fetch("https://canteen-backend-igyy.onrender.com/api/user/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    refreshUser();
  }, []);

  // ===== 🔐 ROLE CHECK =====
  const isLoggedIn = !!user;
  const isAdmin = user?.role === "admin";
  const isChef = user?.role === "chef";

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        refreshUser,
        isLoggedIn,
        isAdmin,
        isChef,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};


export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};
