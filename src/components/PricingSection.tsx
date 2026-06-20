"use client";

import React, { useState } from "react";

interface PricingPackage {
  id: string;
  name: string;
  devices: number;
  priceRaw: number;
  priceFormatted: string;
  color: string;
  badge?: string;
  tagline: string;
  features: string[];
  unitCost: string;
}

const PACKAGES: PricingPackage[] = [
  {
    id: "startup",
    name: "Gói Khởi Nghiệp",
    devices: 5,
    priceRaw: 500000,
    priceFormatted: "500.000 đ",
    color: "#2563EB", // Blue
    tagline: "Phù hợp cho các hợp tác xã hoặc hộ kinh doanh vận tải lạnh quy mô nhỏ.",
    unitCost: "100.000 đ / bộ / tháng",
    features: [
      "Giám sát tối đa 5 container lạnh",
      "Tần suất gửi telemetry: 15 phút / lần",
      "Lưu trữ lịch sử dữ liệu: 30 ngày",
      "Cảnh báo SMS & Zalo: Tối đa 100 tin/tháng",
      "Hỗ trợ kỹ thuật qua Email (phản hồi trong 24h)",
      "Dashboard giám sát cơ bản",
    ],
  },
  {
    id: "standard",
    name: "Gói Tiêu Chuẩn",
    devices: 10,
    priceRaw: 990000,
    priceFormatted: "990.000 đ",
    color: "#16A34A", // Green
    badge: "Phổ Biến",
    tagline: "Dành cho các doanh nghiệp xuất nhập khẩu nông sản trung bình.",
    unitCost: "99.000 đ / bộ / tháng",
    features: [
      "Giám sát tối đa 10 container lạnh",
      "Tần suất gửi telemetry: 10 phút / lần",
      "Lưu trữ lịch sử dữ liệu: 90 ngày",
      "Cảnh báo SMS & Zalo: Tối đa 300 tin/tháng",
      "Hỗ trợ kỹ thuật qua Hotline (giờ hành chính)",
      "Tính toán chỉ số tươi ngon AI (DSL cơ bản)",
      "Điều khiển thiết bị quạt cơ bản",
    ],
  },
  {
    id: "professional",
    name: "Gói Chuyên Nghiệp",
    devices: 20,
    priceRaw: 1989000,
    priceFormatted: "1.989.000 đ",
    color: "#D97706", // Amber
    badge: "Khuyên Dùng",
    tagline: "Tối ưu nhất cho các chuỗi lạnh logistics lớn và kho bãi lạnh.",
    unitCost: "99.450 đ / bộ / tháng",
    features: [
      "Giám sát tối đa 20 container lạnh",
      "Tần suất gửi telemetry: 5 phút / lần",
      "Lưu trữ lịch sử dữ liệu: 180 ngày",
      "Cảnh báo không giới hạn SMS, Zalo & Telegram",
      "Hỗ trợ kỹ thuật 24/7 trực tiếp chuyên biệt",
      "AI dự đoán thời hạn tươi nâng cao (Arrhenius Model)",
      "Tự động ngắt quạt, điều khiển máy lạnh thông qua Relay",
      "Báo cáo phân tích chất lượng chuyến hàng tự động",
    ],
  },
  {
    id: "enterprise",
    name: "Gói Doanh Nghiệp",
    devices: 50,
    priceRaw: 4900000,
    priceFormatted: "4.900.000 đ",
    color: "#DC2626", // Red
    badge: "Toàn Diện",
    tagline: "Giải pháp toàn diện tích hợp sâu vào hệ thống ERP của tổng công ty.",
    unitCost: "98.000 đ / bộ / tháng",
    features: [
      "Giám sát tối đa 50 container lạnh (Hỗ trợ mở rộng)",
      "Tần suất gửi telemetry: 1 phút / lần",
      "Lưu trữ lịch sử dữ liệu trọn đời trên Cloud",
      "Hỗ trợ kỹ thuật 24/7 VIP, xử lý sự cố tại chỗ trong 2h",
      "Tích hợp API kết nối hệ thống ERP riêng của doanh nghiệp",
      "Bàn giao trọn gói mã nguồn Node ESP32 & File thiết kế PCB",
      "Kỹ sư TwinBox AI đến setup và đào tạo trực tiếp tận nơi",
      "Ưu tiên nâng cấp thiết bị Gateway thế hệ mới miễn phí",
    ],
  },
];

export default function PricingSection() {
  const [selectedId, setSelectedId] = useState<string>("professional");
  const [customerName, setCustomerName] = useState<string>("");
  const [customerPhone, setCustomerPhone] = useState<string>("");
  const [customerEmail, setCustomerEmail] = useState<string>("");
  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isActivated, setIsActivated] = useState<boolean>(false);
  const [isActivating, setIsActivating] = useState<boolean>(false);
  const [activationDate, setActivationDate] = useState<string>("");
  const [licenseKey, setLicenseKey] = useState<string>("");
  const [logs, setLogs] = useState<string[]>(() => {
    const t = new Date().toLocaleTimeString("vi-VN", { hour12: false });
    return [`[${t}] KHỞI TẠO HỆ THỐNG: Sẵn sàng.`];
  });
  const [copiedText, setCopiedText] = useState<boolean>(false);

  const selectedPkg = PACKAGES.find((p) => p.id === selectedId) || PACKAGES[2];

  // Add system console logs
  const addLog = (message: string) => {
    const t = new Date().toLocaleTimeString("vi-VN", { hour12: false });
    setLogs((prev) => [`[${t}] ${message}`, ...prev].slice(0, 10));
  };

  const handleActivate = () => {
    setIsActivating(true);
    addLog("KÍCH HOẠT: Đang kiểm tra giao dịch và xác thực bản quyền...");
    setTimeout(() => {
      setIsActivating(false);
      setIsActivated(true);
      const dateStr = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString("vi-VN");
      const keyStr = `TBX-${selectedPkg.id.toUpperCase()}-${(customerPhone || "8888").slice(-4)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      setActivationDate(dateStr);
      setLicenseKey(keyStr);
      addLog(`HỆ THỐNG: Nhận tín hiệu thanh toán thành công.`);
      addLog(`KÍCH HOẠT: Gói ${selectedPkg.name} (${selectedPkg.devices} bộ) đã hoạt động.`);
      addLog(`THIẾT BỊ: Đã kết nối Gateway & liên kết ${selectedPkg.devices}/${selectedPkg.devices} Nodes IoT.`);
    }, 1500);
  };


  const handleNextStep = () => {
    if (step === 1) {
      addLog("TIẾN TRÌNH: Chuyển sang bước đăng ký thông tin.");
      setStep(2);
    } else if (step === 2) {
      if (!customerName || !customerPhone) {
        addLog("LỖI: Tên và Số điện thoại không được để trống.");
        alert("Vui lòng điền đầy đủ Tên và Số điện thoại liên hệ!");
        return;
      }
      setIsSubmitting(true);
      addLog(`KHỞI TẠO: Đang gửi yêu cầu kích hoạt cho thuê bao: ${customerPhone}`);
      setTimeout(() => {
        setIsSubmitting(false);
        setStep(3);
        addLog(`THÀNH CÔNG: Đã tạo mã QR thanh toán hóa đơn.`)
      }, 1000);
    }
  };

  const handleBackStep = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
      addLog(`TIẾN TRÌNH: Quay lại Bước ${step - 1}`);
    }
  };

  const resetForm = () => {
    setStep(1);
    setCustomerName("");
    setCustomerPhone("");
    setCustomerEmail("");
    setIsActivated(false);
    setActivationDate("");
    setLicenseKey("");
    addLog("ĐẶT LẠI: Biểu mẫu đăng ký đã được làm mới.");
  };

  const handleCopyMemo = () => {
    const memo = `TWINBOX ${selectedPkg.devices}BO ${customerPhone || "09xxxx"}`;
    navigator.clipboard.writeText(memo);
    setCopiedText(true);
    addLog("COPY: Nội dung chuyển khoản đã được lưu vào bộ nhớ tạm.");
    setTimeout(() => setCopiedText(false), 2000);
  };

  const memoText = `TWINBOX ${selectedPkg.devices}BO ${customerPhone.replace(/\s+/g, "") || "09XXXXXXXX"}`;

  return (
    <section className="w-full py-16 px-4 bg-[#F0F2F5] border-t border-b border-gray-200" id="pricing-section" aria-label="Bảng giá phần mềm">
      <div className="max-w-[1280px] mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-green-600 uppercase tracking-widest bg-green-50 border border-green-200 px-3 py-1 rounded-full">
            Biểu phí dịch vụ
          </span>
          <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Chi phí tối ưu — Quản lý chuỗi lạnh hiệu quả
          </h2>
          <p className="mt-2 text-gray-500 max-w-xl mx-auto text-sm leading-relaxed">
            Chọn gói cước theo số lượng bộ thiết bị IoT lắp đặt trong container. Trải nghiệm hệ thống AI chẩn đoán thông minh ngay hôm nay.
          </p>
        </div>

        {/* Asymmetric Layout Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Asymmetric Staircase Selector (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 bg-green-600 rounded-full animate-ping" />
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                Bước 1: Chọn quy mô thiết bị của bạn
              </h3>
            </div>

            {/* Staircase/Stacked selector lists */}
            <div className="flex flex-col gap-3.5 relative">
              {PACKAGES.map((pkg, idx) => {
                const isSelected = selectedId === pkg.id;
                
                return (
                  <div
                    key={pkg.id}
                    onClick={() => {
                      if (step === 3) setStep(1); // reset to step 1 if package changes
                      setSelectedId(pkg.id);
                      addLog(`ĐÃ CHỌN: ${pkg.name} (${pkg.devices} bộ - ${pkg.priceFormatted}/tháng)`);
                    }}
                    style={{
                      transform: isSelected ? "translateX(8px)" : "translateX(0px)",
                      // Create subtle staircase shift on desktop
                      marginLeft: !isSelected ? `${idx * 6}px` : "12px"
                    }}
                    className={`relative cursor-pointer transition-all duration-300 rounded border p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white ${
                      isSelected
                        ? "border-green-600 shadow-md ring-1 ring-green-600/30"
                        : "border-gray-200 shadow-sm hover:border-gray-300 hover:-translate-y-0.5"
                    }`}
                  >
                    {/* Selected Left Highlight line */}
                    {isSelected && (
                      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-green-600 rounded-l" />
                    )}

                    {/* Left content: basic details */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: pkg.color }}
                        />
                        <h4 className="font-extrabold text-gray-900 text-base">{pkg.name}</h4>
                        {pkg.badge && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-green-100 text-green-700 uppercase tracking-wider">
                            {pkg.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-1.5 leading-relaxed max-w-md">
                        {pkg.tagline}
                      </p>
                      
                      {/* Features preview (horizontal micro list) */}
                      <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-gray-500">
                        <span className="font-semibold text-gray-700">✓ Hỗ trợ: {pkg.devices} thiết bị</span>
                        <span className="text-gray-300">•</span>
                        <span>Lưu trữ {pkg.features[2].replace("Lưu trữ lịch sử dữ liệu: ", "")}</span>
                      </div>
                    </div>

                    {/* Right content: Pricing details */}
                    <div className="sm:text-right border-t sm:border-t-0 border-gray-100 pt-3 sm:pt-0 w-full sm:w-auto flex sm:flex-col justify-between sm:justify-center items-center sm:items-end">
                      <div>
                        <div className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight stat-number">
                          {pkg.priceFormatted}
                        </div>
                        <div className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mt-0.5">
                          / Tháng
                        </div>
                      </div>
                      
                      <div className="mt-1 sm:mt-1.5 text-[10px] font-mono-tech border border-gray-100 bg-gray-50 text-gray-500 px-2 py-1 rounded">
                        {pkg.unitCost}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Console/Interactive activation dock (5 cols) */}
          <div className="lg:col-span-5">
            <div className="flex items-center justify-between gap-2 mb-2">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                Bộ phận kích hoạt dịch vụ
              </h3>
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            </div>

            <div className="card-flat bg-[#0F1117] text-gray-300 border border-gray-800 p-5 rounded-xl shadow-lg flex flex-col gap-5 min-h-[580px] relative overflow-hidden">
              {/* Scanline animation for digital terminal */}
              <div 
                className="absolute inset-x-0 h-[1.5px] bg-green-500/25 pointer-events-none" 
                style={{
                  top: 0,
                  animation: "scan 4s linear infinite",
                  boxShadow: "0 0 10px rgba(34, 197, 94, 0.5)"
                }}
              />
              
              <style>{`
                @keyframes scan {
                  0% { top: 0%; }
                  50% { top: 100%; }
                  100% { top: 0%; }
                }
              `}</style>

              {/* Console Header */}
              <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-600" />
                  <span className="text-[11px] font-mono-tech tracking-wider text-green-400 uppercase">
                    ACTIVE_SYSTEM_v2.5
                  </span>
                </div>
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-gray-700" />
                  <span className="w-2 h-2 rounded-full bg-gray-700" />
                  <span className="w-2 h-2 rounded-full bg-gray-700" />
                </div>
              </div>

              {/* Progress Steps Visualizer */}
              <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] font-bold uppercase tracking-wider">
                <div className={`py-1.5 border-b-2 transition-all ${step >= 1 ? "border-green-500 text-green-400" : "border-gray-800 text-gray-600"}`}>
                  1. Chọn Gói
                </div>
                <div className={`py-1.5 border-b-2 transition-all ${step >= 2 ? "border-green-500 text-green-400" : "border-gray-800 text-gray-600"}`}>
                  2. Đăng Ký
                </div>
                <div className={`py-1.5 border-b-2 transition-all ${step >= 3 ? "border-green-500 text-green-400" : "border-gray-800 text-gray-600"}`}>
                  3. Kích Hoạt
                </div>
              </div>

              {/* Content Panel based on Step */}
              <div className="flex-1 flex flex-col justify-between py-1">
                
                {/* STEP 1: Plan Summary & Benefits */}
                {step === 1 && (
                  <div className="flex flex-col gap-4 animate-fade-in">
                    <div>
                      <div className="text-[10px] text-green-400 font-mono-tech uppercase">GÓI ĐANG CHỌN</div>
                      <h4 className="text-lg font-extrabold text-white mt-0.5">{selectedPkg.name}</h4>
                      <p className="text-xs text-gray-400 leading-relaxed mt-1">{selectedPkg.tagline}</p>
                    </div>

                    <div className="border border-gray-800 bg-[#151922] p-3 rounded-lg flex justify-between items-center">
                      <div>
                        <span className="text-[10px] text-gray-400 block uppercase">Tổng phí thuê bao</span>
                        <span className="text-lg font-black text-white stat-number">{selectedPkg.priceFormatted}</span>
                        <span className="text-[10px] text-gray-400">/tháng</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-gray-400 block uppercase">Quy mô</span>
                        <span className="text-sm font-bold text-green-400">{selectedPkg.devices} Bộ thiết bị</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">TÍNH NĂNG CHI TIẾT</div>
                      <div className="max-h-[160px] overflow-y-auto flex flex-col gap-2 pr-1">
                        {selectedPkg.features.map((f, i) => (
                          <div key={i} className="flex gap-2 text-xs text-gray-300">
                            <span className="text-green-500 flex-shrink-0">✓</span>
                            <span>{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: Customer Contact Form */}
                {step === 2 && (
                  <div className="flex flex-col gap-4 animate-fade-in">
                    <div>
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider">Thông tin kích hoạt hệ thống</h4>
                      <p className="text-xs text-gray-400 leading-relaxed mt-0.5">
                        Vui lòng cung cấp thông tin liên hệ để thiết lập tài khoản Cloud và phân quyền Gateway.
                      </p>
                    </div>

                    <div className="flex flex-col gap-3">
                      <div>
                        <label htmlFor="input-name" className="block text-[10px] uppercase font-bold text-gray-400 mb-1">
                          Tên doanh nghiệp / Họ và tên *
                        </label>
                        <input
                          id="input-name"
                          type="text"
                          required
                          value={customerName}
                          onChange={(e) => {
                            setCustomerName(e.target.value);
                            if (e.target.value.length === 1) addLog("BIỂU MẪU: Đang điền Tên doanh nghiệp.");
                          }}
                          placeholder="Ví dụ: Logistics Sông Hồng"
                          className="w-full bg-[#151922] border border-gray-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-green-600 placeholder-gray-600 transition-colors"
                        />
                      </div>

                      <div>
                        <label htmlFor="input-phone" className="block text-[10px] uppercase font-bold text-gray-400 mb-1">
                          Số điện thoại liên hệ *
                        </label>
                        <input
                          id="input-phone"
                          type="tel"
                          required
                          value={customerPhone}
                          onChange={(e) => {
                            setCustomerPhone(e.target.value);
                            if (e.target.value.length === 1) addLog("BIỂU MẪU: Đang điền Số điện thoại.");
                          }}
                          placeholder="Ví dụ: 0987654321"
                          className="w-full bg-[#151922] border border-gray-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-green-600 placeholder-gray-600 transition-colors"
                        />
                      </div>

                      <div>
                        <label htmlFor="input-email" className="block text-[10px] uppercase font-bold text-gray-400 mb-1">
                          Email nhận báo cáo (Tùy chọn)
                        </label>
                        <input
                          id="input-email"
                          type="email"
                          value={customerEmail}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                          placeholder="Ví dụ: contact@songhong.vn"
                          className="w-full bg-[#151922] border border-gray-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-green-600 placeholder-gray-600 transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                )}

                 {/* STEP 3: QR Payment Simulation or Successful Activation */}
                {step === 3 && (
                  isActivated ? (
                    <div className="flex flex-col gap-4 animate-fade-in text-center py-4 select-none">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-950 text-green-400 border border-green-500 text-xl font-bold animate-pulse mx-auto">
                        ⚡
                      </div>
                      <div>
                        <h4 className="text-base font-extrabold text-green-400 uppercase tracking-widest mt-2">HỆ THỐNG ĐÃ KÍCH HOẠT</h4>
                        <p className="text-[11px] text-gray-400 mt-1 leading-relaxed max-w-[280px] mx-auto">
                          Bản quyền dịch vụ TwinBox AI đã được ghi nhận trên Cloud. Trạng thái hoạt động chính thức.
                        </p>
                      </div>

                      {/* License Info Box */}
                      <div className="border border-green-900/50 bg-[#111c15] p-3.5 rounded-lg text-left text-[11px] space-y-2 mt-1">
                        <div className="flex justify-between border-b border-green-950 pb-1.5">
                          <span className="text-gray-400">Gói cước:</span>
                          <span className="font-extrabold text-white">{selectedPkg.name}</span>
                        </div>
                        <div className="flex justify-between border-b border-green-950 pb-1.5">
                          <span className="text-gray-400">Thiết bị:</span>
                          <span className="font-bold text-green-400 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-ping inline-block"></span>
                            {selectedPkg.devices} Bộ IoT (Online)
                          </span>
                        </div>
                        <div className="flex justify-between border-b border-green-950 pb-1.5">
                          <span className="text-gray-400">Thời hạn dùng:</span>
                          <span className="font-bold text-white">30 ngày (Đến {activationDate})</span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-gray-400">Khóa bản quyền (License Key):</span>
                          <code className="bg-black/40 text-green-400 border border-green-950 px-2 py-1 rounded text-[10px] font-mono-tech select-all tracking-wider text-center block">
                            {licenseKey}
                          </code>
                        </div>
                      </div>

                      <div className="text-[9px] text-gray-500 font-mono-tech italic">
                        * Chi tiết hướng dẫn lắp đặt Gateway đã gửi tới SĐT: {customerPhone}.
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4 animate-fade-in overflow-y-auto max-h-[360px] pr-1">
                      <div className="text-center">
                        <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-950 text-green-400 border border-green-800 text-sm font-bold animate-bounce">
                          ✓
                        </div>
                        <h4 className="text-sm font-extrabold text-white uppercase tracking-wider mt-2">Đăng Ký Thành Công!</h4>
                        <p className="text-[11px] text-gray-400 leading-relaxed max-w-xs mx-auto mt-0.5">
                          Tài khoản cloud đã được khởi tạo ở trạng thái Chờ kích hoạt. Hãy quét mã dưới đây để kích hoạt tức thì.
                        </p>
                      </div>

                      {/* MOCK VIETQR CARD */}
                      <div className="border border-gray-800 bg-white text-gray-900 rounded-lg overflow-hidden shadow-md">
                        {/* Card Header banner */}
                        <div className="bg-gradient-to-r from-emerald-700 to-green-600 text-white px-3.5 py-2 flex justify-between items-center">
                          <span className="text-[10px] font-black tracking-widest font-mono-tech">VIETQR QUICKPAY</span>
                          <span className="text-[9px] bg-white/20 px-1.5 py-0.5 rounded font-bold uppercase">
                            Kích hoạt ngay
                          </span>
                        </div>

                        {/* Card Body */}
                        <div className="p-3.5 flex flex-col md:flex-row gap-3.5 items-center justify-between">
                          
                          {/* Info details table */}
                          <div className="flex-1 w-full text-[11px] space-y-1.5">
                            <div className="flex justify-between border-b border-gray-100 pb-1">
                              <span className="text-gray-400">Ngân hàng:</span>
                              <span className="font-bold text-gray-800">MBBank (Quân Đội)</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-100 pb-1">
                              <span className="text-gray-400">Số tài khoản:</span>
                              <span className="font-bold text-gray-800 font-mono-tech">123456789999</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-100 pb-1">
                              <span className="text-gray-400">Chủ tài khoản:</span>
                              <span className="font-bold text-gray-800">CONG TY TWINBOX AI</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-100 pb-1">
                              <span className="text-gray-400">Số tiền:</span>
                              <span className="font-black text-green-700 stat-number">{selectedPkg.priceFormatted}</span>
                            </div>
                            <div className="flex flex-col border-b border-gray-100 pb-1 gap-0.5">
                              <span className="text-gray-400">Nội dung chuyển khoản:</span>
                              <div className="flex items-center justify-between mt-0.5 bg-gray-50 px-2 py-1 rounded border border-gray-200">
                                <span className="font-mono-tech font-bold text-red-600 select-all">
                                  {memoText}
                                </span>
                                <button
                                  onClick={handleCopyMemo}
                                  className="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                                  aria-label="Copy nội dung chuyển khoản"
                                >
                                  {copiedText ? "Đã copy" : "Copy"}
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Interactive QR SVG Mockup */}
                          <div className="w-[100px] h-[100px] bg-white border border-gray-200 rounded p-1 flex-shrink-0 flex items-center justify-center relative overflow-hidden group">
                            {/* Mock QR SVG */}
                            <svg width="86" height="86" viewBox="0 0 100 100" className="opacity-90">
                              {/* Outer boundary blocks */}
                              <path d="M0,0 h30 v10 h-20 v20 h-10 z" fill="#000" />
                              <path d="M70,0 h30 v30 h-10 v-20 h-20 z" fill="#000" />
                              <path d="M0,70 v30 h30 v-10 h-20 v-20 z" fill="#000" />
                              
                              {/* Inner locator squares */}
                              <rect x="5" y="5" width="10" height="10" fill="#000" />
                              <rect x="75" y="5" width="10" height="10" fill="#000" />
                              <rect x="5" y="75" width="10" height="10" fill="#000" />

                              {/* Small dots grid to simulate QR data */}
                              <path d="M 40,10 h 5 v 5 h -5 z M 50,5 h 5 v 5 h -5 z M 50,15 h 5 v 5 h -5 z M 60,10 h 5 v 5 h -5 z M 40,25 h 5 v 5 h -5 z M 45,35 h 5 v 5 h -5 z M 30,40 h 5 v 5 h -5 z" fill="#16A34A" />
                              <path d="M 75,40 h 5 v 5 h -5 z M 85,35 h 5 v 5 h -5 z M 80,45 h 5 v 5 h -5 z M 70,50 h 5 v 5 h -5 z M 90,50 h 5 v 5 h -5 z" fill="#000" />
                              <path d="M 10,40 h 5 v 5 h -5 z M 20,45 h 5 v 5 h -5 z M 15,55 h 5 v 5 h -5 z M 5,60 h 5 v 5 h -5 z M 25,60 h 5 v 5 h -5 z" fill="#000" />
                              <path d="M 40,75 h 5 v 5 h -5 z M 55,75 h 5 v 5 h -5 z M 45,85 h 5 v 5 h -5 z M 60,85 h 5 v 5 h -5 z M 50,90 h 5 v 5 h -5 z" fill="#16A34A" />
                              
                              {/* Center Logo placeholder */}
                              <rect x="42" y="42" width="16" height="16" rx="2" fill="#16A34A" />
                              <text x="50" y="53" fontSize="8" fontWeight="black" fill="#fff" textAnchor="middle">TB</text>
                              
                              {/* Random additional noise blocks */}
                              <rect x="35" y="55" width="8" height="8" fill="#3b82f6" />
                              <rect x="58" y="30" width="6" height="10" fill="#2563eb" />
                              <rect x="30" y="30" width="8" height="5" fill="#000" />
                            </svg>

                            {/* Dynamic scanning bar effect */}
                            <div className="absolute inset-x-0 h-1 bg-green-500 shadow-[0_0_8px_rgba(22,163,74,0.8)] animate-pulse" 
                                 style={{
                                   top: 0,
                                   animation: "qr-scan 2s linear infinite",
                                 }}
                            />
                          </div>
                        </div>
                      </div>

                      <style>{`
                        @keyframes qr-scan {
                          0% { top: 5%; }
                          50% { top: 90%; }
                          100% { top: 5%; }
                        }
                      `}</style>
                    </div>
                  )
                )}

                {/* Interactive Action Buttons */}
                <div className="mt-4 pt-4 border-t border-gray-800 flex flex-col gap-2.5">
                  
                  {/* Button logic */}
                  {step < 3 ? (
                    <button
                      onClick={handleNextStep}
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-2 rounded py-3 px-4 text-sm font-semibold bg-green-600 text-white hover:bg-green-500 hover:shadow-md cursor-pointer transition-all disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Đang xử lý yêu cầu...
                        </>
                      ) : (
                        <>
                          Tiếp tục kích hoạt
                          <span className="text-xs" aria-hidden="true">→</span>
                        </>
                      )}
                    </button>
                  ) : (
                    /* Step 3 action buttons */
                    isActivated ? (
                      <button
                        onClick={resetForm}
                        className="w-full rounded py-3 px-4 text-sm font-semibold bg-gray-800 text-white hover:bg-gray-700 cursor-pointer transition-colors"
                      >
                        Đăng ký gói khác / Reset
                      </button>
                    ) : (
                      <button
                        onClick={handleActivate}
                        disabled={isActivating}
                        className="w-full flex items-center justify-center gap-2 rounded py-3 px-4 text-sm font-semibold bg-green-600 text-white hover:bg-green-500 hover:shadow-md cursor-pointer transition-all disabled:opacity-50"
                      >
                        {isActivating ? (
                          <>
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Đang xác minh giao dịch...
                          </>
                        ) : (
                          <>
                            ⚡ Xác nhận & Kích hoạt dịch vụ
                          </>
                        )}
                      </button>
                    )
                  )}

                  {/* Back button */}
                  {step > 1 && !isActivated && (
                    <button
                      onClick={handleBackStep}
                      className="w-full py-2.5 px-4 text-xs font-semibold bg-transparent text-gray-500 hover:text-white border border-gray-800 hover:border-gray-700 rounded transition-colors cursor-pointer"
                    >
                      ← Quay lại bước trước
                    </button>
                  )}
                </div>
              </div>

              {/* Dynamic Console log list (technical logs) */}
              <div className="mt-2 border-t border-gray-800 pt-3 flex-shrink-0">
                <span className="text-[9px] font-mono-tech uppercase tracking-widest text-gray-500 block mb-1">
                  Nhật ký tiến trình:
                </span>
                <div className="h-[90px] overflow-y-auto bg-black/60 rounded p-2 flex flex-col-reverse gap-1 border border-gray-900 font-mono-tech text-[9px] text-green-400/80 scrollbar-thin">
                  {logs.length > 0 ? (
                    logs.map((log, i) => (
                      <div key={i} className="leading-normal select-none">
                        {log}
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-600 italic select-none">[Trống. Hệ thống sẵn sàng...]</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
