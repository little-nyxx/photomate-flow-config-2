import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { PlayCircle } from "lucide-react";

// Videos and static image from uploaded assets

export default function EmsModal({ onClose }) {
  const [phase, setPhase] = useState("video1"); // "video1" | "video2" | "image"
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play();
    }
  }, [phase]);

  const handleVideoEnded = () => {
    if (phase === "video1") {
      setPhase("video2");
    } else if (phase === "video2") {
      setPhase("image");
    }
  };

  const videoSrc = phase === "video1"
    ? "https://media.base44.com/videos/public/6a0abd7d4f23084851e1d83f/f1bda337b_media1.mp4"
    : "https://media.base44.com/videos/public/6a0abd7d4f23084851e1d83f/fc79e0ac3_media2.mp4";

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
        className="relative max-w-6xl w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Invisible close button top-right */}
        <button
          onClick={onClose}
          className="absolute top-0 right-0 w-14 h-14 z-10 opacity-0 cursor-pointer"
          aria-label="Close"
        />

        {/* Video phase */}
        {(phase === "video1" || phase === "video2") && (
          <video
            key={phase}
            ref={videoRef}
            src={videoSrc}
            className="w-full rounded-2xl shadow-2xl"
            onEnded={handleVideoEnded}
            playsInline
          />
        )}

        {/* Static image phase */}
        {phase === "image" && (
          <div className="relative">
            <img
              src="https://media.base44.com/images/public/6a0abd7d4f23084851e1d83f/6ad42794c_image16.png"
              alt="EMS Static"
              className="w-full rounded-2xl shadow-2xl"
            />
            {/* Schematic button bottom-right */}
            <div className="flex justify-end mt-3">
              <button
                onClick={(e) => { e.stopPropagation(); /* open schematic */ }}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-foreground font-semibold text-sm shadow-lg hover:scale-105 transition-all"
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
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}