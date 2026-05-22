import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const BG_IMAGES = [
  "/images/sales_bg.jpg",
  "/images/sales_bg_2.jpg",
];
const LOGO2_URL = "/images/logo-2.svg";

export default function Intro() {
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const touchStartX = useRef(null);

  const goTo = (index, dir) => {
    setDirection(dir);
    setCurrent(index);
  };

  const prev = (e) => {
    e.stopPropagation();
    const idx = (current - 1 + BG_IMAGES.length) % BG_IMAGES.length;
    goTo(idx, -1);
  };

  const next = (e) => {
    e.stopPropagation();
    const idx = (current + 1) % BG_IMAGES.length;
    goTo(idx, 1);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        const idx = (current + 1) % BG_IMAGES.length;
        goTo(idx, 1);
      } else {
        const idx = (current - 1 + BG_IMAGES.length) % BG_IMAGES.length;
        goTo(idx, -1);
      }
    }
    touchStartX.current = null;
  };

  const variants = {
    enter: (dir) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
  };

  return (
    <div
      className="relative w-full h-screen overflow-hidden bg-black cursor-pointer"
      onClick={() => loaded && navigate("/sales")}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Loading spinner */}
      <AnimatePresence>
        {!loaded && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black"
          >
            <div className="w-12 h-12 rounded-full border-4 border-white/20 border-t-white animate-spin" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background carousel */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.img
          key={current}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.5, ease: "easeInOut" }}
          src={BG_IMAGES[current]}
          alt="background"
          className="absolute inset-0 w-full h-full object-cover"
          onLoad={() => setLoaded(true)}
        />
      </AnimatePresence>

      {/* Logo centered top */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 z-10">
        <img src={LOGO2_URL} alt="Logo" className="h-64 object-contain" />
      </div>

      {/* Left arrow */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm flex items-center justify-center transition-all hover:scale-110"
        aria-label="Previous"
      >
        <ChevronLeft className="w-8 h-8 text-white" />
      </button>

      {/* Right arrow */}
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm flex items-center justify-center transition-all hover:scale-110"
        aria-label="Next"
      >
        <ChevronRight className="w-8 h-8 text-white" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {BG_IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={(e) => { e.stopPropagation(); goTo(i, i > current ? 1 : -1); }}
            className={`w-3 h-3 rounded-full transition-all ${i === current ? "bg-white scale-110" : "bg-white/40 hover:bg-white/70"}`}
          />
        ))}
      </div>
    </div>
  );
}