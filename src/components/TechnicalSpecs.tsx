"use client";

import React from "react";

const specs = [
  {
    tag: "PHẦN CỨNG",
    title: "Vỏ chống ngưng tụ Dual-Chamber",
    desc: "Thiết kế ABS/PETG chuyên dụng (10×7×5cm) ngăn ngưng tụ nước trong môi trường lạnh.",
    details: [
      ["Buồng kín (Sealed Core)", "ESP32 + Pin Li-ion (IP67)"],
      ["Buồng hở (Breathable)", "Cảm biến MQ-135 đo Ethylene"],
      ["Màng lọc bảo vệ", "ePTFE chống nước ngưng tụ"],
    ],
    color: "#DC2626",
    bg: "#FEF2F2",
    icon: "🔧",
  },
  {
    tag: "NĂNG LƯỢNG",
    title: "Tối ưu hóa Deep Sleep",
    desc: "Chu kỳ ngủ thông minh giúp pin Li-ion 18650 hoạt động 3–4 tuần liên tục trong container lạnh.",
    details: [
      ["Thời gian ngủ (Deep Sleep)", "15 phút / chu kỳ"],
      ["Làm nóng cảm biến (Warm-up)", "45 giây"],
      ["Truyền tin (ESP-NOW)", "2 giây / lần"],
    ],
    color: "#D97706",
    bg: "#FFFBEB",
    icon: "🔋",
  },
  {
    tag: "KẾT NỐI",
    title: "Mesh ESP-NOW trong Faraday Cage",
    desc: "Giao thức không dây xuyên vách thép container. Dữ liệu gửi Cloud qua 4G LTE, chuẩn MQTT.",
    details: [
      ["Băng tần kết nối", "2.4 GHz (ESP-NOW Mesh)"],
      ["Gateway điều khiển", "4G LTE (A7670C SIM)"],
      ["Giao thức Cloud", "MQTT JSON payloads"],
    ],
    color: "#2563EB",
    bg: "#EFF6FF",
    icon: "📡",
  },
];

export default function TechnicalSpecs() {
  return (
    <div className="card-flat p-5 flex flex-col gap-5">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-gray-100 pb-3">
        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest">
          Thông số kỹ thuật phần cứng
        </h2>
        <span className="text-[10px] font-mono-tech text-gray-400 border border-gray-200 px-2 py-0.5 rounded">
          REV 2.4 · IP67
        </span>
      </div>

      {/* 3 Spec Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {specs.map((s) => (
          <article key={s.title} className="card p-4 flex flex-col gap-3" aria-label={s.title}>
            <div className="flex items-start gap-3">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
                style={{ background: s.bg }}
                aria-hidden="true"
              >
                {s.icon}
              </div>
              <div>
                <div
                  className="text-[10px] font-bold uppercase tracking-widest mb-0.5"
                  style={{ color: s.color }}
                >
                  {s.tag}
                </div>
                <h3 className="text-sm font-bold text-gray-900 leading-tight">{s.title}</h3>
              </div>
            </div>

            <p className="text-xs text-gray-400 leading-relaxed">{s.desc}</p>

            <div className="border-t border-gray-100 pt-2 flex flex-col gap-1.5">
              {s.details.map(([k, v]) => (
                <div key={k} className="flex justify-between text-[11px]">
                  <span className="text-gray-400">{k}</span>
                  <span className="text-gray-700 font-semibold font-mono-tech">{v}</span>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>

      {/* Dynamic FEFO Panel */}
      <div className="card p-4 bg-gray-50 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="text-base" aria-hidden="true">🔄</span>
          <h3 className="text-sm font-bold text-gray-900">
            Giao thức xuất hàng thông minh: Dynamic FEFO
          </h3>
          <span className="text-[10px] bg-green-100 text-green-700 border border-green-200 px-2 py-0.5 rounded-full font-semibold">
            FIRST EXPIRED · FIRST OUT
          </span>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed">
          Bằng cách kết hợp dữ liệu Ethylene và mô hình Arrhenius, TwinBox AI tự động xác định lô hàng nào có nguy cơ hỏng sớm hơn và ưu tiên xuất trước — thay vì theo thứ tự nhập kho truyền thống (FIFO). Phương pháp này giúp giảm thiểu hao hụt chuỗi cung ứng xuống dưới <strong className="text-gray-800">10%</strong>.
        </p>
        <div className="flex flex-wrap gap-2 mt-1">
          {[
            "Định tuyến theo độ tươi thực tế",
            "Liên kết AI & logistics",
            "Tối ưu chuỗi cung ứng lạnh",
          ].map((tag) => (
            <span
              key={tag}
              className="text-[10px] bg-white border border-gray-200 text-gray-500 px-2 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
