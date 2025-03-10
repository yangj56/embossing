import React from "react";
import { Search, ShoppingCart, Menu, ArrowRight, Sun, Zap, Heart } from "lucide-react";

export const Benefits = () => {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="p-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <Sun className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="mb-2 text-xl font-semibold">Smart Controls</h3>
          <p className="text-gray-600">Control your lighting from anywhere with our smart app</p>
        </div>
        <div className="p-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <Zap className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="mb-2 text-xl font-semibold">Energy Efficient</h3>
          <p className="text-gray-600">Save energy and reduce your carbon footprint</p>
        </div>
        <div className="p-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <Heart className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="mb-2 text-xl font-semibold">Modern Design</h3>
          <p className="text-gray-600">Beautiful fixtures that complement your space</p>
        </div>
      </div>
    </div>
  );
};
