"use client";

import React, { useState, useEffect } from "react";
import { useTelemetrySim } from "@/hooks/useTelemetrySim";
import TelemetryHUD from "@/components/TelemetryHUD";
import ActiveControls from "@/components/ActiveControls";
import ThreeContainer from "@/components/ThreeContainer";
import TechnicalSpecs from "@/components/TechnicalSpecs";
import AlertBanner from "@/components/AlertBanner";
import CRTOverlay from "@/components/CRTOverlay";

export default function Home() {
  const {
    state,
    triggerC2H4Spike,
    resetSimulation,
  } = useTelemetrySim();

  const [logs, setLogs] = useState<string[]>(() => {
    const timeStr = typeof window !== "undefined" 
      ? new Date().toLocaleTimeString("vi-VN", { hour12: false })
      : "00:00:00";
    return [
      `[${timeStr}] [INFO] Khởi động thiết bị thường trực TwinBoxAi thành công...`,
      `[${timeStr}] [INFO] Liên kết giao thức ESP-NOW chuỗi Mesh: Ổn định (3 nodes online)`,
      `[${timeStr}] [INFO] Gateway LTE-4G (A7670C) đang kết nối với Cloud Broker...`
    ];
  });

  // Generate logs dynamically based on telemetry updates
  useEffect(() => {
    const timeStr = new Date().toLocaleTimeString("vi-VN", { hour12: false });
    const newLogs: string[] = [];

    newLogs.push(`[${timeStr}] [DỮ LIỆU] Nhận telemetry từ Node-01: C2H4 = ${state.c2h4} ppm, T_mt = ${state.temperatureAmbient}°C, T_lõi = ${state.temperatureCore}°C`);
    
    if (state.nodeStatus === "CRITICAL") {
      newLogs.push(`[${timeStr}] [CẢNH BÁO] Nồng độ C2H4 NGUY HIỂM! Tần số telemetry tự động chuyển về 1 phút`);
    }

    if (state.fanRelay === "ON") {
      newLogs.push(`[${timeStr}] [CỨU HỘ] Kích hoạt rơ-le quạt thông gió (Active Actuation)`);
    } else {
      newLogs.push(`[${timeStr}] [INFO] Rơ-le quạt thông gió: Tắt`);
    }

    if (state.coolingRelay === "ON") {
      newLogs.push(`[${timeStr}] [CỨU HỘ] Kích hoạt rơ-le máy lạnh (Compressor Actuation)`);
    } else {
      newLogs.push(`[${timeStr}] [INFO] Rơ-le máy lạnh: Tắt`);
    }

    const timer = setTimeout(() => {
      setLogs((prev) => [...newLogs, ...prev].slice(0, 12));
    }, 0);

    return () => clearTimeout(timer);
  }, [
    state.c2h4,
    state.fanRelay,
    state.coolingRelay,
    state.nodeStatus,
    state.temperatureAmbient,
    state.temperatureCore
  ]);

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-[#EAEAEA] flex flex-col font-mono relative pb-12 overflow-x-hidden industrial-grid">
      <CRTOverlay />

      {/* Top Tactical Banner */}
      <div className="w-full bg-[#050505] border-b border-neutral-800 py-6 px-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4AF626] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4AF626]"></span>
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xl md:text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-200 to-neutral-500 font-sans">
                TWINBOX<span className="text-[#4AF626] drop-shadow-[0_0_8px_rgba(74,246,38,0.4)]">AI</span>
              </span>
              <span className="border border-neutral-850 text-neutral-500 text-[8px] px-1 py-0.5 tracking-widest uppercase font-mono bg-[#0A0A0A]">
                REV_2.5.0 // ONLINE
              </span>
            </div>
          </div>
          <h1 className="text-xs md:text-sm font-semibold text-neutral-400 tracking-[0.15em] uppercase font-mono flex items-center gap-2 mt-1">
            <span className="inline-block w-1.5 h-3 bg-[#FF2A2A]"></span>
            Hệ thống giám sát và điều hòa chuỗi lạnh động (Active Actuation)
          </h1>
        </div>

        {/* Top telemetry state bar */}
        <div className="flex flex-wrap items-center gap-4 border border-neutral-800 p-2.5 bg-[#0A0A0A] text-[10px] text-neutral-400 font-mono">
          <div>VĨ ĐỘ: <span className="text-white">10.8231° N</span></div>
          <div>KINH ĐỘ: <span className="text-white">106.6297° E</span></div>
          <div>RSSI: <span className="text-[#4AF626]">-67 dBm</span></div>
          <div>MQTT: <span className="text-[#4AF626]">ĐÃ KẾT NỐI</span></div>
        </div>
      </div>

      {/* Blinking Hazard Banner */}
      <AlertBanner state={state} />

      {/* Main Layout Grid */}
      <div className="max-w-[1400px] w-full mx-auto px-4 mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
        {/* Left 2 Columns: Telemetry, 3D model and Specs */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Telemetry Grid Section */}
          <TelemetryHUD state={state} />

          {/* Interactive 3D shipping container */}
          <ThreeContainer state={state} />

          {/* Technical Specifications */}
          <TechnicalSpecs />
        </div>

        {/* Right 1 Column: Active Controls and Live logs */}
        <div className="flex flex-col gap-6">
          {/* Simulation Active Controls */}
          <ActiveControls
            triggerC2H4Spike={triggerC2H4Spike}
            resetSimulation={resetSimulation}
          />

          {/* Real-time System Logs Console */}
          <div className="border border-neutral-800 bg-[#0F0F0F] p-4 flex flex-col flex-1 min-h-[300px] font-mono">
            <div className="border-b border-neutral-800 pb-2 flex justify-between items-center mb-3">
              <span className="text-xs uppercase tracking-widest text-neutral-400 font-bold">
                [ 04 / CONSOLE LOG DỮ LIỆU MESH HỆ THỐNG ]
              </span>
              <span className="inline-block w-1.5 h-3 bg-[#4AF626] animate-pulse"></span>
            </div>

            <div className="flex-1 overflow-y-auto flex flex-col gap-1.5 text-[10px] text-neutral-400 font-tech leading-normal select-none">
              {logs.map((log, idx) => (
                <div
                  key={idx}
                  className={`border-l-2 pl-2 ${
                    log.includes("[CẢNH BÁO]")
                      ? "border-[#FF2A2A] text-[#FF2A2A]"
                      : log.includes("[CỨU HỘ]")
                      ? "border-amber-500 text-amber-500"
                      : "border-neutral-800 hover:text-white"
                  }`}
                >
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Bottom Crosshairs and technical lines */}
      <div className="max-w-[1400px] w-full mx-auto px-4 mt-6 flex justify-between text-neutral-700 text-[10px] relative z-10 border-t border-neutral-900 pt-4">
        <span>[ TWINBOXAI SYSTEM CORP - DỰ ÁN STARTUP CHUỖI LẠNH NÔNG NGHIỆP ]</span>
        <span>© 2026 // ALL BLUEPRINTS REGISTERED</span>
      </div>
    </main>
  );
}
