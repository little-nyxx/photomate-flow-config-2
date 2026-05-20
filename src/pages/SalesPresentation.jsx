import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import useIdleRedirect from "@/hooks/useIdleRedirect";
import EmsModal from "@/components/EmsModal";

const BG_URL = "https://media.base44.com/images/public/6a0abd7d4f23084851e1d83f/6326b2f45_image1.jpg";
const LOGO_URL = "/images/logo-3.svg";

const MODAL_IMAGES = {
  1: "https://media.base44.com/images/public/6a0abd7d4f23084851e1d83f/6f3b54bf2_modal5.png",
  5: "https://media.base44.com/images/public/6a0abd7d4f23084851e1d83f/018e9b879_modal5.png",
};

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

// Target points on the building for each line (in % of screen)
const LINE_TARGETS = [
  { id: 1, tx: 3,    ty: 45 },  // Inverters -> inverters on left wall
  { id: 2, tx: 20,   ty: 40 },  // PV Constructions -> roof panels left
  { id: 3, tx: 31,   ty: 38 },  // Heat Pumps -> roof center-left
  { id: 4, tx: 50,   ty: 82 },  // AC/DC EV Chargers -> EV chargers bottom
  { id: 5, tx: 58,   ty: 55 },  // Energy Management System -> screens on wall
  { id: 6, tx: 68,   ty: 58 },  // Battery Energy Storage System -> battery units
  { id: 7, tx: 74,   ty: 48 },  // Energy Analysis Services -> roof right area
  { id: 8, tx: 85,   ty: 35 },  // RFG Compliance -> pylon/antenna
  { id: 9, tx: 90,   ty: 52 },  // Service & Support -> right side
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
      <div
        className="absolute left-0 right-0 z-20 flex justify-around items-start px-4"
        style={{ top: "2%" }}
      >
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
      </div>

      {/* Modal */}
      <AnimatePresence>
        {activeModal === 5 && (
          <ModalOverlay
            circleId={5}
            onClose={() => setActiveModal(null)}
            onShowSchematic={() => setActiveModal("5_2")}
          />
        )}
        {activeModal === "5_2" && (
          <SchematicModal onClose={() => setActiveModal(5)} />
        )}
        {activeModal !== null && activeModal !== 5 && (
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
    <div className="flex flex-col items-center gap-2">
      {/* Circle — bigger */}
      <button
        onClick={onClick}
        className="w-32 h-32 rounded-full border-2 border-white bg-white/10 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-white/25 hover:scale-110 transition-all duration-200 focus:outline-none"
        style={{ cursor: editMode ? "default" : "pointer" }}
        tabIndex={editMode ? -1 : 0}
      >
        <img
          src={`/images/circle_${circle.id}.svg`}
          alt={label}
          className="w-20 h-20 object-contain"
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

function ModalOverlay({ circleId, onClose, onShowSchematic }) {
  const [showSchematic, setShowSchematic] = useState(false);

  return (
    <>
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
          className="relative max-w-4xl w-full mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Invisible close button top-right */}
          <button
            onClick={onClose}
            className="absolute top-0 right-0 w-14 h-14 z-10 opacity-0 cursor-pointer"
            aria-label="Close"
          />
          <img
            src={MODAL_IMAGES[circleId] || `/images/modal_${circleId}.png`}
            alt={`Modal ${circleId}`}
            className="w-full rounded-2xl shadow-2xl"
            onError={(e) => {
              e.target.src = "";
              e.target.style.display = "none";
            }}
          />
          {circleId === 5 && (
            <button
              onClick={onShowSchematic}
              className="absolute bottom-0 right-0 flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-foreground font-semibold text-sm shadow-lg hover:scale-105 transition-all"
            >
              <span
                className="w-0 h-0 inline-block"
                style={{
                  borderTop: "8px solid transparent",
                  borderBottom: "8px solid transparent",
                  borderLeft: "14px solid hsl(var(--primary))",
                }}
              />
              Schematic of EMS operation
            </button>
          )}
        </motion.div>
      </motion.div>

    </>
  );
}

function SchematicModal({ onClose }) {
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
        className="relative max-w-4xl w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-0 right-0 w-14 h-14 z-10 opacity-0 cursor-pointer"
          aria-label="Close"
        />
        <img
          src="/images/modal_5_2.png"
          alt="Schematic of EMS operation"
          className="w-full rounded-2xl shadow-2xl"
          onError={(e) => {
            e.target.src = "";
            e.target.style.display = "none";
          }}
        />
        <button
          onClick={onClose}
          className="absolute bottom-0 right-0 flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-foreground font-semibold text-sm shadow-lg hover:scale-105 transition-all"
        >
          <span
            className="w-0 h-0 inline-block"
            style={{
              borderTop: "8px solid transparent",
              borderBottom: "8px solid transparent",
              borderLeft: "14px solid hsl(var(--primary))",
            }}
          />
          Back
        </button>
      </motion.div>
    </motion.div>
  );
}