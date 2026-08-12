import { createContext, useEffect, useMemo, useState } from "react";

import { getProfile, loginUser } from "@/services/authService";
import { clearAuthTokens, getRefreshToken, setAuthTokens } from "@/utils/authStorage";
import { clearProfileCache } from "@/services/profileService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function bootstrap() {
      const refreshToken = getRefreshToken();

      if (!refreshToken) {
        if (mounted) {
          setIsInitializing(false);
          setLoading(false);
        }

        return;
      }

      try {
        const profile = await getProfile();

        if (mounted) {
          setCurrentUser(profile);
        }
      } catch {
        clearAuthTokens();
        clearProfileCache();
        if (mounted) {
          setCurrentUser(null);
        }
      } finally {
        if (mounted) {
          setIsInitializing(false);
          setLoading(false);
        }
      }
    }

    bootstrap();

    function handleLogout() {
      setCurrentUser(null);
    }

    window.addEventListener("auth:logout", handleLogout);

    return () => {
      mounted = false;
      window.removeEventListener("auth:logout", handleLogout);
    };
  }, []);

  async function login(credentials) {
    setLoading(true);

    try {
      const tokens = await loginUser(credentials);
      setAuthTokens(tokens);
      const profile = await getProfile();
      setCurrentUser(profile);
      return profile;
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    setLoading(true);
    clearAuthTokens();
    clearProfileCache();
    setCurrentUser(null);
    setLoading(false);
  }

  const value = useMemo(
    () => ({
      login,
      logout,
      currentUser,
      loading,
      isInitializing,
      isAuthenticated: Boolean(currentUser),
    }),
    [currentUser, loading, isInitializing],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthContext };
