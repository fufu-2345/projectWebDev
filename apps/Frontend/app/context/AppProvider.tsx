import { createContext, useContext, useState } from "react";

interface AppProviderType {
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    password_confirmation: string
  ) => Promise<void>;
}

const AppContext = createContext<AppProviderType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const login = async (email: string, password: string) => {};

  const register = async (
    name: string,
    email: string,
    password: string,
    password_confirmation: string
  ) => {};

  return (
    <AppContext.Provider value={{ login, register, isLoading }}>
      {children}
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
