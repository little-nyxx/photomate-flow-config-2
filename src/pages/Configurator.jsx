import React, { useState } from "react";
import { motion } from "framer-motion";
import { Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import ParameterToggle from "@/components/configurator/ParameterToggle";
import VideoPlayer from "@/components/configurator/VideoPlayer";

const LOGO_URL = "https://media.base44.com/images/public/6a0abd7d4f23084851e1d83f/60b27b5c6_logo-white.png";
const BG_URL = "https://media.base44.com/images/public/6a0abd7d4f23084851e1d83f/150a26bbd_factory.jpg";

const PARAMETERS = [
{ key: "spot", label: "Cena na SPOT", icon: "💰" },
{ key: "vyroba", label: "Vlastní výroba", icon: "☀️" },
{ key: "spotreba", label: "Vlastní spotřeba", icon: "🏠" },
{ key: "teplota", label: "Venkovní teplota", icon: "🌡️" }];


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
            <div className="bg-gray-900 rounded-xl px-4 py-2">
              <img src={LOGO_URL} alt="Photomate" className="h-10 object-contain" />
            </div>
            <div className="h-8 w-px bg-white/40" />
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight drop-shadow">
                Konfigurátor toků energie
              </h1>
              <p className="text-xs text-white/70">
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
              Spustit
            </Button>
          </div>
        </header>

        {/* Main content — full screen background, nothing else */}
        <div className="flex-1" />

        {/* Footer */}
        <footer className="text-center">
          <p className="text-xs text-muted-foreground hidden">
            © {new Date().getFullYear()} Photomate · Konfigurátor toků energie v{" "}
            <span className="font-mono">1.0</span>
          </p>
        </footer>
      </div>

      {/* Video Player overlay */}
      <VideoPlayer
        code={code}
        isPlaying={isPlaying}
        onClose={() => setIsPlaying(false)} />
      
    </div>);

}