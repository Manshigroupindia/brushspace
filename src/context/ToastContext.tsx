import React, { createContext, useContext, useState, useCallback } from 'react';

interface ToastData {
  id: string;
  message: string;
  icon?: string;
}

interface ToastContextType {
  showToast: (message: string, icon?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const showToast = useCallback((message: string, icon: string = 'check_circle') => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts((prev) => [...prev, { id, message, icon }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast container matching Stitch */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="bg-on-secondary-fixed text-surface px-5 py-3.5 rounded-xl shadow-xl flex items-center gap-3 transition-all duration-300 animate-slide-up pointer-events-auto"
          >
            <span className="material-symbols-outlined text-primary text-[20px]">
              {toast.icon}
            </span>
            <span className="font-body-sm text-body-sm font-medium">
              {toast.message}
            </span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
