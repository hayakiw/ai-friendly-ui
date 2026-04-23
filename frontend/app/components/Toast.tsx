"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useStore } from "../store";

export default function Toast() {
  const { toast } = useStore();
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.25 }}
          className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-slate-900 px-5 py-2 text-sm text-white shadow-lg"
        >
          {toast}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
