import React, { useState } from "react";
import useIdleRedirect from "@/hooks/useIdleRedirect";
import { motion } from "framer-motion";
import { Play, RotateCcw, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ParameterToggle from "@/components/configurator/ParameterToggle";
import VideoPlayer from "@/components/configurator/VideoPlayer";

const LOGO_URL = "/images/logo-3.svg";
const BG_URL = "/images/factory.jpg";

const PARAMETERS = [
{ key: "spot", label: "Spot price", icon: "💰" },
{ key: "vyroba", label: "Own PV\xA0production", icon: "☀️" },
{ key: "spotreba", label: "Own consumption\nand EV charging", icon: "🏠" },
{ key: "teplota", label: "Outdoor temperature", icon: "🌡️" }];


export default function Configurator() {
  useIdleRedirect(60000, "/");
  const [params, setParams] = useState({ spot: 0, vyroba: 0, spotreba: 0, teplota: 0 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [playTrigger, setPlayTrigger] = useState(0);

  const code = `${params.spot}${params.vyroba}${params.spotreba}${params.teplota}`;

  const handleChange = (key, value) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setParams({ spot: 0, vyroba: 0, spotreba: 0, teplota: 0 });
    setIsPlaying(false);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${BG_URL})` }} />
      

      {/* Logo top-left */}
      <div className="absolute left-6 top-6 z-10">
        <img src={LOGO_URL} alt="Photomate" className="h-12 object-contain" />
      </div>

      {/* Right panel — no background */}
      <div className="absolute right-0 top-0 h-full z-10 flex flex-col items-center justify-start p-6 gap-5" style={{ width: "260px" }}>
        {/* Parameters */}
        {PARAMETERS.map((p) =>
          <div key={p.key} className="flex flex-col items-center w-full" style={{ height: "90px" }}>
            <span className="text-xs font-semibold text-black uppercase tracking-wider text-center drop-shadow h-8 flex items-center justify-center whitespace-pre-line">
              {p.label}
            </span>
            <ParameterToggle
              label=""
              icon={p.icon}
              value={params[p.key]}
              onChange={(v) => handleChange(p.key, v)} />
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col gap-3 w-full mt-2">
          <Button
            onClick={() => { setIsPlaying(true); setPlayTrigger(t => t + 1); }}
            className="w-full h-12 text-base font-bold rounded-xl gap-2 shadow-lg shadow-primary/25">
            <Play className="h-5 w-5" />
            Run simulation
          </Button>
          <Button
            onClick={handleReset}
            variant="secondary"
            className="w-full h-12 text-base font-semibold rounded-xl gap-2">
            <RotateCcw className="h-5 w-5" />
            Reset
          </Button>
        </div>
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
        playTrigger={playTrigger}
        onClose={() => setIsPlaying(false)} />
      
    </div>);

}