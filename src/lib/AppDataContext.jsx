import React, { createContext, useContext, useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

const AppDataContext = createContext();

export function AppDataProvider({ children }) {
  const [buttonLabels, setButtonLabels] = useState({});
  const [circleConfigs, setCircleConfigs] = useState({});
  const [videoMap, setVideoMap] = useState({});
  const [bgImages, setBgImages] = useState([]);
  const [overlayImages, setOverlayImages] = useState([]);
  const [modalPagesMap, setModalPagesMap] = useState({});
  const [configuratorBgUrl, setConfiguratorBgUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAllData = async () => {
      try {
        // Load ButtonLabels
        const labels = await base44.entities.ButtonLabel.list();
        const labelMap = {};
        labels.forEach((r) => {
          if (!labelMap[r.language]) labelMap[r.language] = {};
          labelMap[r.language][r.button_id] = r.label;
        });
        setButtonLabels(labelMap);

        // Load CircleConfig
        const circles = await base44.entities.CircleConfig.list();
        const circleMap = {};
        circles.forEach((r) => { circleMap[r.circle_id] = r; });
        setCircleConfigs(circleMap);

        // Load VideoConfig
        const videos = await base44.entities.VideoConfig.list();
        const videoMap = {};
        videos.forEach((r) => { videoMap[r.code] = r.video_url; });
        setVideoMap(videoMap);

        // Load BackgroundConfig
        const backgrounds = await base44.entities.BackgroundConfig.list();
        backgrounds.sort((a, b) => a.index - b.index);
        setBgImages(backgrounds.map((r) => r.bg_image_url));
        setOverlayImages(backgrounds.map((r) => r.overlay_url));

        // Load ModalPage
        const modalPages = await base44.entities.ModalPage.list();
        const modalMap = {};
        modalPages.forEach((r) => {
          if (!modalMap[r.circle_id]) modalMap[r.circle_id] = [];
          modalMap[r.circle_id].push(r);
        });
        Object.keys(modalMap).forEach((k) => {
          modalMap[k].sort((a, b) => a.page_number - b.page_number);
        });
        setModalPagesMap(modalMap);

        // Load ConfiguratorConfig
        const configurator = await base44.entities.ConfiguratorConfig.list();
        if (configurator[0]?.bg_image_url) {
          setConfiguratorBgUrl(configurator[0].bg_image_url);
        }
      } catch (error) {
        console.error("Error loading app data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAllData();
  }, []);

  return (
    <AppDataContext.Provider
      value={{
        buttonLabels,
        circleConfigs,
        videoMap,
        bgImages,
        overlayImages,
        modalPagesMap,
        configuratorBgUrl,
        isLoading
      }}>
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  return useContext(AppDataContext);
}