import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, X } from 'lucide-react';
import { useEffect } from 'react';

export default function Toast({ message, type = 'success', isVisible, onClose, duration = 3000 }) {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [isVisible, duration, onClose]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.9 }}
                    className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg bg-green-500 text-white"
                >
                    {type === 'success' ? (
                        <CheckCircle className="w-6 h-6 text-white" />
                    ) : (
                        <XCircle className="w-6 h-6 text-white" />
                    )}

                    <span className="font-medium">{message}</span>

                    <button
                        onClick={onClose}
                        className="ml-2 text-white/80 hover:text-white transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}