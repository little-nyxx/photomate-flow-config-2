import React, { useState } from "react";
import useIdleRedirect from "@/hooks/useIdleRedirect";
import { motion } from "framer-motion";
import { Play, RotateCcw, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ParameterToggle from "@/components/configurator/ParameterToggle";
import VideoPlayer from "@/components/configurator/VideoPlayer";

const LOGO_URL = "/images/logo-white.png";
const BG_URL = "/images/factory.jpg";

const PARAMETERS = [
{ key: "spot", label: "Spot price", icon: "💰" },
{ key: "vyroba", label: "In-house\xA0production", icon: "☀️" },
{ key: "spotreba", label: "own consumption", icon: "🏠" },
{ key: "teplota", label: "Outdoor temperature", icon: "🌡️" }];


export default function Configurator() {
  useIdleRedirect(60000, "/");
  const [params, setParams] = useState({ spot: 0, vyroba: 0, spotreba: 0, teplota: 0 });
  const [isPlaying, setIsPlaying] = useState(false);

  const code = `${params.spot}${params.vyroba}${params.spotreba}${params.teplota}`;

  const handleChange = (key, value) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setParams({ spot: 0, vyroba: 0, spotreba: 0, teplota: 0 });
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${BG_URL})` }} />
      

      {/* Content */}
      <div className="relative z-10 flex flex-col h-screen p-6 lg:p-8">
        {/* Header */}
        <header className="flex items-center justify-center gap-6 mb-6 flex-wrap">
          <div className="flex flex-col items-center gap-1">
            <div className="bg-white/20 rounded-xl px-5 py-3">
              <img src={LOGO_URL} alt="Photomate" className="h-12 w-full object-fill" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight drop-shadow">Energy configurator</h1>
          </div>
          <div className="h-10 w-px bg-white/40" />
          {PARAMETERS.map((p) =>
            <div key={p.key} className="flex flex-col items-center gap-2">
              <span className="text-xs font-semibold text-white/80 uppercase tracking-wider">
                {p.label}
              </span>
              <ParameterToggle
                label=""
                icon={p.icon}
                value={params[p.key]}
                onChange={(v) => handleChange(p.key, v)} />
            </div>
          )}
          <div className="h-16 w-px bg-white/30" />
          <div className="flex flex-col gap-2">
            <Button
              onClick={() => setIsPlaying(true)}
              className="h-12 px-7 text-base font-bold rounded-xl gap-2 shadow-lg shadow-primary/25">
              <Play className="h-5 w-5" />
              Run simulation
            </Button>
            <Button
              onClick={handleReset}
              variant="secondary"
              className="h-12 px-5 text-base font-semibold rounded-xl gap-2">
              <RotateCcw className="h-5 w-5" />
              Reset
            </Button>
          </div>
        </header>

        {/* Main content — full screen background, nothing else */}
        <div className="flex-1" />

        {/* Footer */}
        <footer className="text-center">
          


          
        </footer>
      </div>

      {/* Back to Sales button */}
      <Link
        to="/sales"

        className="absolute bottom-16 right-6 z-20 flex items-center gap-2 px-8 py-5 rounded-xl text-base font-bold text-white shadow-lg shadow-primary/25 transition-all hover:scale-105 bg-primary hover:bg-primary/90">
        
        <ArrowLeft className="h-5 w-5" />
        Back
      </Link>

      {/* Video Player overlay */}
      <VideoPlayer
        code={code}
        isPlaying={isPlaying}
        onClose={() => setIsPlaying(false)} />
      
    </div>);

}