import { useCallback, useEffect, useMemo, useState } from "react";

import { getProfile } from "@/services/profileService";
import { getFriendlyApiError } from "@/utils/apiErrors";

export function useProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProfile = useCallback(
    async ({ force = false } = {}) => {
      setLoading(true);
      setError("");

      try {
        const data = await getProfile({ force });
        setProfile(data);
        return data;
      } catch (caughtError) {
        const message = getFriendlyApiError(caughtError);
        setError(message);
        throw caughtError;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    loadProfile().catch(() => undefined);
  }, [loadProfile]);

  const value = useMemo(
    () => ({
      profile,
      loading,
      error,
      refreshProfile: () => loadProfile({ force: true }),
    }),
    [error, loading, loadProfile, profile],
  );

  return value;
}
