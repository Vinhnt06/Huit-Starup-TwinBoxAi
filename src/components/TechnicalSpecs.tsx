"use client";

import React from "react";

export default function TechnicalSpecs() {
  return (
    <div className="w-full border border-neutral-800 bg-[#0F0F0F] p-4 flex flex-col gap-6 font-mono mt-6">
      {/* Header */}
      <div className="border-b border-neutral-800 pb-2 flex justify-between items-center">
        <span className="text-xs uppercase tracking-widest text-neutral-400 font-bold">
          [ 03 / BẢN VẼ KỸ THUẬT VÀ ĐIỀU HÀNH PHẦN CỨNG ]
        </span>
        <span className="text-xs text-neutral-500 font-tech">REV 2.4 / IP67 MESH SYSTEM</span>
      </div>

      {/* Grid Specs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Chassis section */}
        <div className="border border-neutral-850 p-4 bg-[#0A0A0A] flex flex-col gap-3">
          <div className="text-[#FF2A2A] text-xs font-bold uppercase tracking-wider flex items-center gap-1">
            <span>[#] DUAL-CHAMBER Vỏ chống ngưng tụ</span>
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Thiết kế vỏ nhựa ABS/PETG chuyên dụng chống chịu lạnh tốt, kích thước tiêu chuẩn 10cm x 7cm x 5cm.
          </p>
          <div className="border-t border-neutral-900 pt-2 flex flex-col gap-1.5 text-[10px] text-neutral-500">
            <div className="flex justify-between">
              <span>Buồng kín (Sealed Core):</span>
              <span className="text-neutral-300">ESP32 + Pin (IP67)</span>
            </div>
            <div className="flex justify-between">
              <span>Buồng hở (Breathable):</span>
              <span className="text-neutral-300">Cảm biến MQ-135</span>
            </div>
            <div className="flex justify-between">
              <span>Màng lọc bảo vệ:</span>
              <span className="text-neutral-300">ePTFE chống nước ngưng tụ</span>
            </div>
          </div>
        </div>

        {/* Battery Power section */}
        <div className="border border-neutral-850 p-4 bg-[#0A0A0A] flex flex-col gap-3">
          <div className="text-[#FF2A2A] text-xs font-bold uppercase tracking-wider flex items-center gap-1">
            <span>[#] Tối ưu hóa năng lượng Deep Sleep</span>
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Sử dụng chu kỳ Deep Sleep tối ưu để kéo dài tuổi thọ của pin Li-ion 18650 tiêu chuẩn lên đến 3-4 tuần trong container lạnh.
          </p>
          <div className="border-t border-neutral-900 pt-2 flex flex-col gap-1.5 text-[10px] text-neutral-500">
            <div className="flex justify-between">
              <span>Thời gian ngủ (Deep Sleep):</span>
              <span className="text-neutral-300">15 phút</span>
            </div>
            <div className="flex justify-between">
              <span>Làm nóng cảm biến (Warm-up):</span>
              <span className="text-neutral-300">45 giây</span>
            </div>
            <div className="flex justify-between">
              <span>Truyền tin (ESP-NOW):</span>
              <span className="text-neutral-300">2 giây</span>
            </div>
          </div>
        </div>

        {/* Communication mesh section */}
        <div className="border border-neutral-850 p-4 bg-[#0A0A0A] flex flex-col gap-3">
          <div className="text-[#FF2A2A] text-xs font-bold uppercase tracking-wider flex items-center gap-1">
            <span>[#] Mạng lưới ESP-NOW trong Faraday Cage</span>
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Tận dụng giao thức không dây ESP-NOW tốc độ cao để giao tiếp đa hướng xuyên qua các điểm mù trong thùng container thép (lồng Faraday).
          </p>
          <div className="border-t border-neutral-900 pt-2 flex flex-col gap-1.5 text-[10px] text-neutral-500">
            <div className="flex justify-between">
              <span>Băng tần kết nối:</span>
              <span className="text-neutral-300">2.4 GHz (ESP-NOW)</span>
            </div>
            <div className="flex justify-between">
              <span>Gateway điều khiển đầu container:</span>
              <span className="text-neutral-300">4G LTE (A7670C)</span>
            </div>
            <div className="flex justify-between">
              <span>Giao thức Cloud Broker:</span>
              <span className="text-neutral-300">MQTT JSON payloads</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic FEFO details */}
      <div className="border border-neutral-850 bg-[#0A0A0A] p-4 flex flex-col gap-3">
        <div className="text-white text-xs font-bold uppercase tracking-wider">
          &gt;&gt; GIAO THỨC ĐỊNH TUYẾN LOGISTICS: DYNAMIC FEFO (FIRST EXPIRED, FIRST OUT)
        </div>
        <p className="text-xs text-neutral-400 leading-relaxed">
          Bằng cách giám sát liên tục chỉ số Ethylene và kết hợp mô hình động học Arrhenius, hệ thống TwinBox AI tự động phân loại và định tuyến phân phối lô hàng nông sản nào có nguy cơ hỏng sớm hơn sẽ được dỡ xuống và tiêu thụ trước (FEFO), thay vì xuất kho theo lô nhập trước xuất trước truyền thống (FIFO). Phương pháp này giúp giảm thiểu hao hụt chuỗi cung ứng nông sản lạnh xuống dưới 10% theo kế hoạch kinh doanh.
        </p>
        <div className="flex flex-wrap gap-4 text-[10px] text-neutral-500 uppercase mt-1">
          <span>[ ĐỊNH HƯỚNG ĐỘ TINH CẤU TRÚC LỚN ]</span>
          <span>[ LIÊN KẾT AI VÀ HỆ THỐNG LOGISTICS THỰC TẾ ]</span>
          <span>[ HIỆU QUẢ CHUỖI CUNG ỨNG CỐ ĐỊNH ]</span>
        </div>
      </div>
    </div>
  );
}
