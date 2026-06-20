"use client";

import React, { useState, useEffect } from "react";
import { useTelemetrySim } from "@/hooks/useTelemetrySim";
import TelemetryHUD from "@/components/TelemetryHUD";
import ActiveControls from "@/components/ActiveControls";
import ThreeContainer from "@/components/ThreeContainer";
import TechnicalSpecs from "@/components/TechnicalSpecs";
import AlertBanner from "@/components/AlertBanner";
import PricingSection from "@/components/PricingSection";


// ── Feature item type ───────────────────────────────────────────────────────
interface Feature {
  icon: string;
  title: string;
  desc: string;
  stat: string;
  statLabel: string;
  color: string;
  bg: string;
}

const FEATURES: Feature[] = [
  {
    icon: "🌡️",
    title: "Giám sát nhiệt độ tức thì",
    desc: "Theo dõi nhiệt độ không khí và lõi sản phẩm trong container lạnh 24/7, tự động cảnh báo khi vượt ngưỡng an toàn.",
    stat: "±0.1°C",
    statLabel: "Độ chính xác",
    color: "#2563EB",
    bg: "#EFF6FF",
  },
  {
    icon: "🌿",
    title: "Phát hiện khí Ethylene (C2H4)",
    desc: "Cảm biến chuyên dụng đo nồng độ khí Ethylene — nguyên nhân chính khiến trái cây chín và hỏng nhanh — theo thời gian thực.",
    stat: "< 25 ppm",
    statLabel: "Ngưỡng an toàn",
    color: "#16A34A",
    bg: "#F0FDF4",
  },
  {
    icon: "🤖",
    title: "Dự đoán thời hạn tươi (DSL)",
    desc: "AI sử dụng mô hình Arrhenius tính toán chính xác số giờ nông sản còn tươi ngon, giúp bạn lên kế hoạch xuất hàng đúng lúc.",
    stat: "≤ 360 giờ",
    statLabel: "Dự báo trước",
    color: "#7C3AED",
    bg: "#F5F3FF",
  },
  {
    icon: "🔋",
    title: "Tiết kiệm năng lượng thông minh",
    desc: "Thiết bị sử dụng Deep Sleep tối ưu, pin Li-ion 18650 hoạt động liên tục 3–4 tuần trong môi trường lạnh mà không cần sạc.",
    stat: "3–4 tuần",
    statLabel: "Tuổi thọ pin",
    color: "#D97706",
    bg: "#FFFBEB",
  },
  {
    icon: "📡",
    title: "Kết nối không dây xuyên container",
    desc: "Giao thức ESP-NOW mesh vượt qua lồng Faraday của container thép. Dữ liệu gửi về Cloud qua 4G LTE theo chuẩn MQTT.",
    stat: "4G LTE",
    statLabel: "Kết nối Cloud",
    color: "#0891B2",
    bg: "#ECFEFF",
  },
  {
    icon: "📦",
    title: "Xuất hàng thông minh (Dynamic FEFO)",
    desc: "Hệ thống tự động sắp xếp ưu tiên xuất kho lô hàng có nguy cơ hỏng sớm hơn trước, thay thế phương pháp FIFO truyền thống.",
    stat: "< 10%",
    statLabel: "Mục tiêu hao hụt",
    color: "#DC2626",
    bg: "#FEF2F2",
  },
];

// ── How it works steps ──────────────────────────────────────────────────────
const HOW_IT_WORKS = [
  { step: "01", title: "Cảm biến thu thập", desc: "Các node ESP32 bên trong container đo nhiệt độ, độ ẩm và khí Ethylene mỗi 15 phút." },
  { step: "02", title: "Truyền về Gateway", desc: "Dữ liệu được gửi qua mạng mesh ESP-NOW đến Gateway 4G LTE tại cửa container." },
  { step: "03", title: "AI phân tích & cảnh báo", desc: "Cloud broker nhận data, AI tính Dynamic Shelf Life và kích hoạt cảnh báo nếu cần." },
  { step: "04", title: "Dashboard & hành động", desc: "Bạn theo dõi toàn bộ trên dashboard này và điều khiển quạt / máy lạnh từ xa." },
];

export default function Home() {
  const { state, triggerC2H4Spike, resetSimulation } = useTelemetrySim();

  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const t = new Date().toLocaleTimeString("vi-VN", { hour12: false });
    const next: string[] = [];

    next.push(`[${t}] [DATA] Node-01 → C2H4 = ${state.c2h4} ppm | T_mt = ${state.temperatureAmbient}°C | T_core = ${state.temperatureCore}°C`);

    if (state.nodeStatus === "CRITICAL")
      next.push(`[${t}] [CẢNH BÁO] C2H4 nguy hiểm! Chuyển tần số telemetry → 1 phút`);
    if (state.fanRelay === "ON")
      next.push(`[${t}] [ACTION] Quạt thông gió đã được kích hoạt`);
    else
      next.push(`[${t}] [INFO] Quạt thông gió: Tắt`);
    if (state.coolingRelay === "ON")
      next.push(`[${t}] [ACTION] Máy lạnh (Compressor) đã được kích hoạt`);

    const id = setTimeout(() => {
      setLogs((prev) => [...next, ...prev].slice(0, 14));
    }, 0);

    return () => clearTimeout(id);
  }, [
    state.c2h4, state.fanRelay, state.coolingRelay,
    state.nodeStatus, state.temperatureAmbient, state.temperatureCore,
  ]);

  const isCritical = state.nodeStatus === "CRITICAL";
  const isWarning  = state.nodeStatus === "WARNING";
  const statusBadge = isCritical ? "badge-critical" : isWarning ? "badge-warning" : "badge-normal";
  const statusLabel = isCritical ? "⚠ Nguy hiểm" : isWarning ? "⚡ Cảnh báo" : "✓ Bình thường";

  return (
    <main className="min-h-screen bg-[#F7F8FA] text-[#0F1117] flex flex-col overflow-x-hidden">

      {/* ── TOP NAV ─────────────────────────────────────────────────────── */}
      <nav className="nav-blur sticky top-0 z-50 w-full" aria-label="Main navigation">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-green-600 flex items-center justify-center text-white text-sm font-black">T</div>
            <span className="font-bold text-[15px] text-gray-900 tracking-tight">
              TwinBox <span className="text-green-600">AI</span>
            </span>
            <span className="hidden sm:inline text-[10px] font-mono-tech border border-green-200 text-green-600 px-1.5 py-0.5 rounded bg-green-50 uppercase tracking-widest">
              v2.5 · LIVE
            </span>
          </div>

          {/* Status Chip */}
          <div className={`flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full ${statusBadge}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isCritical ? "bg-red-500 animate-pulse" : isWarning ? "bg-amber-500 animate-pulse" : "bg-green-500"}`} />
            {statusLabel}
          </div>
        </div>
      </nav>

      {/* ── HERO SECTION ────────────────────────────────────────────────── */}
      <section className="hero-gradient w-full py-12 sm:py-16 px-4 section-grid" aria-label="Hero">
        <div className="max-w-[1280px] mx-auto">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 hero-badge px-3 py-1.5 mb-5 text-xs font-semibold text-green-700">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            Hệ thống đang hoạt động · 3 nodes online · MQTT Connected
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight max-w-3xl">
            Giám sát chuỗi lạnh nông sản <br className="hidden sm:block" />
            <span className="text-green-600">thông minh</span> bằng AI
          </h1>
          <p className="mt-4 text-base sm:text-lg text-gray-500 max-w-2xl leading-relaxed">
            TwinBox AI theo dõi nhiệt độ, khí Ethylene và dự đoán thời gian tươi ngon của nông sản trong container lạnh — giúp bạn giảm hao hụt, tối ưu xuất hàng và bảo vệ lợi nhuận.
          </p>

          {/* Quick Stats */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl">
            {[
              { v: `${state.c2h4} ppm`, l: "Ethylene (C2H4)", ok: state.c2h4 <= 25 },
              { v: `${state.temperatureAmbient}°C`, l: "Nhiệt độ môi trường", ok: state.temperatureAmbient <= 6 },
              { v: `${state.humidity}%`, l: "Độ ẩm", ok: true },
              { v: state.dslHours > 0 ? `${state.dslHours} giờ` : "Hết hạn", l: "Thời hạn tươi còn lại", ok: state.dslHours > 0 },
            ].map((s) => (
              <div key={s.l} className="card p-3 sm:p-4">
                <div className={`text-xl sm:text-2xl font-extrabold stat-number ${s.ok ? "text-green-600" : "text-red-500"}`}>
                  {s.v}
                </div>
                <div className="text-[11px] text-gray-400 mt-0.5 leading-tight">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────────────────── */}
      <section className="w-full py-16 px-4 bg-[#F7F8FA]" aria-label="How it works">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Cách hoạt động</span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              4 bước đơn giản — tự động hoàn toàn
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {HOW_IT_WORKS.map((step, idx) => (
              <div key={step.step} className="relative card p-5">
                {idx < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-5 h-0.5 bg-green-200 z-10" aria-hidden="true" />
                )}
                <div className="text-2xl font-black text-green-100 mb-3 font-mono-tech">{step.step}</div>
                <h3 className="font-bold text-gray-900 text-sm mb-1.5">{step.title}</h3>
                <p className="text-gray-400 text-xs leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ALERT BANNER ────────────────────────────────────────────────── */}
      <AlertBanner state={state} />

      {/* ── LIVE DASHBOARD ──────────────────────────────────────────────── */}
      <section className="w-full py-8 px-4" aria-label="Live dashboard">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex items-center gap-2 mb-5">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Bảng điều khiển thời gian thực</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Left: Telemetry + 3D + Specs */}
            <div className="lg:col-span-2 flex flex-col gap-5">
              <TelemetryHUD state={state} />
              <ThreeContainer state={state} />
              <TechnicalSpecs />
            </div>

            {/* Right: Controls + Console */}
            <div className="flex flex-col gap-5">
              <ActiveControls
                triggerC2H4Spike={triggerC2H4Spike}
                resetSimulation={resetSimulation}
              />

              {/* Console Log */}
              <div className="card-flat p-4 flex flex-col min-h-[280px]">
                <div className="flex justify-between items-center border-b border-gray-100 pb-2 mb-3">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                    Console — Dữ liệu Mesh
                  </span>
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                </div>
                <div className="flex-1 overflow-y-auto flex flex-col gap-1 console-log p-2">
                  {logs.map((log, i) => (
                    <div
                      key={i}
                      className={`text-[10px] border-l-2 pl-2 leading-relaxed ${
                        log.includes("[CẢNH BÁO]")
                          ? "border-red-400 text-red-500"
                          : log.includes("[ACTION]")
                          ? "border-amber-400 text-amber-600"
                          : "border-gray-200 text-gray-500"
                      }`}
                    >
                      {log}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES FOR CUSTOMERS ──────────────────────────────────────── */}
      <section className="w-full py-16 px-4 bg-white border-t border-gray-100" aria-label="Features">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs font-bold text-green-600 uppercase tracking-widest">Tính năng chính</span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              TwinBox AI bảo vệ nông sản của bạn <br className="hidden sm:block" />
              từ container đến tay người tiêu dùng
            </h2>
            <p className="mt-3 text-gray-500 max-w-xl mx-auto text-sm leading-relaxed">
              Không cần kiến thức kỹ thuật — hệ thống tự động làm tất cả. Bạn chỉ cần nhìn dashboard và hành động khi có cảnh báo.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f) => (
              <article
                key={f.title}
                className="card p-5 flex flex-col gap-3"
                aria-label={f.title}
              >
                <div className="flex items-start justify-between">
                  <div
                    className="feature-icon-wrap"
                    style={{ background: f.bg }}
                    aria-hidden="true"
                  >
                    <span>{f.icon}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-extrabold stat-number" style={{ color: f.color }}>{f.stat}</div>
                    <div className="text-[10px] text-gray-400 uppercase tracking-wide">{f.statLabel}</div>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm mb-1">{f.title}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">{f.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING SECTION ────────────────────────────────────────────── */}
      <PricingSection />

      {/* ── SOCIAL PROOF / STATS ────────────────────────────────────────── */}
      <section className="w-full py-12 px-4 bg-green-600" aria-label="Statistics">
        <div className="max-w-[1280px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
          {[
            { v: "< 10%", l: "Mục tiêu hao hụt nông sản" },
            { v: "360h", l: "Dự báo thời hạn tươi tối đa" },
            { v: "3–4 tuần", l: "Tuổi thọ pin một lần sạc" },
            { v: "4G + WiFi", l: "Đa phương thức kết nối" },
          ].map((s) => (
            <div key={s.l}>
              <div className="text-3xl sm:text-4xl font-extrabold stat-number">{s.v}</div>
              <div className="text-green-100 text-xs mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      <footer className="w-full border-t border-gray-100 bg-white py-8 px-4" role="contentinfo">
        <div className="max-w-[1280px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-green-600 flex items-center justify-center text-white text-[10px] font-black">T</div>
            <span className="font-semibold text-gray-600">TwinBox AI</span>
            <span>— Hệ thống giám sát chuỗi lạnh nông sản</span>
          </div>
          <div className="flex gap-6">
            <span>REV 2.5.0</span>
            <span aria-label="System status">
              <span className="inline-block w-1.5 h-1.5 bg-green-500 rounded-full mr-1" aria-hidden="true" />
              All systems operational
            </span>
            <span>© 2026 TwinBox AI Corp</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
