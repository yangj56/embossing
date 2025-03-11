"use client";

import React from "react";
import { FrontKiosk } from "./front-kiosk";
import { AdminManager } from "./admin-manager";
import { useApiUrl } from "../context/settings";

export function Kiosk() {
  const apiUrl = useApiUrl();

  return (
    <div className="container">
      <div className="mb-6 flex justify-end">
        <AdminManager />
      </div>

      <div className="mb-8 w-full">
        <FrontKiosk apiUrl={apiUrl} />
      </div>
    </div>
  );
}
