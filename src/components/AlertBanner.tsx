"use client";

import React from "react";
import { TelemetryState } from "@/hooks/useTelemetrySim";

interface AlertBannerProps {
  state: TelemetryState;
}

export default function AlertBanner({ state }: AlertBannerProps) {
  if (state.nodeStatus === "NORMAL") return null;

  const isCritical = state.nodeStatus === "CRITICAL";

  return (
    <div className={`w-full border-y border-[#FF2A2A] px-4 py-2 flex items-center justify-between overflow-hidden animate-pulse ${
      isCritical ? "bg-[#FF2A2A] text-[#0A0A0A]" : "bg-[#1A0C0C] text-[#FF2A2A]"
    }`}>
      <div className="flex items-center gap-4 text-xs md:text-sm font-bold tracking-widest">
        <span>[!] CẢNH BÁO: TRẠNG THÁI {state.nodeStatus}</span>
        <span className="hidden md:inline">{"///"}</span>
        {isCritical ? (
          <span className="hidden md:inline">
            NỒNG ĐỘ C2H4 VƯỢT NGƯỠNG AN TOÀN ({state.c2h4} ppm) &gt;&gt; KÍCH HOẠT TẦN SỐ KHẨN CẤP (1 PHÚT)
          </span>
        ) : (
          <span className="hidden md:inline">
            PHÁT HIỆN BIẾN ĐỘNG MÔI TRƯỜNG: NỒNG ĐỘ C2H4 / NHIỆT ĐỘ TĂNG
          </span>
        )}
      </div>
      <div className="flex items-center gap-2 text-xs md:text-sm font-bold">
        <span>THÔNG GIÓ: {state.fanRelay === "ON" ? "BẬT" : "TẮT"}</span>
        <span>|</span>
        <span>HỆ THỐNG PHÒNG VỆ CHỦ ĐỘNG</span>
      </div>
    </div>
  );
}
