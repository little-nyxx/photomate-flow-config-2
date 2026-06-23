import React, { useState, useEffect } from "react";
import useIdleRedirect from "@/hooks/useIdleRedirect";
import { motion } from "framer-motion";
import { Play, RotateCcw, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ParameterToggle from "@/components/configurator/ParameterToggle";
import VideoPlayer from "@/components/configurator/VideoPlayer";
import { IMAGES, SVGS, getVideoUrl } from "@/lib/assets";
import { base44 } from "@/api/base44Client";

const LOGO_URL = SVGS.logo_3;
const DEFAULT_BG_URL = IMAGES.factory;

const PARAMETERS = [
{ key: "spot", label: "Spot price", icon: "💰" },
{ key: "vyroba", label: "Own PV\xA0production", icon: "☀️" },
{ key: "spotreba", label: "Own consumption\nand EV charging", icon: "🏠" },
{ key: "teplota", label: "Outdoor temperature", icon: "🌡️" }];


export default function Configurator() {
  useIdleRedirect(60000, "/");
  const [params, setParams] = useState({ spot: 0, vyroba: 0, spotreba: 0, teplota: 0 });
  const [videoMap, setVideoMap] = useState({});
  const [bgUrl, setBgUrl] = useState(DEFAULT_BG_URL);

  useEffect(() => {
    base44.entities.VideoConfig.list()
      .then((records) => {
        const map = {};
        records.forEach((r) => { map[r.code] = r.video_url; });
        setVideoMap(map);
      })
      .catch(() => {});
    base44.entities.ConfiguratorConfig.list()
      .then((records) => {
        if (records[0]?.bg_image_url) setBgUrl(records[0].bg_image_url);
      })
      .catch(() => {});
  }, []);
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
    <div className="relative min-h-screen w-full">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgUrl})` }} />
      

      {/* Logo top-left */}
      <div className="absolute left-6 top-6 z-10">
        <img src={LOGO_URL} alt="Photomate" className="h-16 sm:h-20 md:h-24 object-contain" />
      </div>

      {/* Right panel — bottom on mobile, right side on desktop */}
      <div className="absolute z-10 flex flex-col items-center justify-start p-4 sm:p-6 gap-3 sm:gap-5 left-0 right-0 bottom-0 bg-black/60 sm:bg-transparent backdrop-blur-sm sm:backdrop-blur-none sm:left-auto sm:bottom-auto sm:top-0 sm:right-0 sm:h-full sm:w-[260px]">
        {/* Parameters */}
        <div className="flex flex-row sm:flex-col items-center justify-center gap-2 sm:gap-0 w-full overflow-x-auto sm:overflow-visible">
          {PARAMETERS.map((p) =>
            <div key={p.key} className="flex flex-col items-center flex-shrink-0 sm:w-full" style={{ height: "90px" }}>
              <span className="text-xs font-semibold text-white sm:text-black uppercase tracking-wider text-center drop-shadow h-8 flex items-center justify-center whitespace-pre-line">
                {p.label}
              </span>
              <ParameterToggle
                label=""
                icon={p.icon}
                value={params[p.key]}
                onChange={(v) => handleChange(p.key, v)} />
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3 w-full mt-0 sm:mt-2">
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

        className="absolute top-6 right-4 sm:top-auto sm:bottom-16 sm:right-6 z-20 flex items-center gap-2 px-6 py-3 sm:px-8 sm:py-5 rounded-xl text-sm sm:text-base font-bold text-white shadow-lg shadow-primary/25 transition-all hover:scale-105 bg-primary hover:bg-primary/90">
        
        <ArrowLeft className="h-5 w-5" />
        Back
      </Link>

      {/* Video Player overlay */}
      <VideoPlayer
        code={code}
        isPlaying={isPlaying}
        playTrigger={playTrigger}
        videoSrc={videoMap[code] || getVideoUrl(code)}
        bgUrl={bgUrl}
        onClose={() => setIsPlaying(false)} />
      
    </div>);

}