import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const TYPE_CONFIG = {
  success: {
    bg: 'bg-green-50 border-green-400',
    text: 'text-green-800',
    Icon: CheckCircle,
    iconColor: 'text-green-500',
  },
  error: {
    bg: 'bg-red-50 border-red-400',
    text: 'text-red-800',
    Icon: AlertCircle,
    iconColor: 'text-red-500',
  },
  info: {
    bg: 'bg-blue-50 border-blue-400',
    text: 'text-blue-800',
    Icon: Info,
    iconColor: 'text-blue-500',
  },
};

const Toast = ({ message, type = 'info', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const cfg = TYPE_CONFIG[type] || TYPE_CONFIG.info;
  const { Icon } = cfg;

  return (
    <div className={`fixed top-4 right-4 z-[100] flex items-start gap-3 max-w-sm w-full rounded-lg border p-4 shadow-lg ${cfg.bg} animate-slide-in`}>
      <Icon className={`h-5 w-5 mt-0.5 flex-shrink-0 ${cfg.iconColor}`} />
      <p className={`text-sm font-medium flex-1 ${cfg.text}`}>{message}</p>
      <button
        onClick={onClose}
        className={`flex-shrink-0 ${cfg.text} hover:opacity-70 transition-opacity duration-200`}
        aria-label="Close notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default Toast;
