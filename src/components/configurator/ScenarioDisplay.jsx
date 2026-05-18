import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ScenarioDisplay({ code }) {
  const digits = code.split("");

  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
        Kód scénáře
      </span>
      <div className="flex items-center gap-1">
        <span className="text-lg font-medium text-muted-foreground mr-2">Scénář</span>
        <div className="flex gap-1.5">
          {digits.map((digit, i) => (
            <motion.div
              key={i}
              layout
              className="w-14 h-16 rounded-xl flex items-center justify-center text-2xl font-black shadow-sm border"
              style={{
                backgroundColor: digit === "1" ? "hsl(27, 91%, 54%)" : "hsl(0, 0%, 100%)",
                color: digit === "1" ? "white" : "hsl(220, 15%, 30%)",
                borderColor: digit === "1" ? "hsl(27, 91%, 54%)" : "hsl(220, 10%, 88%)",
              }}
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={digit}
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 10, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {digit}
                </motion.span>
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}