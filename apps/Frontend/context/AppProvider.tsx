"use client";

import Loader from "@/components/Loader";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export enum Role {
  User = "user",
  Admin = "admin",
}

interface AppProviderType {
  isLoading: boolean;
  authToken: string | null;
  role: Role;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    password_confirmation: string
  ) => Promise<void>;
  logout: () => void;
}

const AppContext = createContext<AppProviderType | undefined>(undefined);
const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`; // e.g. http://127.0.0.1:8000/api
const ME_ENDPOINT = `${API_URL}/me`;                   // backend ควรคืน { id, name, role }

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [role, setRole] = useState<Role>(Role.User);
  const router = useRouter();

  // แนบ Authorization ให้ axios อัตโนมัติเมื่อมี token
  useEffect(() => {
    if (authToken) {
      axios.defaults.headers.common.Authorization = `Bearer ${authToken}`;
    } else {
      delete axios.defaults.headers.common.Authorization;
    }
  }, [authToken]);

  // โหลดสถานะเริ่มต้นจาก cookie และยืนยัน role จากตาราง users ผ่าน /me
  useEffect(() => {
    const token = Cookies.get("authToken") || null;
    const cookieRole = (Cookies.get("role") || "").toLowerCase();

    if (token) {
      setAuthToken(token);
      if (cookieRole === Role.Admin || cookieRole === Role.User) {
        setRole(cookieRole as Role);
      }

      (async () => {
        try {
          const res = await axios.get(ME_ENDPOINT, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const serverRole = String(res.data?.role || "").toLowerCase();
          if (serverRole === Role.Admin || serverRole === Role.User) {
            setRole(serverRole as Role);
            Cookies.set("role", serverRole, { expires: 7 });
          }
        } catch {
          // token เสีย/หมดอายุ → ล้างแล้วส่งไปหน้า auth
          Cookies.remove("authToken");
          Cookies.remove("role");
          setAuthToken(null);
          setRole(Role.User);
          router.push("/auth");
        } finally {
          setIsLoading(false);
        }
      })();
    } else {
      setIsLoading(false);
      router.push("/auth");
    }
    // รันครั้งเดียวตอน mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      if (response.data?.status) {
        const token = String(response.data.token || "");
        const serverRole = String(response.data.role || "").toLowerCase();

        Cookies.set("authToken", token, { expires: 7 });
        Cookies.set("role", serverRole, { expires: 7 });

        setAuthToken(token);
        setRole(serverRole === Role.Admin ? Role.Admin : Role.User);

        toast.success("Login successful");
        router.push("/");
      } else {
        toast.error("Invalid login details");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    password_confirmation: string
  ) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/register`, {
        name,
        email,
        password,
        password_confirmation,
      });
      toast.success(response.data?.message || "Register success");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Register failed");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setAuthToken(null);
    setRole(Role.User);
    Cookies.remove("authToken");
    Cookies.remove("role");
    setIsLoading(false);
    toast.success("User logged out");
    router.push("/auth");
  };

  const value = useMemo<AppProviderType>(
    () => ({ login, register, isLoading, authToken, role, logout }),
    // login/register เป็นฟังก์ชันที่ประกาศใน component นี้
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isLoading, authToken, role]
  );

  return (
    <AppContext.Provider value={value}>
      {isLoading ? <Loader /> : children}
    </AppContext.Provider>
  );
};

export const myAppHook = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("Context will be wrapped inside AppProvider");
  return context;
};
