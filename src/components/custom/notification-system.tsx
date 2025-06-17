"use client";

import * as React from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export type NotificationType = "success" | "error" | "warning" | "info";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, "id">) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = React.createContext<
  NotificationContextType | undefined
>(undefined);

export function useNotifications() {
  const context = React.useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider",
    );
  }
  return context;
}

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notifications, setNotifications] = React.useState<Notification[]>([]);

  const addNotification = React.useCallback(
    (notification: Omit<Notification, "id">) => {
      setNotifications((prev) => {
        // Agar xuddi shunday notification mavjud bo‘lsa, yana qo‘shilmasin
        const alreadyExists = prev.some(
          (n) => n.title === notification.title && n.type === notification.type,
        );

        if (alreadyExists) return prev;

        const id = Math.random().toString(36).substr(2, 9);
        const newNotification = { ...notification, id };

        // Avtomatik o‘chirish
        if (notification.duration !== 0) {
          setTimeout(() => {
            setNotifications((prev) => prev.filter((n) => n.id !== id));
          }, notification.duration || 5000);
        }

        return [...prev, newNotification];
      });
    },
    [],
  );

  const removeNotification = React.useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAll = React.useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, removeNotification, clearAll }}
    >
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  );
}

function NotificationContainer() {
  const { notifications } = useNotifications();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
      {notifications.map((notification) => (
        <NotificationItem key={notification.id} notification={notification} />
      ))}
    </div>
  );
}

function NotificationItem({ notification }: { notification: Notification }) {
  const { removeNotification } = useNotifications();

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
  };

  const colors = {
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
  };

  const iconColors = {
    success: "text-green-600",
    error: "text-red-600",
    warning: "text-yellow-600",
    info: "text-blue-600",
  };

  const Icon = icons[notification.type];

  return (
    <div
      className={cn(
        "p-4 rounded-lg border-2 shadow-lg animate-in slide-in-from-right-full duration-300",
        colors[notification.type],
      )}
    >
      <div className="flex items-start space-x-3">
        <Icon
          className={cn(
            "h-5 w-5 mt-0.5 flex-shrink-0",
            iconColors[notification.type],
          )}
        />
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm">{notification.title}</h4>
          {notification.message && (
            <p className="text-sm mt-1 opacity-90">{notification.message}</p>
          )}
          {notification.action && (
            <button
              onClick={notification.action.onClick}
              className="text-sm font-medium underline mt-2 hover:no-underline"
            >
              {notification.action.label}
            </button>
          )}
        </div>
        <button
          onClick={() => removeNotification(notification.id)}
          className="flex-shrink-0 p-1 rounded-full hover:bg-black/10 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

// Easy to use notification hooks
export function useNotify() {
  const { addNotification } = useNotifications();

  return {
    success: (
      title: string,
      message?: string,
      options?: Partial<Notification>,
    ) => addNotification({ type: "success", title, message, ...options }),
    error: (title: string, message?: string, options?: Partial<Notification>) =>
      addNotification({ type: "error", title, message, ...options }),
    warning: (
      title: string,
      message?: string,
      options?: Partial<Notification>,
    ) => addNotification({ type: "warning", title, message, ...options }),
    info: (title: string, message?: string, options?: Partial<Notification>) =>
      addNotification({ type: "info", title, message, ...options }),
  };
}
