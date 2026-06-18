"use client";

import React from "react";

interface ActiveControlsProps {
  triggerC2H4Spike: () => void;
  resetSimulation: () => void;
}

export default function ActiveControls({
  triggerC2H4Spike,
  resetSimulation,
}: ActiveControlsProps) {
  return (
    <div className="card-flat p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest">
          Mô phỏng & Kiểm thử hệ thống
        </h2>
        <span className="text-[10px] font-semibold text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
          Chế độ: Tự động
        </span>
      </div>

      {/* Simulation Panel */}
      <div className="card p-4 bg-gray-50 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <span className="text-base" aria-hidden="true">🧪</span>
          <span className="text-sm font-bold text-gray-800">Giả lập sự cố Ethylene</span>
        </div>
        <p className="text-xs text-gray-400 leading-relaxed">
          Nhấn nút bên dưới để kích hoạt sự cố phóng thích khí C2H4 đột ngột. Hệ thống sẽ tự động phát hiện và kích hoạt quạt thông gió + làm lạnh để đưa về mức an toàn.
        </p>
        <div className="flex flex-col gap-2.5 mt-1">
          <button
            id="btn-c2h4-spike"
            onClick={triggerC2H4Spike}
            className="w-full flex items-center justify-center gap-2 rounded-lg py-2.5 px-4 text-sm font-semibold bg-red-50 text-red-600 border border-red-200 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-200 cursor-pointer"
            aria-label="Kích hoạt giả lập phóng thích khí C2H4"
          >
            <span aria-hidden="true">⚠️</span>
            Giả lập phóng thích khí C2H4
          </button>
          <button
            id="btn-reset"
            onClick={resetSimulation}
            className="btn-secondary w-full text-sm"
            aria-label="Đặt lại hệ thống về trạng thái bình thường"
          >
            ↺ Đặt lại hệ thống
          </button>
        </div>
      </div>

      {/* Info notes */}
      <div className="text-[11px] text-gray-400 leading-relaxed border-t border-gray-100 pt-3 space-y-1">
        <div className="flex gap-1.5">
          <span className="text-green-500 flex-shrink-0" aria-hidden="true">✓</span>
          <span>Quạt và máy lạnh tự kích hoạt khi C2H4 &gt; 25 ppm</span>
        </div>
        <div className="flex gap-1.5">
          <span className="text-green-500 flex-shrink-0" aria-hidden="true">✓</span>
          <span>Tần số telemetry tự chuyển 15 phút → 1 phút khi khẩn cấp</span>
        </div>
        <div className="flex gap-1.5">
          <span className="text-blue-500 flex-shrink-0" aria-hidden="true">ℹ</span>
          <span>Đây là bảng mô phỏng — dữ liệu thực lấy từ cảm biến node IoT</span>
        </div>
      </div>
    </div>
  );
}
