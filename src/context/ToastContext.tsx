import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type ToastType = "success" | "error" | "warning" | "info";

interface ToastItem {
  id: number;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastContextType {
  toast: {
    success: (message: string, duration?: number) => void;
    error: (message: string, duration?: number) => void;
    warning: (message: string, duration?: number) => void;
    info: (message: string, duration?: number) => void;
  };
}

// ─── Context ─────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextType | null>(null);

// ─── Hook ────────────────────────────────────────────────────────────────────

export const useToast = (): ToastContextType => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
};

// ─── Style map ───────────────────────────────────────────────────────────────

const styles: Record<
  ToastType,
  { container: string; icon: ReactNode; progressBar: string }
> = {
  success: {
    container:
      "bg-white dark:bg-gray-800 border-l-4 border-emerald-500 shadow-lg shadow-emerald-500/10",
    icon: <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />,
    progressBar: "bg-emerald-500",
  },
  error: {
    container:
      "bg-white dark:bg-gray-800 border-l-4 border-red-500 shadow-lg shadow-red-500/10",
    icon: <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />,
    progressBar: "bg-red-500",
  },
  warning: {
    container:
      "bg-white dark:bg-gray-800 border-l-4 border-amber-500 shadow-lg shadow-amber-500/10",
    icon: (
      <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
    ),
    progressBar: "bg-amber-500",
  },
  info: {
    container:
      "bg-white dark:bg-gray-800 border-l-4 border-blue-500 shadow-lg shadow-blue-500/10",
    icon: <Info className="w-5 h-5 text-blue-500 flex-shrink-0" />,
    progressBar: "bg-blue-500",
  },
};

// ─── Single Toast Component ──────────────────────────────────────────────────

const ToastCard = ({
  item,
  onClose,
}: {
  item: ToastItem;
  onClose: () => void;
}) => {
  const duration = item.duration ?? 4000;
  const style = styles[item.type];

  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 80, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 80, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={`relative overflow-hidden rounded-lg ${style.container} w-full max-w-sm pointer-events-auto`}
    >
      <div className="flex items-start gap-3 px-4 py-3">
        {style.icon}
        <p className="text-sm font-medium text-gray-800 dark:text-gray-200 flex-1 leading-relaxed">
          {item.message}
        </p>
        <button
          onClick={onClose}
          className="p-0.5 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition flex-shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Progress bar */}
      <motion.div
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: duration / 1000, ease: "linear" }}
        className={`h-0.5 ${style.progressBar} origin-left`}
      />
    </motion.div>
  );
};

// ─── Provider ────────────────────────────────────────────────────────────────

let toastId = 0;

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback(
    (type: ToastType, message: string, duration?: number) => {
      const id = ++toastId;
      setToasts((prev) => [...prev, { id, type, message, duration }]);
    },
    [],
  );

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = {
    success: (message: string, duration?: number) =>
      addToast("success", message, duration),
    error: (message: string, duration?: number) =>
      addToast("error", message, duration),
    warning: (message: string, duration?: number) =>
      addToast("warning", message, duration),
    info: (message: string, duration?: number) =>
      addToast("info", message, duration),
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      {/* Toast Container — fixed top-right */}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map((item) => (
            <ToastCard
              key={item.id}
              item={item}
              onClose={() => removeToast(item.id)}
            />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
