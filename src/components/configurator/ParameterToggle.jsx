import React from "react";
import { motion } from "framer-motion";

export default function ParameterToggle({ label, icon, value, onChange }) {
  return (
    <div className="flex flex-col items-center gap-3">
      {label && (
        <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          {label}
        </span>
      )}
      <button
        onClick={() => onChange(value === 0 ? 1 : 0)}
        className="relative w-36 h-20 rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50"
        style={{
          borderColor: value === 1 ? "hsl(27, 91%, 54%)" : "hsl(220, 10%, 85%)",
          backgroundColor: value === 1 ? "hsl(27, 91%, 54%)" : "hsl(0, 0%, 100%)"
        }}>
        
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="absolute top-2 w-16 h-16 rounded-xl shadow-lg flex items-center justify-center"
          style={{
            left: value === 1 ? "calc(100% - 4.5rem)" : "0.5rem",
            backgroundColor: value === 1 ? "white" : "hsl(220, 10%, 94%)"
          }}>
          
          <span className="text-2xl">{icon}</span>
        </motion.div>
        <div
          className="absolute top-1/2 -translate-y-1/2 text-xs font-bold uppercase tracking-wide"
          style={{
            left: value === 1 ? "0.4rem" : undefined,
            right: value === 0 ? "1rem" : undefined,
            color: value === 1 ? "rgba(255,255,255,0.9)" : "hsl(220, 10%, 55%)"
          }}>
          
          {value === 1 ? "Vysoká" : "Nízká"}
        </div>
      </button>

    </div>);

}