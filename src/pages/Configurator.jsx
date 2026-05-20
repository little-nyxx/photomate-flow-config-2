import React, { useState } from "react";
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
{ key: "vyroba", label: "In-house production", icon: "☀️" },
{ key: "spotreba", label: "own consumption", icon: "🏠" },
{ key: "teplota", label: "Outdoor temperature", icon: "🌡️" }];


export default function Configurator() {
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
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 rounded-xl px-4 py-2">
              <img src={LOGO_URL} alt="Photomate" className="h-10 object-contain" />
            </div>
            <div className="h-8 w-px bg-white/40" />
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight drop-shadow">Energy configurator

              </h1>
              <p className="text-xs text-white/70 hidden">
                Interaktivní vizualizace energetických scénářů
              </p>
            </div>
          </div>

          {/* Parameter toggles + action buttons in top right */}
          <div className="flex items-center gap-4">
            {PARAMETERS.map((p) =>
            <div key={p.key} className="flex flex-col items-center gap-1">
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
            <div className="h-16 w-px bg-white/30 mx-2" />
            <Button
              onClick={handleReset}
              variant="ghost"
              className="h-12 px-4 text-sm font-semibold rounded-xl gap-2 text-white hover:bg-white/20 border border-white/30">
              
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
            <Button
              onClick={() => setIsPlaying(true)}
              className="h-12 px-6 text-sm font-bold rounded-xl gap-2 shadow-lg shadow-primary/25">
              
              <Play className="h-5 w-5" />
              Run simulation
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

        className="absolute bottom-16 right-6 z-20 flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white shadow-lg shadow-primary/25 transition-all hover:scale-105 bg-primary hover:bg-primary/90"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Link>

      {/* Video Player overlay */}
      <VideoPlayer
        code={code}
        isPlaying={isPlaying}
        onClose={() => setIsPlaying(false)} />
      
    </div>);

}