"use client";

import React, { useEffect, useState } from "react";

export default function DhakaClock() {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      // Dhaka is UTC+6
      const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Dhaka",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: true,
      });
      setTime(formatter.format(now));
    };

    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="inline-flex items-center gap-2 font-mono text-[11px] text-text-muted tabular-nums">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
      <span>DHAKA {time ? time : "06:00 PM"} (UTC+6)</span>
    </div>
  );
}
