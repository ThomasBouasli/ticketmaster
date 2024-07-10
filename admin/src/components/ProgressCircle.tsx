"use client";

import { queries } from "@/lib/queries";
import { useQuery } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";

interface CircularProgressBarProps {
  onCompleted: () => void;
}

const CircularProgressBar = ({ onCompleted }: CircularProgressBarProps) => {
  const query = useQuery(queries.inventory.reservationTimeout());

  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    if (!query.data?.timeout) return;

    let startTime: number | null = null;
    const updateProgress = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const newPercentage = Math.min(
        (elapsed / (query.data.timeout * 1_000 * 1.1)) * 100,
        100
      );
      setPercentage(newPercentage);

      if (newPercentage < 100) {
        requestAnimationFrame(updateProgress);
      }

      if (newPercentage >= 100) {
        onCompleted();
      }
    };

    requestAnimationFrame(updateProgress);
  }, [query.data, onCompleted]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="relative w-5 h-5 flex items-center justify-center">
        <div
          className="absolute top-0 left-0 w-full h-full rounded-full"
          style={{
            background: `conic-gradient(#4d5bf9 ${percentage}%, #ddd ${percentage}%)`,
          }}
        />
      </div>
    </div>
  );
};

export default CircularProgressBar;
