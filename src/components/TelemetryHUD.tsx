"use client";

import React from "react";
import { TelemetryState } from "@/hooks/useTelemetrySim";

interface TelemetryHUDProps {
  state: TelemetryState;
}

export default function TelemetryHUD({ state }: TelemetryHUDProps) {
  const isCritical = state.nodeStatus === "CRITICAL";
  const isWarning = state.nodeStatus === "WARNING";

  // Calculate percentage of remaining shelf life (assuming max is 360 hours)
  const maxShelfLife = 360;
  const dslPercent = Math.min(100, Math.max(0, (state.dslHours / maxShelfLife) * 100));
  const totalBars = 20;
  const activeBars = Math.round((dslPercent / 100) * totalBars);
  const asciiBar = "█".repeat(activeBars) + "░".repeat(totalBars - activeBars);

  return (
    <div className="w-full border border-neutral-800 bg-[#0F0F0F] p-4 flex flex-col gap-4 font-mono">
      {/* HUD Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-neutral-800 pb-2 gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 bg-[#4AF626] animate-pulse"></span>
          <span className="text-xs uppercase tracking-widest text-neutral-400 font-bold">
            [ TRẠNG THÁI CẢM BIẾN THEO THỜI GIAN THỰC // NODE-01 ]
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <span>CHU KỲ ĐỌC: <span className="text-white font-bold">{state.telemetryInterval}</span></span>
          <span>PIN: <span className="text-[#4AF626] font-bold">{state.batteryVoltage} V</span></span>
          <span>
            HỆ THỐNG:{" "}
            <span
              className={`font-bold ${
                isCritical ? "text-[#FF2A2A]" : isWarning ? "text-amber-500" : "text-[#4AF626]"
              }`}
            >
              {state.nodeStatus === "NORMAL" ? "BÌNH THƯỜNG" : state.nodeStatus === "WARNING" ? "CẢNH BÁO" : "NGUY HIỂM"}
            </span>
          </span>
        </div>
      </div>

      {/* Telemetry Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Ethylene (C2H4) Metric */}
        <div className={`border p-3 flex flex-col justify-between ${
          isCritical ? "border-[#FF2A2A] bg-[#FF2A2A]/5" : "border-neutral-800 bg-[#0A0A0A]"
        }`}>
          <div>
            <div className="flex justify-between items-center text-neutral-400 text-xs font-bold">
              <span>KHÍ ETHYLENE (C2H4)</span>
              <span className="text-[10px] text-neutral-600">ĐƠN VỊ: PPM</span>
            </div>
            <div className="text-2xl md:text-3xl font-extrabold text-white tracking-tighter mt-2 flex items-baseline gap-2">
              <span>{state.c2h4}</span>
              <span className="text-xs text-neutral-500 font-normal">ppm</span>
            </div>
          </div>
          <div className="flex justify-between items-center mt-3 border-t border-neutral-900 pt-2 text-[10px]">
            <span className="text-neutral-500">XU HƯỚNG: {state.c2h4Trend === "UP" ? "TĂNG" : state.c2h4Trend === "DOWN" ? "GIẢM" : "ỔN ĐỊNH"}</span>
            <span className={state.c2h4 > 25 ? "text-[#FF2A2A] font-bold" : "text-[#4AF626] font-bold"}>
              {state.c2h4 > 25 ? "[ NGUY HIỂM ]" : "[ AN TOÀN ]"}
            </span>
          </div>
        </div>

        {/* Ambient Temperature */}
        <div className="border border-neutral-800 p-3 flex flex-col justify-between bg-[#0A0A0A]">
          <div>
            <div className="flex justify-between items-center text-neutral-400 text-xs font-bold">
              <span>NHIỆT ĐỘ KHÔNG KHÍ</span>
              <span className="text-[10px] text-neutral-600">ĐƠN VỊ: °C</span>
            </div>
            <div className="text-2xl md:text-3xl font-extrabold text-white tracking-tighter mt-2 flex items-baseline gap-2">
              <span>{state.temperatureAmbient}</span>
              <span className="text-xs text-neutral-500 font-normal">°C</span>
            </div>
          </div>
          <div className="flex justify-between items-center mt-3 border-t border-neutral-900 pt-2 text-[10px]">
            <span className="text-neutral-500">XU HƯỚNG: {state.tempTrend === "UP" ? "TĂNG" : state.tempTrend === "DOWN" ? "GIẢM" : "ỔN ĐỊNH"}</span>
            <span className={state.temperatureAmbient > 6 ? "text-amber-500 font-bold" : "text-[#4AF626] font-bold"}>
              {state.temperatureAmbient > 6 ? "[ NHIỆT CAO ]" : "[ TỐI ƯU ]"}
            </span>
          </div>
        </div>

        {/* Core Temperature */}
        <div className="border border-neutral-800 p-3 flex flex-col justify-between bg-[#0A0A0A]">
          <div>
            <div className="flex justify-between items-center text-neutral-400 text-xs font-bold">
              <span>NHIỆT ĐỘ LÕI SẢN PHẨM</span>
              <span className="text-[10px] text-neutral-600">NHIỆT LÕI (CORE)</span>
            </div>
            <div className="text-2xl md:text-3xl font-extrabold text-white tracking-tighter mt-2 flex items-baseline gap-2">
              <span>{state.temperatureCore}</span>
              <span className="text-xs text-neutral-500 font-normal">°C</span>
            </div>
          </div>
          <div className="flex justify-between items-center mt-3 border-t border-neutral-900 pt-2 text-[10px] text-neutral-500">
            <span>TRỄ NHIỆT: TÍCH LŨY</span>
            <span>SAI SỐ: ±0.1°C</span>
          </div>
        </div>

        {/* Humidity */}
        <div className="border border-neutral-800 p-3 flex flex-col justify-between bg-[#0A0A0A]">
          <div>
            <div className="flex justify-between items-center text-neutral-400 text-xs font-bold">
              <span>ĐỘ ẨM TƯƠNG ĐỐI</span>
              <span className="text-[10px] text-neutral-600">ĐƠN VỊ: % RH</span>
            </div>
            <div className="text-2xl md:text-3xl font-extrabold text-white tracking-tighter mt-2 flex items-baseline gap-2">
              <span>{state.humidity}</span>
              <span className="text-xs text-neutral-500 font-normal">%</span>
            </div>
          </div>
          <div className="flex justify-between items-center mt-3 border-t border-neutral-900 pt-2 text-[10px] text-neutral-500">
            <span>BUỒNG THỞ: ePTFE</span>
            <span className="text-[#4AF626] font-bold">[ ỔN ĐỊNH ]</span>
          </div>
        </div>
      </div>

      {/* Arrhenius Dynamic Shelf Life Section */}
      <div className="border border-neutral-800 bg-[#0A0A0A] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-neutral-300 uppercase tracking-wide">
              DỰ ĐOÁN ĐỘNG HỌC ARRHENIUS // DYNAMIC SHELF LIFE (DSL)
            </span>
            <span className="text-[10px] bg-neutral-800 px-1.5 py-0.5 text-neutral-400">MÔ HÌNH CORE v1.0</span>
          </div>
          <p className="text-[10px] text-neutral-500 mt-1 max-w-xl">
            Tốc độ chín và phân hủy sinh học của thực vật phụ thuộc phi tuyến tính vào nhiệt độ tích lũy lõi. Mô hình Arrhenius nâng cao của TwinBox AI kết hợp mô hình truyền nhiệt Lumped-parameter và quá trình thoát hơi nước tự nhiên thu nhiệt để ước lượng chính xác nhiệt độ lõi thực tế, từ đó dự đoán thời gian tươi ngon còn lại (Dynamic Shelf Life - DSL) theo thời gian thực.
          </p>
        </div>
        <div className="flex flex-col items-end gap-2 border-l border-neutral-800 pl-0 md:pl-6">
          <div className="flex items-baseline gap-2 text-right">
            <span className="text-xs text-neutral-500">HSD CÒN LẠI:</span>
            {state.dslHours <= 0 ? (
              <span className="text-sm font-extrabold text-[#FF2A2A] tracking-tight animate-pulse uppercase">[ ĐÃ HỎNG / EXPIRED ]</span>
            ) : (
              <>
                <span className="text-2xl font-extrabold text-[#4AF626] tracking-tight">{state.dslHours}</span>
                <span className="text-xs text-neutral-500">GIỜ</span>
              </>
            )}
          </div>
          <div className="flex flex-col gap-1 w-full md:w-56 text-left md:text-right">
            <div className={`text-[10px] font-tech overflow-hidden whitespace-nowrap ${state.dslHours <= 0 ? "text-[#FF2A2A]" : "text-[#4AF626]"}`}>
              {asciiBar}
            </div>
            <div className="flex justify-between text-[8px] text-neutral-500 uppercase tracking-widest mt-1">
              <span>0 giờ</span>
              <span>180 giờ</span>
              <span>360 giờ</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
