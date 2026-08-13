import { useCallback, useEffect, useMemo, useState } from "react";

import { useAuth } from "@/hooks/useAuth";
import { getProfile } from "@/services/profileService";
import { getFriendlyApiError } from "@/utils/apiErrors";

export function useProfile() {
  const { currentUser, updateCurrentUser } = useAuth();
  const [loading, setLoading] = useState(!currentUser);
  const [error, setError] = useState("");

  const loadProfile = useCallback(
    async ({ force = false } = {}) => {
      setLoading(true);
      setError("");

      try {
        const data = await getProfile({ force });
        updateCurrentUser(data);
        return data;
      } catch (caughtError) {
        const message = getFriendlyApiError(caughtError);
        setError(message);
        throw caughtError;
      } finally {
        setLoading(false);
      }
    },
    [updateCurrentUser],
  );

  useEffect(() => {
    if (!currentUser) {
      loadProfile().catch(() => undefined);
    } else {
      setLoading(false);
    }
  }, [currentUser, loadProfile]);

  const value = useMemo(
    () => ({
      profile: currentUser,
      loading,
      error,
      refreshProfile: () => loadProfile({ force: true }),
    }),
    [error, loading, loadProfile, currentUser],
  );

  return value;
}
