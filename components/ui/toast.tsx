import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  onClose?: () => void;
}

export function Toast({ message, type = "success", onClose }: ToastProps) {
  const typeStyles = {
    success: "bg-green-600 text-white",
    error: "bg-red-600 text-white",
    info: "bg-blue-600 text-white",
  };

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg animate-in slide-in-from-bottom-5",
        typeStyles[type]
      )}
    >
      <span className="text-sm font-medium">{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-2 hover:opacity-80 transition-opacity"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

export function useToast() {
  const [toast, setToast] = React.useState<ToastProps | null>(null);

  const showToast = React.useCallback((message: string, type: ToastProps["type"] = "success") => {
    setToast({ message, type });

    // Auto-hide after 3 seconds
    setTimeout(() => {
      setToast(null);
    }, 3000);
  }, []);

  const hideToast = React.useCallback(() => {
    setToast(null);
  }, []);

  const ToastComponent = React.useMemo(() => {
    if (!toast) return null;
    return <Toast {...toast} onClose={hideToast} />;
  }, [toast, hideToast]);

  return {
    showToast,
    hideToast,
    ToastComponent,
  };
}
