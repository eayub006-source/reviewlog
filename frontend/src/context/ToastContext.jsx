import { createContext, useCallback, useMemo, useState } from "react";

import Toast from "@/components/common/Toast";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismissToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((toast) => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const nextToast = {
      id,
      tone: "info",
      duration: 3200,
      ...toast,
    };

    setToasts((current) => [...current, nextToast]);

    if (nextToast.duration > 0) {
      window.setTimeout(() => {
        dismissToast(id);
      }, nextToast.duration);
    }

    return id;
  }, [dismissToast]);

  const value = useMemo(() => ({ showToast, dismissToast }), [dismissToast, showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div className="pointer-events-none fixed right-4 top-4 z-50 flex w-[min(92vw,22rem)] flex-col gap-3">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            open
            title={toast.title}
            description={toast.description}
            tone={toast.tone}
            onClose={() => dismissToast(toast.id)}
            inline
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export { ToastContext };
