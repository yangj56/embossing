import React from "react";
import { Kiosk } from "../_components/kiosk";

export default function SerialPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Embossing Device Manager</h1>

      <p className="mb-6 text-gray-600">
        This page allows you to connect to and communicate with USB/Serial devices for the embossing
        kiosk. You can send commands and images to the embossing device.
      </p>

      <div className="mb-8">
        <Kiosk />
      </div>
    </div>
  );
}
