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
    <div className="w-full border border-neutral-800 bg-[#0F0F0F] p-4 flex flex-col gap-4 font-mono">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
        <span className="text-xs uppercase tracking-widest text-neutral-400 font-bold">
          [ 01 / GIẢ LẬP SỰ CỐ & THỬ NGHIỆM HỆ THỐNG ]
        </span>
        <span className="text-xs text-[#4AF626] font-tech font-bold">CHẾ ĐỘ: TỰ ĐỘNG (AUTO)</span>
      </div>

      <div className="border border-neutral-800 p-4 bg-[#0A0A0A] flex flex-col gap-3">
        <span className="text-xs text-neutral-400 uppercase tracking-wider font-bold">
          Giả lập sự cố nông sản chín
        </span>
        <p className="text-[10px] text-neutral-500 leading-relaxed">
          Nhấn nút bên dưới để kích hoạt sự cố giải phóng khí Ethylene (C2H4) đột ngột từ nông sản chín. Hệ thống giám sát chủ động (Active Actuation) sẽ phát hiện và tự động kích hoạt quạt thông gió cùng hệ thống làm lạnh để hạ nhiệt độ và nồng độ khí độc hại về mức an toàn.
        </p>
        <div className="grid grid-cols-1 gap-3 mt-1">
          <button
            onClick={triggerC2H4Spike}
            className="group relative overflow-hidden border border-[#FF2A2A] px-4 py-3 hover:bg-[#FF2A2A]/10 text-xs font-bold text-[#FF2A2A] transition-all cursor-pointer"
          >
            <span className="relative z-10">[ GIẢ LẬP PHÓNG THÍCH KHÍ C2H4 ]</span>
          </button>
          <button
            onClick={resetSimulation}
            className="border border-neutral-700 px-4 py-3 hover:bg-neutral-800 text-xs font-bold text-neutral-300 transition-all cursor-pointer"
          >
            RESET HỆ THỐNG GIAO DIỆN
          </button>
        </div>
      </div>
    </div>
  );
}
