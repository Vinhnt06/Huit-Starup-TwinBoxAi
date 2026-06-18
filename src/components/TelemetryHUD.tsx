"use client";

import React from "react";
import { TelemetryState } from "@/hooks/useTelemetrySim";

interface TelemetryHUDProps {
  state: TelemetryState;
}

interface MetricCardProps {
  label: string;
  unit: string;
  value: number | string;
  trend?: string;
  statusText: string;
  isOk: boolean;
  isWarn?: boolean;
}

function MetricCard({ label, unit, value, trend, statusText, isOk, isWarn }: MetricCardProps) {
  const badgeClass = isOk
    ? "badge-normal"
    : isWarn
    ? "badge-warning"
    : "badge-critical";

  return (
    <div className={`metric-card ${isOk ? "" : isWarn ? "warning" : "critical"}`}>
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide leading-tight">{label}</span>
        <span className="text-[10px] text-gray-400 font-mono-tech">{unit}</span>
      </div>
      <div className="flex items-baseline gap-1.5 my-2">
        <span className="text-2xl font-extrabold stat-number text-gray-900">{value}</span>
        <span className="text-xs text-gray-400">{unit}</span>
      </div>
      <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
        {trend && (
          <span className="text-[10px] text-gray-400">
            Xu hướng: {trend === "UP" ? "↑ Tăng" : trend === "DOWN" ? "↓ Giảm" : "→ Ổn định"}
          </span>
        )}
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${badgeClass} ml-auto`}>
          {statusText}
        </span>
      </div>
    </div>
  );
}

export default function TelemetryHUD({ state }: TelemetryHUDProps) {
  const isCritical = state.nodeStatus === "CRITICAL";
  const isWarning  = state.nodeStatus === "WARNING";

  // DSL progress bar
  const maxShelfLife = 360;
  const dslPercent = Math.min(100, Math.max(0, (state.dslHours / maxShelfLife) * 100));
  const dslColor = dslPercent > 40 ? "#16A34A" : dslPercent > 15 ? "#D97706" : "#DC2626";

  return (
    <div className="card-flat p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest">
            Cảm biến thời gian thực — Node-01
          </h2>
        </div>
        <div className="flex flex-wrap gap-3 text-xs text-gray-500">
          <span>
            Chu kỳ: <strong className="text-gray-800 font-mono-tech">{state.telemetryInterval}</strong>
          </span>
          <span>
            Pin: <strong className="text-green-600 font-mono-tech">{state.batteryVoltage} V</strong>
          </span>
          <span
            className={`font-bold ${
              isCritical ? "text-red-500" : isWarning ? "text-amber-500" : "text-green-600"
            }`}
          >
            {isCritical ? "⚠ NGUY HIỂM" : isWarning ? "⚡ CẢNH BÁO" : "✓ BÌNH THƯỜNG"}
          </span>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard
          label="Khí Ethylene (C2H4)"
          unit="ppm"
          value={state.c2h4}
          trend={state.c2h4Trend}
          statusText={state.c2h4 > 25 ? "Nguy hiểm" : "An toàn"}
          isOk={state.c2h4 <= 25}
          isWarn={false}
        />
        <MetricCard
          label="Nhiệt độ môi trường"
          unit="°C"
          value={state.temperatureAmbient}
          trend={state.tempTrend}
          statusText={state.temperatureAmbient > 6 ? "Nhiệt cao" : "Tối ưu"}
          isOk={state.temperatureAmbient <= 6}
          isWarn={state.temperatureAmbient > 6}
        />
        <MetricCard
          label="Nhiệt độ lõi sản phẩm"
          unit="°C"
          value={state.temperatureCore}
          statusText={`Sai số ±0.1°C`}
          isOk
        />
        <MetricCard
          label="Độ ẩm tương đối"
          unit="% RH"
          value={state.humidity}
          statusText="Ổn định"
          isOk
        />
      </div>

      {/* Dynamic Shelf Life Bar */}
      <div className="card-flat p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">
              🤖 Dự đoán thời hạn tươi (Dynamic Shelf Life — DSL)
            </span>
          </div>
          <p className="text-[11px] text-gray-400 leading-relaxed max-w-lg">
            AI kết hợp mô hình Arrhenius và đo nhiệt lõi theo thời gian thực để tính chính xác số giờ nông sản còn tươi ngon. Khi DSL về 0, hàng cần được tiêu thụ hoặc loại bỏ ngay.
          </p>
        </div>

        <div className="flex flex-col gap-2 min-w-[200px]">
          <div className="flex justify-between items-baseline">
            <span className="text-xs text-gray-500">HSD còn lại:</span>
            {state.dslHours <= 0 ? (
              <span className="text-sm font-extrabold text-red-500 animate-pulse">ĐÃ HẾT HẠN</span>
            ) : (
              <span className="text-xl font-extrabold stat-number" style={{ color: dslColor }}>
                {state.dslHours} <span className="text-xs font-normal text-gray-400">giờ</span>
              </span>
            )}
          </div>

          {/* Progress bar */}
          <div className="dsl-bar-track">
            <div
              className="dsl-bar-fill"
              style={{
                width: `${dslPercent}%`,
                background: `linear-gradient(90deg, ${dslColor}, ${dslColor}cc)`,
              }}
              role="progressbar"
              aria-valuenow={state.dslHours}
              aria-valuemin={0}
              aria-valuemax={maxShelfLife}
              aria-label={`Thời hạn tươi còn ${state.dslHours} giờ`}
            />
          </div>

          <div className="flex justify-between text-[10px] text-gray-400">
            <span>0 giờ</span>
            <span>{Math.round(dslPercent)}%</span>
            <span>360 giờ</span>
          </div>
        </div>
      </div>
    </div>
  );
}
