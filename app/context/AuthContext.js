"use client";
import { createContext, useContext, useEffect, useState } from "react";
import api from "../utils/axiosInstance";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);

  const getUser = async () => {
    try {
      const res = await api.get("/Controllers/me");
      setUser(res.data);
    } catch {
      setUser(null);
    }
  };

  const logout = async () => {
    await api.post("/Controllers/logout");
    setUser(null);
    router.push("/login");
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, getUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
