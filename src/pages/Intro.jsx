import React from "react";
import { Link } from "react-router-dom";

const BG_URL = "/images/sales_bg.jpg";
const LOGO2_URL = "/images/logo-2.svg";

export default function Intro() {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Background */}
      <img
        src={BG_URL}
        alt="background"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Logo centered top */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 z-10">
        <img src={LOGO2_URL} alt="Logo" className="h-24 object-contain" />
      </div>

      {/* Click anywhere to continue */}
      <Link to="/sales" className="absolute inset-0 z-20" />
    </div>
  );
}