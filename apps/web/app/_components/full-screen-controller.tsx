// Example component with fullscreen controls
import React from "react";
import { Button } from "./shadcn/button";

export function FullscreenControls() {
  const toggleFullscreen = async () => {
    if (window.electronAPI) {
      await window.electronAPI.toggleFullscreen();
    } else {
      // Fallback for web browsers
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    }
  };

  return (
    <Button onClick={toggleFullscreen} variant={"outline"}>
      Toggle Fullscreen
    </Button>
  );
}
