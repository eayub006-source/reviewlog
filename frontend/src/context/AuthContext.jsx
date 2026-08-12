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
      } catch (error) {
        // Only clear tokens if the backend explicitly rejects the session (401/403)
        // Note: The axios interceptor handles token refresh. If we reach here with a 401/403, 
        // it means both access and refresh tokens are invalid.
        if (error.response?.status === 401 || error.response?.status === 403) {
          clearAuthTokens();
          clearProfileCache();
          if (mounted) {
            setCurrentUser(null);
          }
        }
        // For other errors (500, 502, network), we keep the tokens in storage 
        // and just finish initialization. ProtectedRoute will still redirect to login 
        // if no user is found, but the tokens will be available for a later retry.
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
