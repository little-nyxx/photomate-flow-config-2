import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import useIdleRedirect from "@/hooks/useIdleRedirect";

const BG_URL = "/images/sales_bg.jpg";
const LOGO_URL = "/images/logo-3.svg";

const INITIAL_CIRCLES = [
  { id: 1, label: "Inverters", x: 7.5, y: 8 },
  { id: 2, label: "PV Constructions", x: 18.5, y: 8 },
  { id: 3, label: "Heat Pumps", x: 29.5, y: 8 },
  { id: 4, label: "AC/DC EV Chargers", x: 40.5, y: 8 },
  { id: 5, label: "Energy Management System", x: 51.5, y: 8 },
  { id: 6, label: "Battery Energy Storage System", x: 62.5, y: 8 },
  { id: 7, label: "Energy Analysis Services", x: 73.5, y: 8 },
  { id: 8, label: "RFG Compliance", x: 84.5, y: 8 },
  { id: 9, label: "Service & Support", x: 93.5, y: 8 },
];

export default function SalesPresentation() {
  useIdleRedirect(60000, "/");
  const [editMode, setEditMode] = useState(false);
  const [labels, setLabels] = useState(
    Object.fromEntries(INITIAL_CIRCLES.map((c) => [c.id, c.label]))
  );
  const [activeModal, setActiveModal] = useState(null);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black select-none">
      {/* Background */}
      <img
        src={BG_URL}
        alt="background"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Gradient overlay under circles — bottom of top 25% */}
      <div
        className="absolute left-0 right-0 z-10 pointer-events-none"
        style={{
          top: 0,
          height: "38%",
          background: "linear-gradient(to bottom, #275f94cc 0%, transparent 100%)",
        }}
      />

      {/* Energy Configurator button bottom right — bigger */}
      <Link
        to="/configurator"
        className="absolute bottom-12 right-8 z-20 px-8 py-4 rounded-xl text-base font-bold text-white shadow-lg transition-all hover:scale-105"
        style={{ background: "#F58220" }}
      >
        Energy Configurator
      </Link>

      {/* Logo bottom center — no invert */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <div className="bg-white rounded-2xl px-8 py-3 shadow-xl">
          <img src={LOGO_URL} alt="Logo" className="h-10 object-contain" />
        </div>
      </div>

      {/* Circles */}
      {INITIAL_CIRCLES.map((circle) => (
        <CircleButton
          key={circle.id}
          circle={circle}
          label={labels[circle.id]}
          editMode={editMode}
          onLabelChange={(val) => setLabels((prev) => ({ ...prev, [circle.id]: val }))}
          onClick={() => !editMode && setActiveModal(circle.id)}
        />
      ))}

      {/* Modal */}
      <AnimatePresence>
        {activeModal !== null && (
          <ModalOverlay
            circleId={activeModal}
            onClose={() => setActiveModal(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function CircleButton({ circle, label, editMode, onLabelChange, onClick }) {
  return (
    <div
      className="absolute flex flex-col items-center gap-2 z-20"
      style={{ left: `${circle.x}%`, top: `${circle.y}%`, transform: "translateX(-50%)" }}
    >
      {/* Circle — bigger */}
      <button
        onClick={onClick}
        className="w-24 h-24 rounded-full border-2 border-white bg-white/10 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-white/25 hover:scale-110 transition-all duration-200 focus:outline-none"
        style={{ cursor: editMode ? "default" : "pointer" }}
        tabIndex={editMode ? -1 : 0}
      >
        <img
          src={`/images/circle_${circle.id}.emf`}
          alt={label}
          className="w-16 h-16 object-contain"
          onError={(e) => { e.target.style.opacity = 0.3; }}
        />
      </button>

      {/* Label */}
      {editMode ? (
        <textarea
          value={label}
          onChange={(e) => onLabelChange(e.target.value)}
          rows={2}
          className="text-center text-xs font-semibold text-white bg-black/50 border border-white/40 rounded-lg px-2 py-1 resize-none w-28 focus:outline-none focus:border-orange-400"
        />
      ) : (
        <span className="text-center text-xs font-semibold text-white drop-shadow-lg max-w-[7rem] leading-tight">
          {label}
        </span>
      )}
    </div>
  );
}

function ModalOverlay({ circleId, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        className="relative max-w-4xl w-full mx-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Invisible close button top-right */}
        <button
          onClick={onClose}
          className="absolute top-0 right-0 w-14 h-14 z-10 opacity-0 cursor-pointer"
          aria-label="Close"
        />
        <img
          src={`/images/modal_${circleId}.png`}
          alt={`Modal ${circleId}`}
          className="w-full rounded-2xl shadow-2xl"
          onError={(e) => {
            e.target.src = "";
            e.target.style.display = "none";
          }}
        />
      </motion.div>
    </motion.div>
  );
}