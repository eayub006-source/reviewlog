import { useEffect, useState } from "react";
import { WifiOff } from "lucide-react";

function OfflineNotice() {
  const [offline, setOffline] = useState(() => !navigator.onLine);
  useEffect(() => {
    const onOnline = () => setOffline(false);
    const onOffline = () => setOffline(true);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => { window.removeEventListener("online", onOnline); window.removeEventListener("offline", onOffline); };
  }, []);
  return offline ? <div className="fixed inset-x-0 bottom-4 z-[60] mx-auto flex w-fit items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white shadow-xl" role="status" aria-live="polite"><WifiOff className="h-4 w-4" />You are offline. Changes may not be saved.</div> : null;
}

export default OfflineNotice;
