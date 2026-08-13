import { createContext, useEffect, useMemo, useState, useCallback } from "react";

import { getProfile, loginUser } from "@/services/authService";
import { clearAuthTokens, getRefreshToken, setAuthTokens } from "@/utils/authStorage";
import { clearProfileCache } from "@/services/profileService";
import { clearReviewCache } from "@/services/reviewService";
import { clearFavoriteCache } from "@/services/favoriteService";

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
      } catch (error) {
        if (error.response?.status === 401 || error.response?.status === 403) {
          clearAuthTokens();
          clearProfileCache();
          clearReviewCache();
          clearFavoriteCache();
          if (mounted) {
            setCurrentUser(null);
          }
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
    clearReviewCache();
    clearFavoriteCache();
    setCurrentUser(null);
    setLoading(false);
  }

  const updateCurrentUser = useCallback((userData) => {
    setCurrentUser(userData);
  }, []);

  const value = useMemo(
    () => ({
      login,
      logout,
      currentUser,
      updateCurrentUser,
      loading,
      isInitializing,
      isAuthenticated: Boolean(currentUser),
    }),
    [currentUser, loading, isInitializing, updateCurrentUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthContext };
