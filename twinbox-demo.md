# KẾ HOẠCH TRIỂN KHAI: TwinBoxAi - Bảng Điều Khiển Telemetry & Trình Diễn Web

## 1. Tổng Quan
TwinBoxAi là bảng điều khiển telemetry hiệu năng cao và trang landing trình diễn cho cuộc thi khởi nghiệp, giới thiệu hệ thống bảo quản nông sản chuỗi lạnh dựa trên IoT. Hệ thống đo lường nồng độ Ethylene ($C_2H_4$), nhiệt độ, và độ ẩm, đồng thời dự đoán thời gian sử dụng còn lại (Dynamic Shelf Life - DSL) một cách động bằng mô hình vật lý động học Arrhenius. Hệ thống cũng hỗ trợ "Active Actuation" - kích hoạt các rơ-le thông gió để "hồi phục" môi trường một cách tự động hoặc thủ công từ bảng điều khiển.

Kế hoạch triển khai này mô tả việc xây dựng ứng dụng Next.js với phong cách thiết kế Industrial Brutalism & Tactical Telemetry (CRT Terminal Dark), tích hợp mô hình Three.js container lạnh 3D để hiển thị vị trí các node cảm biến và trạng thái hoạt động theo thời gian thực.

---

## 2. Loại Dự Án
- Project Type: `WEB`
- Mục tiêu triển khai: Vercel

---

## 3. Tiêu Chí Thành Công
1. Thẩm mỹ hình ảnh: Giao diện Tactical Telemetry HUD mật độ cao với các góc vuông chính xác 90 độ, phông chữ monospace, hiệu ứng sọc quét CRT (scanlines), khung ASCII, và các họa tiết cảnh báo/tần số tùy chỉnh. KHÔNG sử dụng gradient màu tím (chỉ dùng màu đỏ hàng không và xanh lục/amber phosphor).
2. Yếu tố 3D tương tác: Canvas React Three Fiber (Three.js) render mô hình container vận chuyển lạnh 3D với các node cảm biến có thể click để hiển thị tooltip trạng thái và tín hiệu thị giác khi bật/tắt quạt.
3. Mô phỏng Bảng điều khiển: Hệ thống trạng thái hoạt động hoàn chỉnh cho phép người dùng:
   - Bật/tắt các quạt thông gió từ xa (ON/OFF).
   - Mô phỏng mức C2H4 (bình thường vs ngưỡng nguy hiểm) và thấy hệ thống tự động kích hoạt cảnh báo, thay đổi tần số telemetry (15 phút thành 1 phút).
   - Hiển thị tính toánDSL theo mô hình động học Arrhenius theo thời gian thực.
4. Nội dung phong phú: Giải thích thiết kế thiết bị vật lý (Dual-Chamber, lõi IP67, buồng thở ePTFE, pin 18650 Li-ion, Deep Sleep, và mạng lưới ESP-NOW bên trong lồng Faraday container).
5. Hiệu suất & Build: Biên dịch thành công không lỗi, triển khai trên Vercel sạch sẽ, đạt chuẩn Lighthouse.

---

## 4. Stack Công Nghệ
- Framework: Next.js (App Router, TypeScript)
- Trình bày (Styling): Tailwind CSS (v4) với các giá trị monospace tùy chỉnh, đường viền đặc, và gradient scanline.
- Công cụ 3D: Three.js, `@react-three/fiber`, `@react-three/drei` (React wrapper cho Three.js)
- Hiệu ứng hoạt hình: `motion/react` (Framer Motion) cho các hoạt cảnh dữ liệu grid, GSAP (tùy chọn, giữ riêng biệt cho hiệu ứng mở đầu).
- Biểu tượng: `@phosphor-icons/react` hoặc `@radix-ui/react-icons`.

---

## 5. Cấu Trúc Thư Mục
Dự án sẽ được xây dựng trong thư mục gốc. Để tránh xung đột với các file PDF hiện có, chúng ta sẽ khởi tạo ứng dụng Next.js trong thư mục gốc đồng thời đảm bảo xử lý các file hiện có một cách nhẹ nhàng.

```plaintext
/ (Root)
├── twinbox-demo.md                  # Kế hoạch triển khai này
├── package.json                     # Các thư viện phụ thuộc chính
├── next.config.ts                   # Cấu hình Next.js
├── tailwind.config.js               # Cài đặt Tailwind tùy chỉnh
├── src/
│   ├── app/
│   │   ├── layout.tsx               # Layout gốc (đặt monospace, scanlines toàn cục, grain)
│   │   └── page.tsx                 # Trang landing & layout dashboard chính
│   ├── components/
│   │   ├── ThreeContainer.tsx       # Mô hình Container 3D (React Three Fiber)
│   │   ├── TelemetryHUD.tsx         # Grid metrics thời gian thực (C2H4, Temp, Humidity, DSL)
│   │   ├── ActiveControls.tsx       # Công tắc ghi đè quạt, rơ-le làm lạnh
│   │   ├── TechnicalSpecs.tsx       # Thông số kỹ thuật Swiss-print/Brutalist (IP67, pin, ESP-NOW)
│   │   ├── CRTOverlay.tsx           # Bộ lọc gradient scanline và nhiễu hạt toàn cục
│   │   └── AlertBanner.tsx          # Thanh cảnh báo thời gian thực (ASCII nhấp nháy)
│   ├── hooks/
│   │   └── useTelemetrySim.ts       # React hook quản lý trạng thái cảm biến mô phỏng và vòng lặp hoạt động
│   └── styles/
│       └── globals.css              # Thanh cuộn tùy chỉnh, font pairs, và utilities đường grid
```

---

## 6. Phân Tích Nhiệm Vụ

### Giai đoạn 1: Nền tảng (Cài đặt Kỹ thuật)
#### Nhiệm vụ 1.1: Khởi tạo Next.js
- Agent: `devops-engineer`
- Skill: `bash-linux`, `clean-code`
- Phụ thuộc: Không
- INPUT: Không gian làm việc sạch với PDF trong thư mục gốc.
- OUTPUT: Dự án Next.js hoạt động với Tailwind CSS, TypeScript, và ESLint.
- VERIFY: Chạy `npm run build` và đảm bảo thành công.
- Khôi phục: Nếu file xung đột, xóa template cấu hình xung đột và gộp thư mục thủ công.

#### Nhiệm vụ 1.2: Cài đặt thư viện & Thiết lập Style
- Agent: `frontend-specialist`
- Skill: `design-taste-frontend`, `tailwind-patterns`
- Phụ thuộc: Nhiệm vụ 1.1
- INPUT: Dự án Next.js sạch.
- OUTPUT: Đã cài đặt `three`, `@types/three`, `@react-three/fiber`, `@react-three/drei`, `motion/react`, `@phosphor-icons/react`. CSS toàn cục với scanlines, lưới nhiễu, và font-families (JetBrains Mono / IBM Plex Mono).
- VERIFY: Chạy `npm run dev` và đảm bảo các package import không lỗi module-not-found.

---

### Giai đoạn 2: Hệ thống Core Telemetry
#### Nhiệm vụ 2.1: React Hook quản lý trạng thái mô phỏng Telemetry
- Agent: `backend-specialist`
- Skill: `clean-code`
- Phụ thuộc: Nhiệm vụ 1.2
- INPUT: Cấu trúc dự án Next.js.
- OUTPUT: `src/hooks/useTelemetrySim.ts` hook quản lý:
  - Giá trị đang hoạt động: Nhiệt độ (lõi/môi trường), độ ẩm, C2H4 (ppm), điện áp pin, trạng thái.
  - Trạng thái Active Actuation: Trạng thái rơ-le quạt (ON/OFF), mức thông gió.
  - Vòng lặp mô phỏng: Timer tick cập nhật giá trị. C2H4 giảm khi Quạt BẬT, tăng khi Quạt TẮT.
  - Ghi đè cảnh báo: Chuyển sang cập nhật 1 phút (mô phỏng) và nhấp nháy cảnh báo đỏ nếu C2H4 vượt 25ppm.
  - Tính toán DSL: Công thức tốc độ động học Arrhenius cơ bản dự đoán thời gian sử dụng còn lại dựa trên tiếp xúc nhiệt độ môi trường.
- VERIFY: Tạo unit test mock hoặc import hook vào component tạm thời để xác nhận cập nhật trạng thái đúng.

---

### Giai đoạn 3: Phát triển UI Component
#### Nhiệm vụ 3.1: CRT Telemetry HUD & Bảng điều khiển
- Agent: `frontend-specialist`
- Skill: `industrial-brutalist-ui`, `design-taste-frontend`
- Phụ thuộc: Nhiệm vụ 2.1
- INPUT: Hook `useTelemetrySim`.
- OUTPUT:
   - `TelemetryHUD.tsx`: Grid đọc dữ liệu monospace với đường viền đậm, tiêu đề góc ASCII (`[ NODE - 01 ]`), và đèn trạng thái.
   - `ActiveControls.tsx`: Công tắc ghi đè với viền đậm, sọc cảnh báo đỏ, và trạng thái khoảnh khắc.
   - `CRTOverlay.tsx`: Gradient scanline toàn cục và lớp phủ nhiễu hạt.
- VERIFY: Xây dựng layouts và đảm bảo chính xác 90-degree corners, không border-radius ở bất kỳ đâu, và độ phản hồi sạch sẽ.

#### Nhiệm vụ 3.2: Component Container 3D Three.js
- Agent: `frontend-specialist`
- Skill: `industrial-brutalist-ui`, `design-taste-frontend`
- Phụ thuộc: Nhiệm vụ 3.1
- INPUT: Yêu cầu 3D và trạng thái telemetry.
- OUTPUT: `ThreeContainer.tsx` render:
   - Mô hình container lạnh 3D dạng khung dây hoặc low-poly.
   - Các node cảm biến phát sáng có thể click bên trong container.
   - Các quạt quay trực quan khi rơ-le Quạt BẬT.
   - Bộ xử lý click tương tác hiển thị tooltip telemetry hiện tại.
- VERIFY: Xác nhận container tải không bị lỗi WebGL và phản hồi trạng thái Quạt ON/OFF.

#### Nhiệm vụ 3.3: Trình diễn kỹ thuật sản phẩm
- Agent: `frontend-specialist`
- Skill: `industrial-brutalist-ui`, `design-taste-frontend`
- Phụ thuộc: Nhiệm vụ 3.2
- INPUT: Các file PDF chứa thông số kỹ thuật sản phẩm (Dual-Chamber IP67, tối ưu hóa pin Deep Sleep, ESP-NOW bên trong lồng Faraday, Dynamic FEFO).
- OUTPUT: `TechnicalSpecs.tsx` layout trình bày các đổi mới kỹ thuật cốt lõi với phong cách Swiss Print sạch sẽ (headers monolithic, hình ảnh rõ ràng, họa tiết barcode, không phông nền).
- VERIFY: Văn bản khớp chính xác các chi tiết từ file PDF và thỏa mãn quy tắc "không filler".

---

### Giai đoạn 4: Tích hợp & Tối ưu hóa
#### Nhiệm vụ 4.1: lắp ráp Trang chính
- Agent: `frontend-specialist`
- Skill: `design-taste-frontend`
- Phụ thuộc: Nhiệm vụ 3.3
- INPUT: Tất cả components.
- OUTPUT: `src/app/page.tsx` tích hợp HUD, 3D Canvas, công tắc hoạt động, và thông số kỹ thuật trong layout thống nhất.
- VERIFY: Xác nhận layout trực quan dưới desktop và viewport mobile.

#### Nhiệm vụ 4.2: Kiểm tra cuối cùng & Xác minh hiệu suất
- Agent: `devops-engineer`
- Skill: `performance-profiling`, `webapp-testing`
- Phụ thuộc: Nhiệm vụ 4.1
- INPUT: Dự án đã lắp ráp.
- OUTPUT: Đạt lighthouse audit, cảnh báo typescript hoặc lint bằng 0, layout sạch sẽ.
- VERIFY: Chạy `npm run build` và kiểm tra.

---

## 7. Giai đoạn X: Checklist Xác minh Cuối cùng
- [ ] Không sử dụng `border-radius` trong CSS / Tailwind để áp dụng industrial brutalism.
- [ ] Font monospace JetBrains Mono / IBM Plex Mono được khóa toàn cục.
- [ ] Không gradient tím. Bảng màu giới hạn ở CRT Dark (`#0A0A0A`), Phosphor Trắng (`#EAEAEA`), Đỏ Hazard (`#FF2A2A`), và Xanh Terminal (`#4AF626`).
- [ ] Không dấu gạch ngang (`—` hoặc `–`) trong nội dung văn bản.
- [ ] Canvas 3D tải và quay đúng.
- [ ] Bật quạt thủ công làm quay blade 3D và giảm mức C2H4 mô phỏng.
- [ ] Hệ thống tự động kích hoạt cảnh báo và telemetry tần số cao khi C2H4 vượt 25ppm.
- [ ] Build thành công với `npm run build`.

## 8. Gợi Ý Font Chữ Tiếng Việt
Để đảm bảo hiển thị đúng tiếng Việt với đầy đủ dấu, tôi đề xuất các font chữ sau:

### Font Monospace (Cho Telemetry HUD)
1. JetBrains Mono - Tốt nhất cho TypeScript/terminal, có hỗ trợ tiếng Việt đầy đủ
   - Glyphs đầy đủ cho dấu huyền, hỏi, ngã, sắc, nặng
   - Mở rộng Unicode tốt
   - Phù hợp với phong cáchIndustrial Brutalism

2. IBM Plex Mono - cũng rất tốt cho tiếng Việt
   - Có đầy đủ dấu tiếng Việt
   -风格接近 industrial terminal

3. Roboto Mono - đơn giản, dễ đọc
   - Hỗ trợ tiếng Việt đầy đủ
   - Nhẹ, nhanh tải

### Font Sans-serif (Cho Headers và Content)
1. Inter - phổ biến, có tiếng Việt tốt
2. Roboto - hỗ trợ tiếng Việt tốt, nhẹ
3. Outfit - hiện đại, có tiếng Việt tốt

Khuyến nghị: Sử dụng JetBrains Mono cho telemetry HUD (độ chính xác kỹ thuật cao) và Inter cho headers (độ rõ ràng tốt).s Simulated C2H4 levels.
- [ ] System automatically triggers alerts and high frequency telemetry when C2H4 exceeds 25ppm.
- [ ] Build succeeds with `npm run build`.
