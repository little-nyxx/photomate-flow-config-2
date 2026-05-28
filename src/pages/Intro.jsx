import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const BG_IMAGES = ["/images/sales_bg.jpg", "/images/sales_bg_2.jpg"];
const LOGO2_URL = "/images/logo-2.svg";
const LOGO4_URL = "/images/logo-4.svg";

export default function Intro() {
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);
  const bgIndex = parseInt(localStorage.getItem("salesBgIndex") || "0", 10);
  const BG_URL = BG_IMAGES[bgIndex] || BG_IMAGES[0];

  return (
    <div
      className="relative w-full h-screen overflow-hidden bg-black cursor-pointer"
      onClick={() => loaded && navigate("/sales")}
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

      {/* Background */}
      <img
        src={BG_URL}
        alt="background"
        className="absolute inset-0 w-full h-full object-cover"
        onLoad={() => setLoaded(true)}
      />

      {/* Logo centered top — bigger */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 z-10">
        <img src={bgIndex === 1 ? LOGO4_URL : LOGO2_URL} alt="Logo" className="h-32 object-contain" />
      </div>
    </div>
  );
}