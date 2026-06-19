"use client";

import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Line } from "@react-three/drei";
import * as THREE from "three";
import { TelemetryState } from "@/hooks/useTelemetrySim";

interface ThreeContainerProps {
  state: TelemetryState;
}

// ── ESP32 PCB Board ────────────────────────────────────────────────────────
function ESP32Board({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* PCB main board */}
      <mesh>
        <boxGeometry args={[0.55, 0.03, 0.28]} />
        <meshStandardMaterial color="#1A5C2A" roughness={0.4} metalness={0.1} />
      </mesh>
      {/* CPU chip */}
      <mesh position={[0, 0.025, 0]}>
        <boxGeometry args={[0.12, 0.015, 0.12]} />
        <meshStandardMaterial color="#111" roughness={0.2} metalness={0.5} />
      </mesh>
      {/* WiFi antenna stub */}
      <mesh position={[0.25, 0.04, 0]}>
        <boxGeometry args={[0.04, 0.06, 0.02]} />
        <meshStandardMaterial color="#C0C0C0" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* USB port */}
      <mesh position={[-0.25, 0.02, 0]}>
        <boxGeometry args={[0.04, 0.03, 0.06]} />
        <meshStandardMaterial color="#888" metalness={0.6} />
      </mesh>
      {/* Pin rows */}
      {[-0.1, -0.05, 0, 0.05, 0.1].map((x, i) => (
        <mesh key={i} position={[x, 0.03, 0.13]}>
          <boxGeometry args={[0.02, 0.04, 0.02]} />
          <meshStandardMaterial color="#C0A020" metalness={0.9} />
        </mesh>
      ))}
      {/* Status LED (green) */}
      <mesh position={[0.18, 0.03, 0.1]}>
        <sphereGeometry args={[0.018, 8, 8]} />
        <meshBasicMaterial color="#00FF44" />
      </mesh>
    </group>
  );
}

// ── Relay Module ───────────────────────────────────────────────────────────
function RelayModule({
  position,
  active,
}: {
  position: [number, number, number];
  active: boolean;
}) {
  return (
    <group position={position}>
      {/* Relay PCB */}
      <mesh>
        <boxGeometry args={[0.4, 0.03, 0.18]} />
        <meshStandardMaterial color="#1A3A6A" roughness={0.4} />
      </mesh>
      {/* Relay coil x2 */}
      {[-0.1, 0.1].map((x, i) => (
        <group key={i} position={[x, 0.04, 0]}>
          <mesh>
            <boxGeometry args={[0.1, 0.05, 0.14]} />
            <meshStandardMaterial color="#222" roughness={0.5} />
          </mesh>
          {/* Status LED */}
          <mesh position={[0, 0.045, -0.04]}>
            <sphereGeometry args={[0.015, 8, 8]} />
            <meshBasicMaterial color={active ? "#FF3300" : "#330000"} />
          </mesh>
        </group>
      ))}
      {/* Screw terminals */}
      {[-0.15, -0.05, 0.05, 0.15].map((x, i) => (
        <mesh key={i} position={[x, 0.03, 0.09]}>
          <boxGeometry args={[0.04, 0.04, 0.04]} />
          <meshStandardMaterial color="#888" metalness={0.7} />
        </mesh>
      ))}
    </group>
  );
}

// ── Evaporator / Cooling Unit ──────────────────────────────────────────────
function CoolingUnit({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Main housing */}
      <mesh>
        <boxGeometry args={[2.2, 0.35, 0.5]} />
        <meshStandardMaterial color="#C0C8D0" roughness={0.3} metalness={0.4} />
      </mesh>
      {/* Fin array */}
      {Array.from({ length: 12 }).map((_, i) => (
        <mesh key={i} position={[-1.0 + i * 0.18, 0, 0.26]}>
          <boxGeometry args={[0.02, 0.3, 0.06]} />
          <meshStandardMaterial color="#A0B0C0" metalness={0.6} roughness={0.2} />
        </mesh>
      ))}
      {/* Drain pipe */}
      <mesh position={[0, -0.22, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.03, 0.03, 0.3, 8]} />
        <meshStandardMaterial color="#888" metalness={0.5} />
      </mesh>
      {/* Coolant pipe left */}
      <mesh position={[-1.2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.04, 0.04, 0.2, 8]} />
        <meshStandardMaterial color="#4488CC" metalness={0.6} />
      </mesh>
      {/* Coolant pipe right */}
      <mesh position={[1.2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.04, 0.04, 0.2, 8]} />
        <meshStandardMaterial color="#CC4444" metalness={0.6} />
      </mesh>
    </group>
  );
}

// ── Fan (detailed) ─────────────────────────────────────────────────────────
function Fan({
  active,
  position,
}: {
  active: boolean;
  position: [number, number, number];
}) {
  const bladeRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (bladeRef.current) {
      bladeRef.current.rotation.z += delta * (active ? 14 : 0.4);
    }
  });

  return (
    <group position={position}>
      {/* Housing ring */}
      <mesh>
        <ringGeometry args={[0.72, 0.82, 32]} />
        <meshBasicMaterial color="#CC2200" side={THREE.DoubleSide} />
      </mesh>
      {/* Cross struts */}
      <mesh>
        <boxGeometry args={[1.6, 0.06, 0.04]} />
        <meshBasicMaterial color="#AA1100" />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[1.6, 0.06, 0.04]} />
        <meshBasicMaterial color="#AA1100" />
      </mesh>
      {/* Blades */}
      <group ref={bladeRef}>
        {[0, 1, 2, 3, 4].map((i) => (
          <mesh key={i} rotation={[0, 0, (i * Math.PI * 2) / 5]}>
            <boxGeometry args={[0.55, 0.12, 0.03]} />
            <meshStandardMaterial
              color={active ? "#FFFFFF" : "#CCCCCC"}
              roughness={0.3}
            />
          </mesh>
        ))}
      </group>
      {/* Center hub */}
      <mesh>
        <cylinderGeometry args={[0.1, 0.1, 0.06, 16]} />
        <meshStandardMaterial color="#CC2200" metalness={0.5} />
      </mesh>
    </group>
  );
}

// ── Sensor Node ────────────────────────────────────────────────────────────
function SensorNode({
  position,
  status,
  onClick,
}: {
  position: [number, number, number];
  status: "NORMAL" | "WARNING" | "CRITICAL";
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const ledRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (ledRef.current) {
      const s = 1 + Math.sin(clock.getElapsedTime() * 6) * 0.2;
      ledRef.current.scale.set(s, s, s);
    }
  });

  const statusColor =
    status === "CRITICAL" ? "#FF2A2A" : status === "WARNING" ? "#F59E0B" : "#4AF626";

  return (
    <group position={position}>
      {/* Click area */}
      <mesh
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = "pointer"; }}
        onPointerOut={(e) => { e.stopPropagation(); setHovered(false); document.body.style.cursor = "auto"; }}
        visible={false}
      >
        <boxGeometry args={[0.6, 0.6, 0.6]} />
      </mesh>
      {/* Mounting rod */}
      <Line
        points={[[0, 0, 0], [0, 1.8 - position[1], 0]]}
        color={hovered ? "#4AF626" : "#666666"}
        lineWidth={2}
      />
      {/* Ceiling flange */}
      <mesh position={[0, 1.8 - position[1], 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.02, 12]} />
        <meshStandardMaterial color="#94A3B8" metalness={0.6} />
      </mesh>
      {/* Enclosure body */}
      <group rotation={[0.05, hovered ? Math.PI / 4 : 0.2, 0.05]}>
        <mesh>
          <boxGeometry args={[0.3, 0.22, 0.48]} />
          <meshStandardMaterial color={hovered ? "#94A3B8" : "#CBD5E1"} roughness={0.5} metalness={0.15} />
        </mesh>
        {/* Bumper rail */}
        <mesh>
          <boxGeometry args={[0.32, 0.08, 0.50]} />
          <meshStandardMaterial color="#FF9500" roughness={0.4} />
        </mesh>
        {/* Sensor mesh vent */}
        <mesh position={[0, 0.1, 0.09]}>
          <boxGeometry args={[0.16, 0.03, 0.16]} />
          <meshStandardMaterial color="#94A3B8" roughness={0.9} />
        </mesh>
        {/* Antenna */}
        <mesh position={[-0.1, 0.12, -0.18]} rotation={[-0.15, 0, -0.1]}>
          <cylinderGeometry args={[0.006, 0.006, 0.24, 8]} />
          <meshStandardMaterial color="#475569" roughness={0.2} />
        </mesh>
        {/* Status LED */}
        <mesh ref={ledRef} position={[0, 0.12, -0.14]}>
          <sphereGeometry args={[0.03, 16, 16]} />
          <meshBasicMaterial color={statusColor} />
        </mesh>
        {/* Ground ring */}
        <mesh position={[0, -0.16, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.22, 0.26, 32]} />
          <meshBasicMaterial color={statusColor} transparent opacity={hovered ? 0.9 : 0.4} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </group>
  );
}

// ── Cargo Box ──────────────────────────────────────────────────────────────
function CargoBox({
  position,
  fruitColor = "#FF3B30",
  onClick,
}: {
  position: [number, number, number];
  fruitColor?: string;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const boxColor = hovered ? "#4AF626" : "#FF3B30";

  return (
    <group
      position={position}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = "pointer"; }}
      onPointerOut={(e) => { e.stopPropagation(); setHovered(false); document.body.style.cursor = "auto"; }}
    >
      {/* Tray */}
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[0.75, 0.22, 0.75]} />
        <meshStandardMaterial color={boxColor} transparent opacity={0.4} roughness={0.8} />
      </mesh>
      <lineSegments position={[0, -0.1, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(0.75, 0.22, 0.75)]} />
        <lineBasicMaterial color={boxColor} />
      </lineSegments>
      {/* Fruits */}
      {[[-0.2, 0, -0.2], [0.2, 0, -0.2], [-0.15, 0.08, 0.15], [0.15, 0.08, 0.15], [0, -0.05, 0]].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]}>
          <sphereGeometry args={[0.12 + (i % 2) * 0.02, 8, 8]} />
          <meshStandardMaterial color={fruitColor} roughness={0.3} />
        </mesh>
      ))}
    </group>
  );
}

// ── Container Model ────────────────────────────────────────────────────────
function ContainerModel({
  state,
  onNodeSelect,
}: {
  state: TelemetryState;
  onNodeSelect: (label: string) => void;
}) {
  const W = 4, H = 3.6, L = 9;
  const isFanActive = state.fanRelay === "ON";

  const crates = [
    { pos: [-0.7, -1.4, -3.0] as [number,number,number], label: "THÙNG TÁO ĐỎ #01 (Khu A1)" },
    { pos: [ 0.7, -1.4, -3.0] as [number,number,number], label: "THÙNG TÁO ĐỎ #02 (Khu A2)" },
    { pos: [-0.7, -1.4, -1.0] as [number,number,number], label: "THÙNG TÁO ĐỎ #03 (Khu B1)" },
    { pos: [ 0.7, -1.4, -1.0] as [number,number,number], label: "THÙNG TÁO ĐỎ #04 (Khu B2)" },
    { pos: [-0.7, -1.4,  1.0] as [number,number,number], label: "THÙNG TÁO ĐỎ #05 (Khu B3)" },
    { pos: [ 0.7, -1.4,  1.0] as [number,number,number], label: "THÙNG TÁO ĐỎ #06 (Khu C1)" },
    { pos: [-0.7, -1.4,  3.0] as [number,number,number], label: "THÙNG TÁO ĐỎ #07 (Khu C2)" },
    { pos: [ 0.7, -1.4,  3.0] as [number,number,number], label: "THÙNG TÁO ĐỎ #08 (Khu C3)" },
  ];

  return (
    <group>
      {/* Container walls */}
      <mesh>
        <boxGeometry args={[W, H, L]} />
        <meshBasicMaterial color="#121212" transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>

      {/* Floor */}
      <mesh position={[0, -H / 2 + 0.02, 0]}>
        <boxGeometry args={[W - 0.1, 0.04, L - 0.1]} />
        <meshStandardMaterial color="#1A1A1A" roughness={0.9} />
      </mesh>

      {/* Wireframe edges - front face */}
      <Line points={[[-W/2,-H/2,-L/2],[W/2,-H/2,-L/2],[W/2,H/2,-L/2],[-W/2,H/2,-L/2],[-W/2,-H/2,-L/2]]} color="#FF2A2A" lineWidth={1.5} />
      {/* back face */}
      <Line points={[[-W/2,-H/2,L/2],[W/2,-H/2,L/2],[W/2,H/2,L/2],[-W/2,H/2,L/2],[-W/2,-H/2,L/2]]} color="#FF2A2A" lineWidth={1.5} />
      {/* longitudinal */}
      <Line points={[[-W/2,-H/2,-L/2],[-W/2,-H/2,L/2]]} color="#555555" lineWidth={1} />
      <Line points={[[W/2,-H/2,-L/2],[W/2,-H/2,L/2]]} color="#555555" lineWidth={1} />
      <Line points={[[-W/2,H/2,-L/2],[-W/2,H/2,L/2]]} color="#555555" lineWidth={1} />
      <Line points={[[W/2,H/2,-L/2],[W/2,H/2,L/2]]} color="#555555" lineWidth={1} />

      {/* Internal support ribs */}
      {[-3, 0, 3].map((z, i) => (
        <group key={i} position={[0, 0, z]}>
          <Line points={[[-W/2,-H/2,0],[W/2,-H/2,0]]} color="#333333" lineWidth={1} />
          <Line points={[[-W/2,H/2,0],[W/2,H/2,0]]} color="#333333" lineWidth={1} />
        </group>
      ))}

      {/* ── Cooling unit (evaporator) at ceiling front ── */}
      <CoolingUnit position={[0, H / 2 - 0.3, -L / 2 + 0.6]} />

      {/* ── Fans ── */}
      <Fan active={isFanActive} position={[-1, 0.8, -L / 2 + 0.08]} />
      <Fan active={isFanActive} position={[1, 0.8, -L / 2 + 0.08]} />

      {/* ── Control box on side wall (contains ESP32 + Relay) ── */}
      {/* Control box housing */}
      <mesh position={[W / 2 - 0.08, 0.6, -L / 2 + 1.5]}>
        <boxGeometry args={[0.12, 0.55, 0.75]} />
        <meshStandardMaterial color="#2A2A2A" roughness={0.5} />
      </mesh>
      {/* Control box lid */}
      <mesh position={[W / 2 - 0.14, 0.6, -L / 2 + 1.5]}>
        <boxGeometry args={[0.01, 0.53, 0.73]} />
        <meshStandardMaterial color="#3A3A3A" roughness={0.3} />
      </mesh>
      {/* ESP32 inside box */}
      <ESP32Board position={[W / 2 - 0.09, 0.7, -L / 2 + 1.5]} />
      {/* Relay module below ESP32 */}
      <RelayModule position={[W / 2 - 0.09, 0.45, -L / 2 + 1.5]} active={isFanActive} />

      {/* Wire: Relay → Fan 1 */}
      <Line
        points={[[W/2-0.09, 0.45, -L/2+1.5], [W/2-0.2, 0.45, -L/2+0.5], [-1, 0.8, -L/2+0.08]]}
        color="#FF6600"
        lineWidth={1.5}
      />
      {/* Wire: Relay → Fan 2 */}
      <Line
        points={[[W/2-0.09, 0.45, -L/2+1.5], [W/2-0.2, 0.45, -L/2+0.5], [1, 0.8, -L/2+0.08]]}
        color="#FF6600"
        lineWidth={1.5}
      />
      {/* Wire: Relay → Cooling unit */}
      <Line
        points={[[W/2-0.09, 0.45, -L/2+1.5], [0.5, H/2-0.2, -L/2+0.6]]}
        color="#4488FF"
        lineWidth={1.5}
      />

      {/* ── Cargo crates ── */}
      {crates.map((c, i) => (
        <CargoBox key={i} position={c.pos} onClick={() => onNodeSelect(c.label)} />
      ))}

      {/* ── Sensor Nodes ── */}
      <SensorNode position={[-0.8, -0.4, -2.5]} status={state.nodeStatus} onClick={() => onNodeSelect("NODE 01 (Vùng trước — Gần quạt)")} />
      <SensorNode position={[0.8, 0.2, 0]} status="NORMAL" onClick={() => onNodeSelect("NODE 02 (Vùng trung tâm)")} />
      <SensorNode position={[-0.6, -0.2, 2.5]} status="NORMAL" onClick={() => onNodeSelect("NODE 03 (Vùng sau)")} />
    </group>
  );
}

// ── Main Export ────────────────────────────────────────────────────────────
export default function ThreeContainer({ state }: ThreeContainerProps) {
  const [mounted, setMounted] = useState(false);
  const [selectedNode, setSelectedNode] = useState("NODE 01 (Vùng trước — Gần quạt)");

  useEffect(() => {
    const h = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(h);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-[380px] bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center text-xs text-gray-400">
        Đang khởi động mô hình 3D...
      </div>
    );
  }

  const isNode = !selectedNode.includes("THÙNG");

  return (
    <div className="card-flat p-5 flex flex-col gap-4 relative">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest">
          Mô phỏng 3D Container Lạnh — ESP32 + Relay
        </h2>
        <span className="text-[10px] text-gray-400">Kéo để xoay · Cuộn để zoom</span>
      </div>

      <div
        className="w-full h-[420px] rounded-xl relative overflow-hidden border border-gray-200"
        style={{ background: "#0A0A0A" }}
      >
        <Canvas camera={{ position: [8, 6, 10], fov: 38 }}>
          <color attach="background" args={["#0A0A0A"]} />
          <ambientLight intensity={0.7} />
          <pointLight position={[10, 10, 10]} intensity={1.8} />
          <pointLight position={[-8, 4, -6]} intensity={0.8} color="#88AAFF" />
          <ContainerModel state={state} onNodeSelect={setSelectedNode} />
          <OrbitControls enableZoom maxPolarAngle={Math.PI / 1.8} minDistance={5} maxDistance={18} />
        </Canvas>

        {/* Legend */}
        <div className="absolute top-3 right-3 flex flex-col gap-1 text-[10px]">
          {[
            { c: "#FF6600", l: "Dây điện → Relay" },
            { c: "#4488FF", l: "Dây → Dàn lạnh" },
            { c: "#FF2A2A", l: "Khung container" },
          ].map(({ c, l }) => (
            <div key={l} className="flex items-center gap-1.5">
              <span className="w-4 h-0.5 rounded" style={{ background: c }} />
              <span className="text-gray-400">{l}</span>
            </div>
          ))}
        </div>

        {/* HUD */}
        <div className="absolute bottom-3 left-3 bg-black/80 border border-white/10 rounded-lg p-3 text-[11px] text-gray-300 max-w-[260px]">
          <div className="font-bold text-white text-xs mb-1.5 border-b border-white/10 pb-1.5">
            {isNode ? "📡 Sensor Node" : "📦 Lô nông sản"}
          </div>
          <div className="text-green-400 font-semibold mb-1 leading-tight">{selectedNode}</div>
          <div className="leading-relaxed text-gray-400">
            {selectedNode.includes("NODE 01") ? (
              <>
                Trạng thái: <span className={state.nodeStatus === "NORMAL" ? "text-green-400" : "text-red-400"}>
                  {state.nodeStatus === "NORMAL" ? "Bình thường" : state.nodeStatus === "WARNING" ? "Cảnh báo" : "Nguy hiểm"}
                </span><br />
                C2H4: {state.c2h4} ppm · {state.temperatureAmbient}°C<br />
                Độ ẩm: {state.humidity}% · ESP-NOW Mesh
              </>
            ) : selectedNode.includes("NODE") ? (
              <>Trạng thái: <span className="text-green-400">Bình thường</span><br />C2H4: 1.5 ppm · 3.9°C<br />Độ ẩm: 85%</>
            ) : (
              <>Lô hàng: Táo đỏ Fuji nhập khẩu<br />Nhiệt độ tối ưu: 0°C – 3°C<br />Độ ẩm tối ưu: 90–95% RH</>
            )}
          </div>
        </div>
      </div>

      {/* Component legend below canvas */}
      <div className="grid grid-cols-4 gap-2 text-[10px] text-gray-500">
        {[
          { icon: "🟢", label: "ESP32 (Wi-Fi/BT)" },
          { icon: "🔴", label: "Relay Module 2CH" },
          { icon: "❄️",  label: "Dàn lạnh (Evaporator)" },
          { icon: "🌀", label: `Quạt thông gió (${state.fanRelay === "ON" ? "ĐANG CHẠY" : "STANDBY"})` },
        ].map(({ icon, label }) => (
          <div key={label} className="flex items-center gap-1.5 bg-gray-50 rounded-lg px-2 py-1.5">
            <span>{icon}</span>
            <span className="leading-tight">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
