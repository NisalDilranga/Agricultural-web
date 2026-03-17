import { createContext, useContext, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';

// ─── Context ──────────────────────────────────────────────────────────────────

const ToastContext = createContext(null);

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
    return ctx;
}

// ─── Single Toast Item ────────────────────────────────────────────────────────

const TOAST_CONFIG = {
    success: {
        icon: CheckCircle,
        bg: 'bg-emerald-600',
        border: 'border-emerald-500',
        iconColor: 'text-white',
    },
    error: {
        icon: XCircle,
        bg: 'bg-rose-600',
        border: 'border-rose-500',
        iconColor: 'text-white',
    },
    info: {
        icon: Info,
        bg: 'bg-blue-600',
        border: 'border-blue-500',
        iconColor: 'text-white',
    },
    warning: {
        icon: AlertTriangle,
        bg: 'bg-amber-500',
        border: 'border-amber-400',
        iconColor: 'text-white',
    },
};

function ToastItem({ id, message, type = 'info', onDismiss }) {
    const cfg = TOAST_CONFIG[type] || TOAST_CONFIG.info;
    const Icon = cfg.icon;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', damping: 28, stiffness: 380 }}
            className={`flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-medium text-white shadow-2xl border ${cfg.bg} ${cfg.border} min-w-[260px] max-w-[380px]`}
        >
            <Icon className={`h-4 w-4 shrink-0 ${cfg.iconColor}`} />
            <span className="flex-1 leading-snug">{message}</span>
            <button
                onClick={() => onDismiss(id)}
                className="ml-1 shrink-0 rounded-full p-0.5 opacity-70 transition hover:opacity-100 hover:bg-white/20"
            >
                <X className="h-3.5 w-3.5" />
            </button>
        </motion.div>
    );
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const dismiss = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const showToast = useCallback((message, type = 'info', duration = 4000) => {
        const id = `${Date.now()}-${Math.random()}`;
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => dismiss(id), duration);
        return id;
    }, [dismiss]);

    // Convenience helpers
    const toast = {
        success: (msg, dur) => showToast(msg, 'success', dur),
        error:   (msg, dur) => showToast(msg, 'error', dur),
        info:    (msg, dur) => showToast(msg, 'info', dur),
        warning: (msg, dur) => showToast(msg, 'warning', dur),
    };

    return (
        <ToastContext.Provider value={toast}>
            {children}

            {/* Toast stack — fixed bottom-right */}
            <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-3 pointer-events-none">
                <AnimatePresence mode="popLayout">
                    {toasts.map((t) => (
                        <div key={t.id} className="pointer-events-auto">
                            <ToastItem
                                id={t.id}
                                message={t.message}
                                type={t.type}
                                onDismiss={dismiss}
                            />
                        </div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}
