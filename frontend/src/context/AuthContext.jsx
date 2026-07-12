import { createContext, useContext, useEffect, useState } from "react";
import { setAccessToken, registerTokenRefreshHandler, refreshAdminToken, fetchMe, logoutAdmin } from "../services/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [accessToken, setToken] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [initializing, setInitializing] = useState(true);

  const applyToken = (token) => {
    setToken(token);
    setAccessToken(token);
  };


  useEffect(() => {
    registerTokenRefreshHandler((newToken) => {
      applyToken(newToken);
      if (!newToken) setAdmin(null);
    });

    (async () => {
      try {
        const res = await refreshAdminToken();
        const token = res.data.data.accessToken;
        applyToken(token);
        const meRes = await fetchMe();
        setAdmin(meRes.data.data);
      } catch {
        applyToken(null);
      } finally {
        setInitializing(false);
      }
    })();
  }, []);

  const login = (token, adminData) => {
    applyToken(token);
    setAdmin(adminData);
  };

  const logout = async () => {
    try {
      await logoutAdmin();
    } catch {
    }
    applyToken(null);
    setAdmin(null);
  };

  return (
    <AuthContext.Provider
      value={{ accessToken, admin, isAuthenticated: !!accessToken, initializing, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth doit être utilisé dans un AuthProvider");
  return ctx;
}
