import { AnimatePresence, motion } from "framer-motion";

export default function PasswordModal({isOpen, onClose, children}: {isOpen: boolean, onClose: () => void, children: React.ReactNode}) {
   return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Background Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
          >
            <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-6 rounded-2xl shadow-xl w-11/12 max-w-md relative">
              <button
                onClick={onClose}
                className="cursor-pointer absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ✕
              </button>

              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}