"use client";

import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Line } from "@react-three/drei";
import * as THREE from "three";
import { TelemetryState } from "@/hooks/useTelemetrySim";

interface ThreeContainerProps {
  state: TelemetryState;
}

// 3D Animated Fan component
function Fan({ active, position }: { active: boolean; position: [number, number, number] }) {
  const fanRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (active && fanRef.current) {
      fanRef.current.rotation.z += delta * 12; // Spin fast
    } else if (fanRef.current) {
      fanRef.current.rotation.z += delta * 0.5; // Slow drift
    }
  });

  return (
    <group position={position}>
      {/* Fan Case */}
      <mesh>
        <ringGeometry args={[0.75, 0.8, 32]} />
        <meshBasicMaterial color="#FF2A2A" side={THREE.DoubleSide} />
      </mesh>
      {/* Blades */}
      <group ref={fanRef}>
        <mesh>
          <boxGeometry args={[1.4, 0.15, 0.02]} />
          <meshBasicMaterial color="#EAEAEA" />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 3]}>
          <boxGeometry args={[1.4, 0.15, 0.02]} />
          <meshBasicMaterial color="#EAEAEA" />
        </mesh>
        <mesh rotation={[0, 0, (2 * Math.PI) / 3]}>
          <boxGeometry args={[1.4, 0.15, 0.02]} />
          <meshBasicMaterial color="#EAEAEA" />
        </mesh>
      </group>
      {/* Center Cap */}
      <mesh position={[0, 0, 0.03]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshBasicMaterial color="#FF2A2A" />
      </mesh>
    </group>
  );
}

// Interactive Sensor Node component (Realistic Industrial IoT Dual-Chamber Enclosure)
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

  // LED pulsing effect
  useFrame(({ clock }) => {
    if (ledRef.current) {
      const scale = 1 + Math.sin(clock.getElapsedTime() * 6) * 0.15;
      ledRef.current.scale.set(scale, scale, scale);
    }
  });

  let statusColor = "#4AF626"; // NORMAL
  if (status === "CRITICAL") statusColor = "#FF2A2A";
  else if (status === "WARNING") statusColor = "#F59E0B";

  return (
    <group position={position}>
      {/* Invisible hover & click handler box */}
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
          document.body.style.cursor = "auto";
        }}
        visible={false}
      >
        <boxGeometry args={[0.6, 0.6, 0.6]} />
      </mesh>

      {/* Solid steel mounting rod extending to container roof (Y = 1.8) */}
      <Line
        points={[
          [0, 0, 0],
          [0, 1.8 - position[1], 0],
        ]}
        color={hovered ? "#4AF626" : "rgba(100, 100, 100, 0.7)"}
        lineWidth={2}
      />
      {/* Small ceiling mounting flange plate */}
      <mesh position={[0, 1.8 - position[1], 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.02, 12]} />
        <meshStandardMaterial color="#94A3B8" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Enclosure Rotation & Structure */}
      <group rotation={[0.05, hovered ? Math.PI / 4 : 0.2, 0.05]}>
        {/* Main core sealed body - ABS Industrial Plastic (Light Grey) */}
        <mesh>
          <boxGeometry args={[0.3, 0.2, 0.45]} />
          <meshStandardMaterial color={hovered ? "#94A3B8" : "#CBD5E1"} roughness={0.5} metalness={0.15} />
        </mesh>

        {/* Protective rugged bumper - High-visibility Industrial Orange */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.32, 0.08, 0.47]} />
          <meshStandardMaterial color="#FF9500" roughness={0.4} />
        </mesh>

        {/* Breathable Chamber Cap (Ethylene sensor compartment) */}
        <mesh position={[0, 0.1, 0.08]}>
          <boxGeometry args={[0.16, 0.03, 0.16]} />
          <meshStandardMaterial color="#94A3B8" roughness={0.9} />
        </mesh>

        {/* Pulsing Status LED Indicator */}
        <mesh ref={ledRef} position={[0, 0.1, -0.12]}>
          <sphereGeometry args={[0.035, 16, 16]} />
          <meshBasicMaterial color={statusColor} />
        </mesh>

        {/* Flexible Whip Antenna */}
        <mesh position={[-0.1, 0.1, -0.16]} rotation={[-0.15, 0, -0.1]}>
          <cylinderGeometry args={[0.006, 0.006, 0.22, 8]} />
          <meshStandardMaterial color="#475569" roughness={0.2} />
        </mesh>

        {/* Ground projection status ring */}
        <mesh position={[0, -0.15, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.22, 0.25, 32]} />
          <meshBasicMaterial color={statusColor} transparent opacity={hovered ? 0.9 : 0.4} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </group>
  );
}

// Cargo Box component filled with fruits
function CargoBox({
  position,
  color = "#1E1E1E",
  fruitColor = "#FF2A2A",
  onClick,
}: {
  position: [number, number, number];
  color?: string;
  fruitColor?: string;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <group
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
        document.body.style.cursor = "auto";
      }}
    >
      {/* Shallow fruit box tray (Translucent) */}
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[0.8, 0.25, 0.8]} />
        <meshStandardMaterial color={hovered ? "#4AF626" : color} transparent opacity={hovered ? 0.75 : 0.45} roughness={0.8} />
      </mesh>
      {/* Box Outline */}
      <lineSegments position={[0, -0.1, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(0.8, 0.25, 0.8)]} />
        <lineBasicMaterial color={hovered ? "#4AF626" : color} opacity={0.8} transparent />
      </lineSegments>

      {/* Styled fruits (spheres) inside and sticking out of the tray */}
      <group position={[0, -0.05, 0]}>
        <mesh position={[-0.2, 0, -0.2]}>
          <sphereGeometry args={[0.13, 8, 8]} />
          <meshStandardMaterial color={fruitColor} roughness={0.3} />
        </mesh>
        <mesh position={[0.2, 0, -0.2]}>
          <sphereGeometry args={[0.12, 8, 8]} />
          <meshStandardMaterial color={fruitColor} roughness={0.3} />
        </mesh>
        <mesh position={[-0.15, 0.08, 0.15]}>
          <sphereGeometry args={[0.14, 8, 8]} />
          <meshStandardMaterial color={fruitColor} roughness={0.3} />
        </mesh>
        <mesh position={[0.15, 0.08, 0.15]}>
          <sphereGeometry args={[0.13, 8, 8]} />
          <meshStandardMaterial color={fruitColor} roughness={0.3} />
        </mesh>
        <mesh position={[0, -0.06, 0]}>
          <sphereGeometry args={[0.15, 8, 8]} />
          <meshStandardMaterial color={fruitColor} roughness={0.3} />
        </mesh>
      </group>
    </group>
  );
}

// Container 3D Model structure
function ContainerModel({ state, onNodeSelect }: { state: TelemetryState; onNodeSelect: (label: string) => void }) {
  const isFanActive = state.fanRelay === "ON";

  // Coordinates of the 3D shipping container: Width: 4, Height: 3.6, Length: 9
  const width = 4;
  const height = 3.6;
  const length = 9;

  const crates = [
    { position: [-0.7, -1.4, -3.0] as [number, number, number], fruitColor: "#FF3B30", color: "#FF3B30", label: "THÙNG TÁO ĐỎ #01 (Khu A1 - Trước)" },
    { position: [0.7, -1.4, -3.0] as [number, number, number], fruitColor: "#FF3B30", color: "#FF3B30", label: "THÙNG TÁO ĐỎ #02 (Khu A2 - Trước)" },
    { position: [-0.7, -1.4, -1.0] as [number, number, number], fruitColor: "#FF3B30", color: "#FF3B30", label: "THÙNG TÁO ĐỎ #03 (Khu B1 - Giữa)" },
    { position: [0.7, -1.4, -1.0] as [number, number, number], fruitColor: "#FF3B30", color: "#FF3B30", label: "THÙNG TÁO ĐỎ #04 (Khu B2 - Giữa)" },
    { position: [-0.7, -1.4, 1.0] as [number, number, number], fruitColor: "#FF3B30", color: "#FF3B30", label: "THÙNG TÁO ĐỎ #05 (Khu B3 - Giữa)" },
    { position: [0.7, -1.4, 1.0] as [number, number, number], fruitColor: "#FF3B30", color: "#FF3B30", label: "THÙNG TÁO ĐỎ #06 (Khu C1 - Sau)" },
    { position: [-0.7, -1.4, 3.0] as [number, number, number], fruitColor: "#FF3B30", color: "#FF3B30", label: "THÙNG TÁO ĐỎ #07 (Khu C2 - Sau)" },
    { position: [0.7, -1.4, 3.0] as [number, number, number], fruitColor: "#FF3B30", color: "#FF3B30", label: "THÙNG TÁO ĐỎ #08 (Khu C3 - Sau)" },
  ];

  return (
    <group>
      {/* Semi-transparent Container Wall */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[width, height, length]} />
        <meshBasicMaterial
          color="#C8D6E5"
          transparent
          opacity={0.22}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Container Wireframe Outlines */}
      <Line
        points={[
          [-width / 2, -height / 2, -length / 2],
          [width / 2, -height / 2, -length / 2],
          [width / 2, height / 2, -length / 2],
          [-width / 2, height / 2, -length / 2],
          [-width / 2, -height / 2, -length / 2],
        ]}
        color="#16A34A"
        lineWidth={1.5}
      />
      <Line
        points={[
          [-width / 2, -height / 2, length / 2],
          [width / 2, -height / 2, length / 2],
          [width / 2, height / 2, length / 2],
          [-width / 2, height / 2, length / 2],
          [-width / 2, -height / 2, length / 2],
        ]}
        color="#16A34A"
        lineWidth={1.5}
      />
      {/* Longitudinal lines */}
      <Line
        points={[
          [-width / 2, -height / 2, -length / 2],
          [-width / 2, -height / 2, length / 2],
        ]}
        color="#94A3B8"
        lineWidth={1}
      />
      <Line
        points={[
          [width / 2, -height / 2, -length / 2],
          [width / 2, -height / 2, length / 2],
        ]}
        color="#94A3B8"
        lineWidth={1}
      />
      <Line
        points={[
          [-width / 2, height / 2, -length / 2],
          [-width / 2, height / 2, length / 2],
        ]}
        color="#94A3B8"
        lineWidth={1}
      />
      <Line
        points={[
          [width / 2, height / 2, -length / 2],
          [width / 2, height / 2, length / 2],
        ]}
        color="#94A3B8"
        lineWidth={1}
      />

      {/* Internal Grid Support Lines */}
      {[-3, 0, 3].map((zPos, idx) => (
        <group key={idx} position={[0, 0, zPos]}>
          <Line
            points={[
              [-width / 2, -height / 2, 0],
              [width / 2, -height / 2, 0],
            ]}
            color="#CBD5E1"
            lineWidth={1}
          />
          <Line
            points={[
              [-width / 2, height / 2, 0],
              [width / 2, height / 2, 0],
            ]}
            color="#CBD5E1"
            lineWidth={1}
          />
          <Line
            points={[
              [0, -height / 2, 0],
              [0, height / 2, 0],
            ]}
            color="#E2E8F0"
            lineWidth={1}
          />
        </group>
      ))}

      {/* Cargo Crates filled with fruits */}
      {crates.map((crate, idx) => (
        <CargoBox
          key={idx}
          position={crate.position}
          color={crate.color}
          fruitColor={crate.fruitColor}
          onClick={() => onNodeSelect(crate.label)}
        />
      ))}

      {/* Ventilation Fans (placed at front container partition Z = -length/2) */}
      <Fan active={isFanActive} position={[-1, 0.8, -length / 2 + 0.05]} />
      <Fan active={isFanActive} position={[1, 0.8, -length / 2 + 0.05]} />

      {/* Sensor Node 1: Front (Simulated Node) */}
      <SensorNode
        position={[-0.8, -0.4, -2.5]}
        status={state.nodeStatus}
        onClick={() => onNodeSelect("NODE 01 (Vùng trước - Gần quạt thông gió)")}
      />

      {/* Sensor Node 2: Middle (Idle/Static Node) */}
      <SensorNode
        position={[0.8, 0.2, 0]}
        status="NORMAL"
        onClick={() => onNodeSelect("NODE 02 (Vùng trung tâm - Ở đỉnh)")}
      />

      {/* Sensor Node 3: Rear (Idle/Static Node) */}
      <SensorNode
        position={[-0.6, -0.2, 2.5]}
        status="NORMAL"
        onClick={() => onNodeSelect("NODE 03 (Vùng sau - Khoang sau container)")}
      />
    </group>
  );
}

export default function ThreeContainer({ state }: ThreeContainerProps) {
  const [mounted, setMounted] = useState(false);
  const [selectedNode, setSelectedNode] = useState<string>("NODE 01 (Vùng trước - Gần quạt thông gió)");

  useEffect(() => {
    const handle = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => cancelAnimationFrame(handle);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-[320px] md:h-[400px] bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center text-xs text-gray-400">
        Đang khởi động mô hình 3D...
      </div>
    );
  }

  return (
    <div className="card-flat p-5 flex flex-col gap-4 relative">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest">
          Mô phỏng 3D Container Lạnh
        </h2>
        <span className="text-[10px] text-gray-400">Kéo để xoay · Cuộn để zoom</span>
      </div>

      <div className="w-full h-[320px] md:h-[400px] bg-gradient-to-br from-slate-50 to-blue-50 rounded-lg relative overflow-hidden border border-gray-100">
        <Canvas camera={{ position: [7, 5, 8], fov: 40 }} gl={{ alpha: true }}>
          <color attach="background" args={["#F8FAFC"]} />
          <ambientLight intensity={1.2} />
          <directionalLight position={[8, 10, 8]} intensity={1.0} />
          <pointLight position={[-5, 5, -5]} intensity={0.6} color="#E0F2FE" />
          <ContainerModel state={state} onNodeSelect={setSelectedNode} />
          <OrbitControls enableZoom={true} maxPolarAngle={Math.PI / 2} minDistance={4} maxDistance={15} />
        </Canvas>

        {/* HUD Info Box — light card style */}
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg shadow-md p-3 text-[11px] text-gray-600 max-w-[260px]">
          <div className="font-bold text-gray-800 text-xs mb-1.5 border-b border-gray-100 pb-1.5">
            {selectedNode.includes("THÙNG") ? "📦 Thông tin lô nông sản" : "📡 Thông tin Sensor Node"}
          </div>
          <div className="text-green-600 font-semibold mb-1 text-[11px] leading-tight">{selectedNode}</div>
          <div className="leading-relaxed text-gray-500">
            {selectedNode.includes("NODE 01") ? (
              <>
                Trạng thái: <span className={state.nodeStatus === "NORMAL" ? "text-green-600 font-semibold" : "text-red-500 font-semibold"}>{state.nodeStatus === "NORMAL" ? "Bình thường" : state.nodeStatus === "WARNING" ? "Cảnh báo" : "Nguy hiểm"}</span><br />
                C2H4: {state.c2h4} ppm · {state.temperatureAmbient}°C<br />
                Độ ẩm: {state.humidity}% RH · ESP-NOW
              </>
            ) : selectedNode.includes("NODE 02") || selectedNode.includes("NODE 03") ? (
              <>
                Trạng thái: <span className="text-green-600 font-semibold">Bình thường</span><br />
                C2H4: 1.5 ppm · 3.9°C<br />
                Độ ẩm: 85% RH · ESP-NOW
              </>
            ) : selectedNode.includes("THÙNG") ? (
              <>
                Lô hàng: Táo đỏ Fuji nhập khẩu<br />
                Nhiệt độ tối ưu: 0°C – 3°C<br />
                Độ ẩm tối ưu: 90% – 95% RH
              </>
            ) : (
              <>Nhấn vào node hoặc thùng để xem thông tin</>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
