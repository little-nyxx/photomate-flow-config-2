import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { X, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import useIdleRedirect from "@/hooks/useIdleRedirect";
import EmsModal from "@/components/EmsModal";
import SvgStretchOverlay from "@/components/SvgStretchOverlay";
import { IMAGES, SVGS, getCircleSvgUrl, getModalImageUrl } from "@/lib/assets";
import { base44 } from "@/api/base44Client";

const BG_IMAGES = [IMAGES.sales_bg, IMAGES.sales_bg_2];
const OVERLAY_IMAGES = [SVGS.packy_1, SVGS.packy_2];
const LOGO_URL = SVGS.logo_3;

const INITIAL_CIRCLES = [
{ id: 1, label: "Inverters", x: 6.6, y: 8 },
{ id: 2, label: "PV Constructions", x: 17.5, y: 8 },
{ id: 3, label: "Heat Pumps", x: 28.3, y: 8 },
{ id: 4, label: "AC/DC EV Chargers", x: 39.2, y: 8 },
{ id: 5, label: "Energy\u000AManagement System", x: 50.0, y: 8 },
{ id: 6, label: "Battery Energy Storage System", x: 60.9, y: 8 },
{ id: 7, label: "Energy Analysis Services", x: 71.7, y: 8 },
{ id: 8, label: "RFG Compliance", x: 82.6, y: 8 },
{ id: 9, label: "Service & Support", x: 93.4, y: 8 }];

const INITIAL_CIRCLES_BG2 = [
{ id: 1, label: "Inverters", x: 6.6, y: 8 },
{ id: 2, label: "PV Constructions", x: 17.5, y: 8 },
{ id: 3, label: "Heat Pumps", x: 28.3, y: 8 },
{ id: 5, label: "Energy\u000AManagement System", x: 39.2, y: 8 },
{ id: 4, label: "AC/DC EV Chargers", x: 50.0, y: 8 },
{ id: 6, label: "Battery Energy Storage System", x: 60.9, y: 8 },
{ id: 7, label: "Energy Analysis Services", x: 71.7, y: 8 },
{ id: 8, label: "RFG Compliance", x: 82.6, y: 8 },
{ id: 9, label: "Service & Support", x: 93.4, y: 8 }];


// Target points on the building for each line (in % of screen)
const LINE_TARGETS = [
{ id: 1, tx: 3, ty: 45 }, // Inverters -> inverters on left wall
{ id: 2, tx: 20, ty: 40 }, // PV Constructions -> roof panels left
{ id: 3, tx: 31, ty: 38 }, // Heat Pumps -> roof center-left
{ id: 4, tx: 50, ty: 82 }, // AC/DC EV Chargers -> EV chargers bottom
{ id: 5, tx: 58, ty: 55 }, // Energy Management System -> screens on wall
{ id: 6, tx: 68, ty: 58 }, // Battery Energy Storage System -> battery units
{ id: 7, tx: 74, ty: 48 }, // Energy Analysis Services -> roof right area
{ id: 8, tx: 85, ty: 35 }, // RFG Compliance -> pylon/antenna
{ id: 9, tx: 90, ty: 52 } // Service & Support -> right side
];

export default function SalesPresentation() {
  useIdleRedirect(60000, "/sales");
  const [editMode, setEditMode] = useState(false);
  const [bottomVisible, setBottomVisible] = useState(true);
  const bottomTimerRef = React.useRef(null);

  const handleScreenTap = () => {
    setBottomVisible(false);
    clearTimeout(bottomTimerRef.current);
    bottomTimerRef.current = setTimeout(() => setBottomVisible(true), 60000);
  };

  useEffect(() => () => clearTimeout(bottomTimerRef.current), []);
  const [labels, setLabels] = useState(
    Object.fromEntries(INITIAL_CIRCLES.map((c) => [c.id, c.label]))
  );
  const [activeModal, setActiveModal] = useState(null);
  const [contentMap, setContentMap] = useState({});

  useEffect(() => {
    base44.entities.CircleConfig.list()
      .then((records) => {
        const map = {};
        records.forEach((r) => { map[r.circle_id] = r; });
        setContentMap(map);
        setLabels((prev) => {
          const updated = { ...prev };
          records.forEach((r) => { if (r.label) updated[r.circle_id] = r.label; });
          return updated;
        });
      })
      .catch(() => {});
  }, []);
  const [emsVideoDone, setEmsVideoDone] = useState(false);
  const [bgIndex, setBgIndex] = useState(() => {
    const saved = localStorage.getItem("salesBgIndex");
    return saved !== null ? parseInt(saved, 10) : 0;
  });
  const touchStartX = useRef(null);
  const [isDesktop, setIsDesktop] = useState(() => typeof window !== 'undefined' && window.innerWidth >= 1280);

  useEffect(() => {
    const handler = () => setIsDesktop(window.innerWidth >= 1280);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const prevBg = () => setBgIndex((i) => {const n = (i - 1 + BG_IMAGES.length) % BG_IMAGES.length;localStorage.setItem("salesBgIndex", n);return n;});
  const nextBg = () => setBgIndex((i) => {const n = (i + 1) % BG_IMAGES.length;localStorage.setItem("salesBgIndex", n);return n;});

  const handleTouchStart = (e) => {touchStartX.current = e.touches[0].clientX;};
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    if (window.innerWidth < 768) { touchStartX.current = null; return; }
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? nextBg() : prevBg();
    touchStartX.current = null;
  };

  return (
    <div
      className="relative w-full min-w-[1000px] md:min-w-0 min-h-screen bg-black select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={handleScreenTap}>
      
      {/* Background carousel */}
      <AnimatePresence mode="sync">
        <motion.img
          key={bgIndex}
          src={BG_IMAGES[bgIndex]}
          alt="background"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 w-full h-full object-cover" />
        
      </AnimatePresence>
      

      {/* SVG overlay matching bg */}
      <SvgStretchOverlay
        key={`overlay-${bgIndex}`}
        src={OVERLAY_IMAGES[bgIndex]}
        className="absolute inset-0 w-full h-full z-20 pointer-events-none" />
      

      {/* Gradient overlay under circles — bottom of top 25% */}
      <div
        className="absolute left-0 right-0 z-10 pointer-events-none"
        style={{
          top: 0,
          height: "38%",
          background: "linear-gradient(to bottom, #275f94cc 0%, transparent 100%)"
        }} />
      

      {/* Bottom left: tagline + EMS button */}
      <div className="absolute bottom-8 left-8 z-20 flex flex-col items-start gap-10">
        <div className={`text-white font-black leading-tight drop-shadow-lg transition-opacity duration-500 ${bottomVisible ? "opacity-100" : "opacity-0"}`} style={{ fontSize: "clamp(1.5rem, 4vw, 1.9rem)", lineHeight: 1.2 }}>
          Touch me and get to know<br />
          <span style={{ color: "#F58220" }}>Photomate</span> Smart<br />
          Energy Solutions!
        </div>
        <Link
          to="/configurator"
          className="px-6 py-3 md:px-8 md:py-4 xl:px-12 xl:py-6 rounded-2xl text-base md:text-lg xl:text-xl font-bold text-white shadow-lg transition-all hover:scale-105"
          style={{ background: "#F58220" }}>
          <span className="flex items-center gap-2">EMS ENERGOMATE scenarios <ArrowRight className="w-5 h-5 xl:w-6 xl:h-6" /></span>
        </Link>
      </div>

      {/* Logo bottom center — no invert */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <button onClick={() => setActiveModal(0)} className="bg-white rounded-2xl px-6 py-2 md:px-8 md:py-3 xl:px-10 xl:py-4 shadow-xl hover:scale-105 transition-all">
          <img src={LOGO_URL} alt="Logo" className="h-10 md:h-12 xl:h-14 object-contain" />
        </button>
      </div>



      {/* Circles */}
      <div
        className={`absolute left-0 right-0 z-20 ${isDesktop ? "flex justify-around items-start px-4 flex-nowrap" : ""}`}
        style={{ top: "2%" }}>
        
        {(bgIndex === 1 ? INITIAL_CIRCLES_BG2 : INITIAL_CIRCLES).map((circle) =>
        <div
          key={circle.id}
          style={isDesktop ? {} : { position: "absolute", left: `${circle.x}%`, transform: "translateX(-50%)" }}>
          <CircleButton
            circle={circle}
            label={labels[circle.id]}
            circleImageUrl={contentMap[circle.id]?.circle_image_url || getCircleSvgUrl(circle.id)}
            editMode={editMode}
            onLabelChange={(val) => setLabels((prev) => ({ ...prev, [circle.id]: val }))}
            onClick={() => !editMode && setActiveModal(circle.id)} />
        </div>
        )}
      </div>

      {/* Carousel arrow buttons */}
      <button
        onClick={prevBg}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-14 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm flex items-center justify-center transition-all hover:scale-110"
        aria-label="Previous background">
        
        <ChevronLeft className="w-6 h-6 md:w-8 text-white" />
      </button>
      <button
        onClick={nextBg}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-14 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm flex items-center justify-center transition-all hover:scale-110"
        aria-label="Next background">
        
        <ChevronRight className="w-6 h-6 md:w-8 text-white" />
      </button>

      {/* Modal */}
      <AnimatePresence mode="wait">
        {activeModal !== null &&
        <ModalOverlay
          key={`modal-${activeModal}`}
          circleId={activeModal}
          modalImageUrl={contentMap[activeModal]?.modal_image_url || getModalImageUrl(activeModal)}
          onClose={() => setActiveModal(null)} />
        }
      </AnimatePresence>
    </div>);

}

function CircleButton({ circle, label, circleImageUrl, editMode, onLabelChange, onClick }) {
  return (
    <div className="flex flex-col items-center gap-2 flex-shrink-0">
      {/* Circle — bigger */}
      <button
        onClick={onClick}
        className="w-24 h-24 md:w-16 md:h-16 lg:w-24 lg:h-24 xl:w-32 xl:h-32 rounded-full border-2 border-white bg-white/10 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-white/25 hover:scale-110 transition-all duration-200 focus:outline-none flex-shrink-0"
        style={{ cursor: editMode ? "default" : "pointer" }}
        tabIndex={editMode ? -1 : 0}>
        
        <img
          src={circleImageUrl}
          alt={label}
          className="w-14 h-14 md:w-10 md:h-10 lg:w-16 lg:h-16 xl:w-20 xl:h-20 object-contain"
          onError={(e) => {e.target.style.opacity = 0.3;}} />
        
      </button>

      {/* Label */}
      {editMode ?
      <textarea
        value={label}
        onChange={(e) => onLabelChange(e.target.value)}
        rows={2}
        className="text-center text-xs font-semibold text-white bg-black/50 border border-white/40 rounded-lg px-2 py-1 resize-none w-28 focus:outline-none focus:border-orange-400" /> :


      <span className="font-semibold text-white drop-shadow-lg max-w-[7rem] leading-tight text-xs text-center" style={{ whiteSpace: "pre-line", marginTop: "10px" }}>
        {label}
      </span>
      }
    </div>);

}

function ModalOverlay({ circleId, modalImageUrl, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85"
      onClick={onClose}>
      
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        className="relative max-w-2xl lg:max-w-4xl xl:max-w-6xl w-full mx-2 sm:mx-4"
        onClick={(e) => e.stopPropagation()}>
        
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-10 w-8 h-8 md:w-10 md:h-10 xl:w-14 xl:h-14 rounded-full bg-white flex items-center justify-center shadow-lg hover:scale-110 transition-all"
          aria-label="Close">
          <X className="w-4 h-4 md:w-5 md:h-5 xl:w-7 xl:h-7 text-foreground" />
        </button>
        <img
          src={modalImageUrl}
          alt={`Modal ${circleId}`}
          className="w-full rounded-2xl shadow-2xl"
          onError={(e) => {
            e.target.src = "";
            e.target.style.display = "none";
          }} />
      </motion.div>
    </motion.div>
  );
}