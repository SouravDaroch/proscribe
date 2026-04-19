import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";

// CUSTOM CONFIRMATION MODAL ---
export default function ConfirmDeleteModal({ isOpen, onClose, onConfirm, title }: any) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full border border-gray-100"
                    >
                        <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 mb-6">
                            <AlertTriangle size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Article?</h3>
                        <p className="text-gray-500 text-sm leading-relaxed mb-8">
                            Are you sure you want to delete <span className="font-bold text-gray-700">"{title}"</span>? This action is permanent.
                        </p>
                        <div className="flex gap-3">
                            <button onClick={onClose} className="flex-1 py-3 px-4 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer">
                                Cancel
                            </button>
                            <button onClick={onConfirm} className="flex-1 py-3 px-4 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 shadow-lg shadow-red-200 transition-all cursor-pointer">
                                Yes, Delete
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}