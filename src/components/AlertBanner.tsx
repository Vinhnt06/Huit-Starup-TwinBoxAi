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
    <div
      role="alert"
      aria-live="assertive"
      className={`w-full px-4 py-2.5 flex items-center justify-between gap-3 ${
        isCritical
          ? "bg-red-500 text-white"
          : "bg-amber-50 text-amber-800 border-b border-amber-200"
      }`}
    >
      <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold">
        <span
          className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[11px] font-black flex-shrink-0 ${
            isCritical ? "bg-white text-red-500" : "bg-amber-200 text-amber-700"
          }`}
          aria-hidden="true"
        >
          !
        </span>
        <span className="font-bold">
          {isCritical ? "⚠ Cảnh báo nghiêm trọng" : "⚡ Phát hiện bất thường"}:
        </span>
        {isCritical ? (
          state.dslHours <= 0 ? (
            <span>Thời hạn tươi đã hết (DSL = 0 giờ) — Lô hàng cần được xử lý khẩn cấp</span>
          ) : (
            <span>
              Nồng độ C2H4 vượt ngưỡng ({state.c2h4} ppm &gt; 25 ppm) — Đã kích hoạt tần số khẩn cấp
            </span>
          )
        ) : (
          <span>Biến động môi trường — Nồng độ C2H4 / nhiệt độ đang tăng</span>
        )}
      </div>

      <div className={`flex items-center gap-2 text-xs font-semibold flex-shrink-0 ${isCritical ? "text-red-100" : "text-amber-600"}`}>
        <span
          className={`w-1.5 h-1.5 rounded-full ${isCritical ? "bg-red-200" : "bg-amber-400"} animate-pulse`}
          aria-hidden="true"
        />
        Quạt: {state.fanRelay === "ON" ? "Đang chạy" : "Tắt"}
      </div>
    </div>
  );
}
