interface ElectronAPI {
  // Fullscreen controls
  toggleFullscreen: () => Promise<boolean>;
  enterFullscreen: () => Promise<boolean>;
  exitFullscreen: () => Promise<boolean>;

  // Configuration storage (if needed)
  saveConfig: (config: any) => Promise<boolean>;
  loadConfig: () => Promise<any>;
}

interface Window {
  electronAPI: ElectronAPI;
  electronTest: {
    ping: () => string;
  };
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
    electronTest: {
      ping: () => string;
    };
  }
}
