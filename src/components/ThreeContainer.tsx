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

// Interactive Sensor Node component
function SensorNode({
  position,
  status,
  onClick,
}: {
  position: [number, number, number];
  status: "NORMAL" | "WARNING" | "CRITICAL";
  onClick: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Pulse effect based on time
  useFrame(({ clock }) => {
    if (meshRef.current) {
      const scale = 1 + Math.sin(clock.getElapsedTime() * 5) * 0.12;
      meshRef.current.scale.set(scale, scale, scale);
    }
  });

  let nodeColor = "#4AF626"; // NORMAL
  if (status === "CRITICAL") nodeColor = "#FF2A2A";
  else if (status === "WARNING") nodeColor = "#F59E0B";

  return (
    <group position={position}>
      {/* Node Sphere */}
      <mesh
        ref={meshRef}
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
        <sphereGeometry args={[hovered ? 0.35 : 0.28, 32, 32]} />
        <meshBasicMaterial color={nodeColor} />
      </mesh>

      {/* Ring Aura */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.38, 0.42, 32]} />
        <meshBasicMaterial color={nodeColor} transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>

      {/* Connection line to container roof */}
      <Line
        points={[
          [0, 0, 0],
          [0, 1.8 - position[1], 0],
        ]}
        color={hovered ? "#EAEAEA" : "rgba(234,234,234,0.15)"}
        lineWidth={1}
      />
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
    { position: [-0.7, -1.4, -3.0] as [number, number, number], fruitColor: "#FF3B30", color: "#FF3B30", label: "THÙNG TÁO ĐỎ #01 (Vùng trước)" },
    { position: [0.7, -1.4, -3.0] as [number, number, number], fruitColor: "#FF9500", color: "#FF9500", label: "THÙNG CAM VÀNG #01 (Vùng trước)" },
    { position: [-0.7, -1.4, -1.0] as [number, number, number], fruitColor: "#34C759", color: "#34C759", label: "THÙNG XOÀI XANH #01 (Vùng trung tâm)" },
    { position: [0.7, -1.4, -1.0] as [number, number, number], fruitColor: "#FF3B30", color: "#FF3B30", label: "THÙNG TÁO ĐỎ #02 (Vùng trung tâm)" },
    { position: [-0.7, -1.4, 1.0] as [number, number, number], fruitColor: "#FF9500", color: "#FF9500", label: "THÙNG CAM VÀNG #02 (Vùng trung tâm)" },
    { position: [0.7, -1.4, 1.0] as [number, number, number], fruitColor: "#34C759", color: "#34C759", label: "THÙNG XOÀI XANH #02 (Vùng sau)" },
    { position: [-0.7, -1.4, 3.0] as [number, number, number], fruitColor: "#FF3B30", color: "#FF3B30", label: "THÙNG TÁO ĐỎ #03 (Vùng sau)" },
    { position: [0.7, -1.4, 3.0] as [number, number, number], fruitColor: "#FF9500", color: "#FF9500", label: "THÙNG CAM VÀNG #03 (Vùng sau)" },
  ];

  return (
    <group>
      {/* Semi-transparent Container Wall Grid */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[width, height, length]} />
        <meshBasicMaterial
          color="#121212"
          transparent
          opacity={0.35}
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
        color="#FF2A2A"
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
        color="#FF2A2A"
        lineWidth={1.5}
      />
      {/* Longitudinal lines */}
      <Line
        points={[
          [-width / 2, -height / 2, -length / 2],
          [-width / 2, -height / 2, length / 2],
        ]}
        color="rgba(234, 234, 234, 0.4)"
        lineWidth={1}
      />
      <Line
        points={[
          [width / 2, -height / 2, -length / 2],
          [width / 2, -height / 2, length / 2],
        ]}
        color="rgba(234, 234, 234, 0.4)"
        lineWidth={1}
      />
      <Line
        points={[
          [-width / 2, height / 2, -length / 2],
          [-width / 2, height / 2, length / 2],
        ]}
        color="rgba(234, 234, 234, 0.4)"
        lineWidth={1}
      />
      <Line
        points={[
          [width / 2, height / 2, -length / 2],
          [width / 2, height / 2, length / 2],
        ]}
        color="rgba(234, 234, 234, 0.4)"
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
            color="rgba(234,234,234,0.1)"
            lineWidth={1}
          />
          <Line
            points={[
              [-width / 2, height / 2, 0],
              [width / 2, height / 2, 0],
            ]}
            color="rgba(234,234,234,0.1)"
            lineWidth={1}
          />
          <Line
            points={[
              [0, -height / 2, 0],
              [0, height / 2, 0],
            ]}
            color="rgba(234,234,234,0.05)"
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
      <div className="w-full h-[320px] md:h-[400px] bg-[#0A0A0A] border border-neutral-800 flex items-center justify-center font-mono text-xs text-neutral-500">
        &gt;&gt; ĐANG KHỞI ĐỘNG HỆ THỐNG CARRIER 3D...
      </div>
    );
  }

  return (
    <div className="w-full border border-neutral-800 bg-[#0A0A0A] p-4 flex flex-col gap-4 font-mono relative">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
        <span className="text-xs uppercase tracking-widest text-neutral-400 font-bold">
          [ 02 / MÔ PHỎNG LAYOUT CARRIER 3D CONTAINER LẠNH ]
        </span>
        <span className="text-[10px] text-neutral-500">[ CHUỘT TRÁI: XOAY | CHUỘT GIỮA: ZOOM ]</span>
      </div>

      <div className="w-full h-[320px] md:h-[400px] border border-neutral-900 bg-[#050505] relative overflow-hidden">
        <Canvas camera={{ position: [7, 5, 8], fov: 40 }}>
          <ambientLight intensity={0.6} />
          <pointLight position={[10, 10, 10]} intensity={1.5} />
          <ContainerModel state={state} onNodeSelect={setSelectedNode} />
          <OrbitControls enableZoom={true} maxPolarAngle={Math.PI / 2} minDistance={4} maxDistance={15} />
        </Canvas>

        {/* HUD Info Box inside WebGL layer */}
        <div className="absolute bottom-2 left-2 border border-neutral-800 bg-[#0A0A0A] bg-opacity-95 p-3 text-[10px] text-neutral-400 max-w-[280px]">
          <div className="font-bold text-white uppercase mb-1 border-b border-neutral-800 pb-1">
            {selectedNode.includes("THÙNG") ? "THÔNG TIN LÔ NÔNG SẢN" : "THÔNG TIN SENSOR NODE"}
          </div>
          <div className="text-[#4AF626] font-bold">{selectedNode}</div>
          <div className="mt-1 leading-normal">
            {selectedNode.includes("NODE 01") ? (
              <>
                Trạng thái: {state.nodeStatus === "NORMAL" ? "BÌNH THƯỜNG" : state.nodeStatus === "WARNING" ? "CẢNH BÁO" : "NGUY HIỂM"}<br />
                C2H4: {state.c2h4} ppm | Temp: {state.temperatureAmbient}°C<br />
                Độ ẩm: {state.humidity}% RH<br />
                Giao thức: Mesh (ESP-NOW)
              </>
            ) : selectedNode.includes("NODE 02") || selectedNode.includes("NODE 03") ? (
              <>
                Trạng thái: BÌNH THƯỜNG (Node phụ)<br />
                C2H4: 1.5 ppm | Temp: 3.9°C<br />
                Độ ẩm: 85% RH<br />
                Giao thức: Mesh (ESP-NOW)
              </>
            ) : selectedNode.includes("TÁO ĐỎ") ? (
              <>
                Lô hàng: Táo Fuji tươi<br />
                Nhiệt độ tối ưu: 0°C - 3°C<br />
                Nhạy Ethylene: Cao (Dễ hỏng)<br />
                Chỉ số hô hấp: Trung bình
              </>
            ) : selectedNode.includes("CAM VÀNG") ? (
              <>
                Lô hàng: Cam Cara vàng<br />
                Nhiệt độ tối ưu: 4°C - 6°C<br />
                Nhạy Ethylene: Thấp<br />
                Chỉ số hô hấp: Thấp
              </>
            ) : selectedNode.includes("XOÀI XANH") ? (
              <>
                Lô hàng: Xoài Cát Chu chín xanh<br />
                Nhiệt độ tối ưu: 10°C - 12°C<br />
                Nhạy Ethylene: Rất cao (Tỏa khí nhiều)<br />
                Chỉ số hô hấp: Rất cao
              </>
            ) : (
              <>Không có thông tin chi tiết</>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
