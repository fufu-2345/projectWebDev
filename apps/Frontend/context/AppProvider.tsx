"use client";

import Loader from "@/components/Loader";
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

enum Role {
  User = "user",
  Admin = "admin",
}

interface AppProviderType {
  isLoading: boolean;
  authToken: string | null;
  role: string | null;
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
const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("authToken");
    if (token) {
      setAuthToken(token);
      fetchSession();
    } else {
      router.push("/auth");
    }
    setTimeout(() => {
      setIsLoading(false);
    }, 10);
  });

  const fetchSession = async () => {
    try {
      const response = await axios.get(`${API_URL}/session`, {
        withCredentials: true,
      });
      setRole(response.data.role);
      console.log("role", response.data.role);
    } catch (error) {
      console.error("Failed to fetch session", error);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${API_URL}/login`,
        {
          email,
          password,
        },
        { withCredentials: true }
      );
      if (response.data.status) {
        Cookies.set("authToken", response.data.token, { expires: 7 });
        toast.success("Login successful");
        setAuthToken(response.data.token);
        await fetchSession();
        router.push("/");
      } else {
        toast.error("Invalid login details");
      }
    } catch (error) {
      console.log(error);
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
      toast.success(response.data.message);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setAuthToken(null);
    Cookies.remove("authToken");
    setIsLoading(false);
    toast.success("User logged out");
    router.push("/auth");
  };

  return (
    <AppContext.Provider
      value={{ login, register, isLoading, authToken, role, logout }}
    >
      {isLoading ? <Loader /> : children}
    </AppContext.Provider>
  );
};

export const myAppHook = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("Context will be wrapped inside AppProvider");
  }
  return context;
};
