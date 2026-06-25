"use client";

import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Line, Html } from "@react-three/drei";
import * as THREE from "three";
import { TelemetryState } from "@/hooks/useTelemetrySim";

interface ThreeContainerProps {
  state: TelemetryState;
}

// Device info type
export interface DeviceInfo {
  id: string;
  name: string;
  icon: string;
  specs: { label: string; value: string }[];
}

// ── ESP32 PCB Board (Prominent) ─────────────────────────────────────────────
function ESP32Board({ position, onClick }: { position: [number, number, number]; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  const glowRef = useRef<THREE.Mesh>(null);
  const led1Ref = useRef<THREE.Mesh>(null);
  const led2Ref = useRef<THREE.Mesh>(null);

  // Pulsing glow + blinking LEDs
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (glowRef.current) {
      const s = 1 + Math.sin(t * 2) * 0.08;
      glowRef.current.scale.set(s, 1, s);
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity = 0.18 + Math.sin(t * 2) * 0.08;
    }
    if (led1Ref.current) {
      (led1Ref.current.material as THREE.MeshBasicMaterial).color.setHex(
        Math.sin(t * 4) > 0 ? 0x00ff44 : 0x004410
      );
    }
    if (led2Ref.current) {
      (led2Ref.current.material as THREE.MeshBasicMaterial).color.setHex(
        Math.sin(t * 1.5 + 1) > 0 ? 0x0088ff : 0x001133
      );
    }
  });

  const S = 2.2; // scale factor
  return (
    <group position={position}>
      {/* Click zone */}
      <mesh
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={(e) => { e.stopPropagation(); setHovered(false); document.body.style.cursor = 'auto'; }}
        visible={false}
      >
        <boxGeometry args={[0.7 * S, 0.3 * S, 0.4 * S]} />
      </mesh>

      {/* Glow halo ring underneath */}
      <mesh ref={glowRef} position={[0, -0.04 * S, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.28 * S, 0.48 * S, 40]} />
        <meshBasicMaterial color="#00FF88" transparent opacity={0.22} side={THREE.DoubleSide} />
      </mesh>

      {/* PCB main board — bright green with metallic sheen */}
      <mesh>
        <boxGeometry args={[0.55 * S, 0.035 * S, 0.28 * S]} />
        <meshStandardMaterial
          color={hovered ? "#00FF88" : "#05C46B"}
          roughness={0.2}
          metalness={0.4}
          emissive={hovered ? "#004D20" : "#002008"}
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* PCB copper trace lines (decorative) */}
      {[-0.08, 0, 0.08].map((z, i) => (
        <mesh key={i} position={[0.1, 0.021 * S, z * S]}>
          <boxGeometry args={[0.25 * S, 0.003, 0.008 * S]} />
          <meshBasicMaterial color="#C8860A" />
        </mesh>
      ))}

      {/* ESP32 module (main IC block) */}
      <mesh position={[0.04 * S, 0.04 * S, 0]}>
        <boxGeometry args={[0.32 * S, 0.04 * S, 0.18 * S]} />
        <meshStandardMaterial color={hovered ? "#444" : "#1A1A1A"} roughness={0.2} metalness={0.6} />
      </mesh>
      {/* Module shield mesh lines */}
      {[-0.06, 0, 0.06].map((z, i) => (
        <mesh key={i} position={[0.04 * S, 0.062 * S, z * S]}>
          <boxGeometry args={[0.005, 0.02 * S, 0.002]} />
          <meshBasicMaterial color="#888" />
        </mesh>
      ))}

      {/* CPU/SOC chip */}
      <mesh position={[-0.14 * S, 0.04 * S, 0]}>
        <boxGeometry args={[0.13 * S, 0.035 * S, 0.13 * S]} />
        <meshStandardMaterial color="#111" roughness={0.15} metalness={0.7} />
      </mesh>
      {/* Chip label (small box) */}
      <mesh position={[-0.14 * S, 0.058 * S, 0]}>
        <boxGeometry args={[0.07 * S, 0.002, 0.07 * S]} />
        <meshBasicMaterial color="#FFFFFF" />
      </mesh>

      {/* WiFi antenna — tall and prominent */}
      <mesh position={[0.28 * S, 0.1 * S, 0]}>
        <boxGeometry args={[0.022 * S, 0.18 * S, 0.015 * S]} />
        <meshStandardMaterial color="#D0D0D0" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Antenna tip */}
      <mesh position={[0.28 * S, 0.2 * S, 0]}>
        <sphereGeometry args={[0.018 * S, 8, 8]} />
        <meshBasicMaterial color="#AAAAAA" />
      </mesh>

      {/* USB Micro port */}
      <mesh position={[-0.28 * S, 0.025 * S, 0]}>
        <boxGeometry args={[0.025 * S, 0.04 * S, 0.07 * S]} />
        <meshStandardMaterial color="#888" metalness={0.7} />
      </mesh>

      {/* Pin rows — both sides */}
      {[-0.1, -0.05, 0, 0.05, 0.1, 0.15].map((x, i) => (
        <group key={i}>
          <mesh position={[x * S, 0.045 * S, 0.14 * S]}>
            <boxGeometry args={[0.015 * S, 0.055 * S, 0.015 * S]} />
            <meshStandardMaterial color="#C8A020" metalness={0.95} />
          </mesh>
          <mesh position={[x * S, 0.045 * S, -0.14 * S]}>
            <boxGeometry args={[0.015 * S, 0.055 * S, 0.015 * S]} />
            <meshStandardMaterial color="#C8A020" metalness={0.95} />
          </mesh>
        </group>
      ))}

      {/* Green power LED — blinking */}
      <mesh ref={led1Ref} position={[0.18 * S, 0.052 * S, 0.08 * S]}>
        <sphereGeometry args={[0.022 * S, 12, 12]} />
        <meshBasicMaterial color="#00FF44" />
      </mesh>
      {/* Blue activity LED */}
      <mesh ref={led2Ref} position={[0.18 * S, 0.052 * S, -0.04 * S]}>
        <sphereGeometry args={[0.018 * S, 12, 12]} />
        <meshBasicMaterial color="#0088FF" />
      </mesh>

      {/* Capacitors (small cylinders) */}
      {[-0.06, 0.0].map((z, i) => (
        <mesh key={i} position={[-0.1 * S, 0.055 * S, z * S]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.018 * S, 0.018 * S, 0.04 * S, 10]} />
          <meshStandardMaterial color={i === 0 ? "#222255" : "#552222"} roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
}

// ── Relay Module (Prominent) ──────────────────────────────────────────────
function RelayModule({
  position,
  active,
  onClick,
}: {
  position: [number, number, number];
  active: boolean;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const glowRef = useRef<THREE.Mesh>(null);
  const led1Ref = useRef<THREE.Mesh>(null);
  const led2Ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    // Glow ring pulses red when active
    if (glowRef.current) {
      const s = 1 + Math.sin(t * (active ? 3 : 1)) * 0.1;
      glowRef.current.scale.set(s, 1, s);
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity =
        active ? 0.25 + Math.sin(t * 3) * 0.12 : 0.08;
    }
    // LED 1 blinks fast when active
    if (led1Ref.current) {
      (led1Ref.current.material as THREE.MeshBasicMaterial).color.setHex(
        active ? (Math.sin(t * 6) > 0 ? 0xff2200 : 0x220000) : 0x111111
      );
    }
    // LED 2 blinks offset
    if (led2Ref.current) {
      (led2Ref.current.material as THREE.MeshBasicMaterial).color.setHex(
        active ? (Math.sin(t * 6 + Math.PI) > 0 ? 0xff2200 : 0x220000) : 0x111111
      );
    }
  });

  const R = 2.0; // scale
  return (
    <group position={position}>
      {/* Click zone */}
      <mesh
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={(e) => { e.stopPropagation(); setHovered(false); document.body.style.cursor = 'auto'; }}
        visible={false}
      >
        <boxGeometry args={[0.6 * R, 0.4 * R, 0.35 * R]} />
      </mesh>

      {/* Glow halo (red when active, dim when off) */}
      <mesh ref={glowRef} position={[0, -0.05 * R, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.22 * R, 0.42 * R, 40]} />
        <meshBasicMaterial
          color={active ? "#FF3300" : "#884400"}
          transparent
          opacity={active ? 0.28 : 0.08}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* PCB base */}
      <mesh>
        <boxGeometry args={[0.44 * R, 0.03 * R, 0.22 * R]} />
        <meshStandardMaterial
          color={hovered ? "#38bdf8" : "#0091FF"}
          roughness={0.2}
          metalness={0.3}
          emissive={active ? "#003A70" : "#001A38"}
          emissiveIntensity={0.6}
        />
      </mesh>

      {/* PCB copper traces */}
      {[-0.04, 0.04].map((z, i) => (
        <mesh key={i} position={[0, 0.018 * R, z * R]}>
          <boxGeometry args={[0.38 * R, 0.003, 0.006 * R]} />
          <meshBasicMaterial color="#C8860A" />
        </mesh>
      ))}

      {/* Relay coil blocks x2 */}
      {[-0.12 * R, 0.12 * R].map((x, i) => (
        <group key={i} position={[x, 0.055 * R, 0]}>
          {/* Main coil body */}
          <mesh>
            <boxGeometry args={[0.13 * R, 0.08 * R, 0.17 * R]} />
            <meshStandardMaterial
              color={active ? (hovered ? "#333" : "#1A1A1A") : "#222"}
              roughness={0.4}
              emissive={active ? "#220000" : "#000"}
              emissiveIntensity={0.6}
            />
          </mesh>
          {/* Coil label stripe */}
          <mesh position={[0, 0.045 * R, 0]}>
            <boxGeometry args={[0.13 * R, 0.008 * R, 0.04 * R]} />
            <meshBasicMaterial color={active ? "#FF4400" : "#555"} />
          </mesh>
          {/* Status LED */}
          <mesh ref={i === 0 ? led1Ref : led2Ref} position={[0, 0.052 * R, -0.06 * R]}>
            <sphereGeometry args={[0.022 * R, 12, 12]} />
            <meshBasicMaterial color={active ? "#FF2200" : "#1A0000"} />
          </mesh>
          {/* Armature contact pin */}
          <mesh position={[0, -0.05 * R, 0.07 * R]}>
            <cylinderGeometry args={[0.012 * R, 0.012 * R, 0.06 * R, 8]} />
            <meshStandardMaterial color="#C8A020" metalness={0.9} />
          </mesh>
        </group>
      ))}

      {/* Optocoupler chip */}
      <mesh position={[0, 0.04 * R, 0.07 * R]}>
        <boxGeometry args={[0.08 * R, 0.03 * R, 0.05 * R]} />
        <meshStandardMaterial color="#111" roughness={0.2} metalness={0.5} />
      </mesh>

      {/* Screw terminals (6 total) */}
      {[-0.17 * R, -0.07 * R, 0.03 * R, 0.13 * R].map((x, i) => (
        <group key={i} position={[x, 0.04 * R, 0.1 * R]}>
          <mesh>
            <boxGeometry args={[0.05 * R, 0.06 * R, 0.05 * R]} />
            <meshStandardMaterial color="#777" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Screw head */}
          <mesh position={[0, 0.038 * R, 0]}>
            <cylinderGeometry args={[0.018 * R, 0.018 * R, 0.01 * R, 8]} />
            <meshStandardMaterial color="#555" metalness={0.9} />
          </mesh>
          {/* Terminal label color */}
          <mesh position={[0, -0.036 * R, 0]}>
            <boxGeometry args={[0.048 * R, 0.006 * R, 0.048 * R]} />
            <meshBasicMaterial color={i < 2 ? "#0044FF" : "#FF4400"} />
          </mesh>
        </group>
      ))}

      {/* Flyback diode */}
      <mesh position={[-0.16 * R, 0.055 * R, -0.06 * R]}>
        <cylinderGeometry args={[0.016 * R, 0.016 * R, 0.07 * R, 8]} />
        <meshStandardMaterial color="#333" roughness={0.3} />
      </mesh>
      {/* Diode stripe */}
      <mesh position={[-0.16 * R, 0.055 * R, -0.04 * R]}>
        <cylinderGeometry args={[0.017 * R, 0.017 * R, 0.006 * R, 8]} />
        <meshBasicMaterial color="#CCCCCC" />
      </mesh>
    </group>
  );
}

// ── Evaporator / Cooling Unit ──────────────────────────────────────────────
function CoolingUnit({ position, onClick }: { position: [number, number, number]; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <group position={position}>
      {/* Click zone */}
      <mesh onClick={(e) => { e.stopPropagation(); onClick(); }} onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }} onPointerOut={(e) => { e.stopPropagation(); setHovered(false); document.body.style.cursor = 'auto'; }} visible={false}>
        <boxGeometry args={[2.4, 0.5, 0.7]} />
      </mesh>
      {/* Main housing */}
      <mesh>
        <boxGeometry args={[2.2, 0.35, 0.5]} />
        <meshStandardMaterial color={hovered ? "#D8E8F0" : "#C0C8D0"} roughness={0.3} metalness={0.4} />
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
  onClick,
}: {
  active: boolean;
  position: [number, number, number];
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const bladeRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (bladeRef.current) {
      bladeRef.current.rotation.z += delta * (active ? 14 : 0.4);
    }
  });

  return (
    <group position={position}>
      {/* Click zone */}
      <mesh onClick={(e) => { e.stopPropagation(); onClick(); }} onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }} onPointerOut={(e) => { e.stopPropagation(); setHovered(false); document.body.style.cursor = 'auto'; }} visible={false}>
        <cylinderGeometry args={[0.9, 0.9, 0.2, 16]} />
      </mesh>
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
interface SensorNodeProps {
  position: [number, number, number];
  status: "NORMAL" | "WARNING" | "CRITICAL";
  onClick: () => void;
  hanging?: boolean;
  hasMiniFan?: boolean;
  isSelected?: boolean;
}

function SensorNode({
  position,
  status,
  onClick,
  hanging = true,
  hasMiniFan = false,
  isSelected = false,
}: SensorNodeProps) {
  const [hovered, setHovered] = useState(false);
  const ledRef = useRef<THREE.Mesh>(null);
  const fanRef = useRef<THREE.Group>(null);

  useFrame(({ clock }, delta) => {
    if (ledRef.current) {
      const s = 1 + Math.sin(clock.getElapsedTime() * 6) * 0.2;
      ledRef.current.scale.set(s, s, s);
    }
    if (hasMiniFan && fanRef.current) {
      // Spin the mini fan blades around its local Z axis
      fanRef.current.rotation.z += delta * 18;
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

      {/* Mounting rod (to ceiling) or Stand (to floor) */}
      {hanging ? (
        <>
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
        </>
      ) : (
        <>
          <Line
            points={[[0, 0, 0], [0, -1.8 - position[1], 0]]}
            color={hovered ? "#4AF626" : "#666666"}
            lineWidth={2}
          />
          {/* Floor stand base */}
          <mesh position={[0, -1.8 - position[1], 0]}>
            <cylinderGeometry args={[0.15, 0.15, 0.02, 12]} />
            <meshStandardMaterial color="#64748B" metalness={0.5} roughness={0.4} />
          </mesh>
        </>
      )}

      {/* Enclosure body */}
      <group rotation={[0.05, hovered ? Math.PI / 4 : 0.2, 0.05]} scale={hasMiniFan ? 1.55 : 1.0}>
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
        {/* Ground/stand projection ring */}
        <mesh position={[0, -0.16, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.22, 0.26, 32]} />
          <meshBasicMaterial color={statusColor} transparent opacity={hovered ? 0.9 : 0.4} side={THREE.DoubleSide} />
        </mesh>

        {/* Mini Fan Integration */}
        {hasMiniFan && (
          <group position={[0, -0.15, 0]}>
            {/* Mini fan protective frame */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.22, 0.25, 32]} />
              <meshBasicMaterial color="#FF3B30" side={THREE.DoubleSide} />
            </mesh>
            {/* Spinning blades group */}
            <group ref={fanRef}>
              {[0, 1, 2, 3].map((idx) => (
                <mesh key={idx} rotation={[0, 0, (idx * Math.PI) / 2]}>
                  <boxGeometry args={[0.41, 0.045, 0.012]} />
                  <meshStandardMaterial color="#475569" roughness={0.3} />
                </mesh>
              ))}
            </group>
            {/* Central cap */}
            <mesh>
              <sphereGeometry args={[0.05, 12, 12]} />
              <meshStandardMaterial color="#FF3B30" />
            </mesh>
          </group>
        )}
      </group>

      {/* Floating 3D HTML Label */}
      {hasMiniFan && isSelected && (
        <Html position={[0, 0.6, 0]} center distanceFactor={8}>
          <div className="bg-orange-600/90 text-white font-bold text-[8px] uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-lg border border-orange-400/50 whitespace-nowrap pointer-events-none select-none flex items-center gap-1.5 backdrop-blur-xs">
            <span className="inline-block animate-spin" style={{ animationDuration: "3s" }}>🌀</span>
            <span>Node có cánh quạt</span>
          </div>
        </Html>
      )}
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
  selectedId,
}: {
  state: TelemetryState;
  onNodeSelect: (label: string) => void;
  selectedId: string | null;
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
      <CoolingUnit position={[0, H / 2 - 0.3, -L / 2 + 0.6]} onClick={() => onNodeSelect("COOLING")} />

      {/* ── Fans ── */}
      <Fan active={isFanActive} position={[-1, 0.8, -L / 2 + 0.08]} onClick={() => onNodeSelect("FAN1")} />
      <Fan active={isFanActive} position={[1, 0.8, -L / 2 + 0.08]} onClick={() => onNodeSelect("FAN2")} />

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
      {/* ESP32 — placed prominently on the side wall, larger and visible */}
      <ESP32Board position={[W / 2 - 0.05, 0.5, -L / 2 + 2.5]} onClick={() => onNodeSelect("ESP32")} />
      {/* Relay module below ESP32 */}
      {/* Relay — moved to prominent open position */}
      <RelayModule position={[W / 2 - 0.05, 0.1, -L / 2 + 2.5]} active={isFanActive} onClick={() => onNodeSelect("RELAY")} />

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
        <CargoBox key={i} position={c.pos} onClick={() => onNodeSelect(`BOX${i + 1}`)} />
      ))}

      {/* ── Sensor Nodes ── */}
      <SensorNode position={[-0.8, -1.4, 0]} status={state.nodeStatus} onClick={() => onNodeSelect("NODE01")} hanging={false} hasMiniFan={true} isSelected={selectedId === "NODE01"} />
      <SensorNode position={[0.8, 0.4, 0]} status="NORMAL" onClick={() => onNodeSelect("NODE02")} hasMiniFan={true} isSelected={selectedId === "NODE02"} />
      <SensorNode position={[1.2, -1.4, 3.5]} status="NORMAL" onClick={() => onNodeSelect("NODE03")} hanging={false} isSelected={selectedId === "NODE03"} />
      <SensorNode position={[-1.2, 1.4, -3.8]} status="WARNING" onClick={() => onNodeSelect("NODE04")} isSelected={selectedId === "NODE04"} />
    </group>
  );
}

// ── Main Export ────────────────────────────────────────────────────────────
export default function ThreeContainer({ state }: ThreeContainerProps) {
  const [mounted, setMounted] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    const h = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(h);
  }, []);

  useEffect(() => {
    if (isExpanded) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isExpanded]);

  if (!mounted) {
    return (
      <div className="w-full h-[380px] bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center text-xs text-gray-400">
        Đang khởi động mô hình 3D...
      </div>
    );
  }

  // Device info map
  const deviceMap: Record<string, { icon: string; name: string; rows: [string, string][] }> = {
    ESP32: {
      icon: "📶",
      name: "Vi điều khiển ESP32-WROOM-32",
      rows: [
        ["CPU", "Xtensa LX6 240 MHz dual-core"],
        ["Flash", "4 MB SPI Flash"],
        ["RAM", "520 KB SRAM"],
        ["Wi-Fi", "802.11 b/g/n 2.4 GHz"],
        ["Bluetooth", "BT 4.2 + BLE"],
        ["GPIO", "34 lập trình được"],
        ["Nguồn", "3.3V · 500 mA max"],
        ["Trạng thái", "Online — MQTT connected"],
      ],
    },
    RELAY: {
      icon: "⚡",
      name: "Relay Module 2 kênh — SRD-05VDC",
      rows: [
        ["🔵 PCB", "FR4 xanh dương · 5V logic"],
        ["⚫ Cuộn relay", `2 cuộn SRD · ${state.fanRelay === "ON" ? "🔴 ĐANG KÍCH" : "⭕ Chờ"}`],
        ["🔴 LED kênh 1", `Quạt thông gió · ${state.fanRelay === "ON" ? "✅ Đóng" : "❌ Mở"}`],
        ["🔴 LED kênh 2", `Dàn lạnh · ${state.fanRelay === "ON" ? "✅ Đóng" : "❌ Mở"}`],
        ["🟡 Terminal", "NO/NC/COM · 10A 250VAC"],
        ["⚪ Diode", "Flyback · chống ngược dòng"],
        ["🔲 Opto", "Cách ly điện quang"],
        ["⚡ Kích hoạt", "C2H4 > 25 ppm → ESP32 gửi HIGH"],
      ],
    },
    FAN1: {
      icon: "🌀",
      name: "Quạt thông gió #1 (Trái)",
      rows: [
        ["Loại", "Axial Fan 220VAC"],
        ["Công suất", "45W"],
        ["Lưu lượng", "850 m³/h"],
        ["Tốc độ", state.fanRelay === "ON" ? "1450 RPM" : "0 RPM (Standby)"],
        ["Trạng thái", state.fanRelay === "ON" ? "🟢 Đang chạy" : "🔴 Dừng"],
        ["Điều khiển bởi", "Relay kênh 1 ← ESP32"],
      ],
    },
    FAN2: {
      icon: "🌀",
      name: "Quạt thông gió #2 (Phải)",
      rows: [
        ["Loại", "Axial Fan 220VAC"],
        ["Công suất", "45W"],
        ["Lưu lượng", "850 m³/h"],
        ["Tốc độ", state.fanRelay === "ON" ? "1450 RPM" : "0 RPM (Standby)"],
        ["Trạng thái", state.fanRelay === "ON" ? "🟢 Đang chạy" : "🔴 Dừng"],
        ["song song với", "Quạt #1 — cùng relay"],
      ],
    },
    COOLING: {
      icon: "❄️",
      name: "Dàn lạnh Evaporator",
      rows: [
        ["Loại", "Fin-and-Tube Evaporator"],
        ["Gas lạnh", "R404A / R134a"],
        ["Nhiệt độ mục tiêu", "0°C – 4°C"],
        ["Nhiệt độ hiện tại", `${state.temperatureAmbient}°C`],
        ["Số fin", "12 thanh nhôm"],
        ["Ống coolant", "Xanh = lạnh vào · Đỏ = nhiệt ra"],
        ["Trạng thái", state.fanRelay === "ON" ? "🟢 Công suất cao" : "🟡 Standby"],
      ],
    },
    NODE01: {
      icon: "📡",
      name: "Sensor Node 01 — Giữa khoang (Đáy thùng)",
      rows: [
        ["Ethylene (C2H4)", `${state.c2h4} ppm`],
        ["Nhiệt độ", `${state.temperatureAmbient}°C`],
        ["Độ ẩm", `${state.humidity}% RH`],
        ["Giao thức", "Mesh ESP-NOW"],
        ["Trạng thái", state.nodeStatus === "NORMAL" ? "🟢 Bình thường" : state.nodeStatus === "WARNING" ? "🟡 Cảnh báo" : "🔴 Nguy hiểm"],
        ["Vị trí", "Vùng B — Đáy thùng giữa khoang (Có quạt)"],
      ],
    },
    NODE02: {
      icon: "🌀",
      name: "Sensor Node 02 — Giữa khoang (Treo trần)",
      rows: [
        ["Ethylene (C2H4)", "1.5 ppm"],
        ["Nhiệt độ", "3.9°C"],
        ["Độ ẩm", "85% RH"],
        ["Giao thức", "Mesh ESP-NOW"],
        ["Trạng thái", "🟢 Hoạt động (Quạt mini quay)"],
        ["Vị trí", "Vùng B — Đối diện Node 01 (Có quạt)"],
      ],
    },
    NODE03: {
      icon: "📦",
      name: "Sensor Node 03 — Cuối toa xe",
      rows: [
        ["Ethylene (C2H4)", "1.2 ppm"],
        ["Nhiệt độ sàn", "4.1°C"],
        ["Độ ẩm", "87% RH"],
        ["Giao thức", "Mesh ESP-NOW"],
        ["Kiểu lắp", "Đặt dưới sàn (Không treo)"],
        ["Vị trí", "Vùng C — Cuối toa xe (Cận sàn)"],
      ],
    },
    NODE04: {
      icon: "⚠️",
      name: "Sensor Node 04 — Sát trần",
      rows: [
        ["Ethylene (C2H4)", "0.8 ppm"],
        ["Nhiệt độ sát trần", "6.8°C"],
        ["Độ ẩm", "80% RH"],
        ["Giao thức", "Mesh ESP-NOW"],
        ["Trạng thái", "🟡 Tụ nhiệt điểm mù sát trần"],
        ["Vị trí", "Vùng A — Sát trần phía trước (Cạnh dàn lạnh)"],
      ],
    },
  };

  // Add cargo boxes
  for (let i = 1; i <= 8; i++) {
    deviceMap[`BOX${i}`] = {
      icon: "📦",
      name: `Thùng Táo Đỏ #0${i}`,
      rows: [
        ["Hàng hóa", "Táo đỏ Fuji nhập khẩu"],
        ["Nhiệt độ tối ưu", "0°C – 3°C"],
        ["Độ ẩm tối ưu", "90% – 95% RH"],
        ["Nhạy Ethylene", "CAO — Dễ bị chín ép"],
        ["Tối đa C2H4", "< 10 ppm"],
        ["Hạn dùng ước tính", `${state.dslHours > 0 ? state.dslHours : 0} giờ`],
      ],
    };
  }

  const selected = selectedId ? deviceMap[selectedId] : null;

  return (
    <div className={isExpanded 
      ? "fixed inset-0 z-50 bg-[#0A0A0A] p-6 flex flex-col gap-4 w-screen h-screen overflow-hidden" 
      : "card-flat p-5 flex flex-col gap-4 relative"
    }>
      <div className={`flex items-center justify-between border-b pb-3 ${isExpanded ? "border-white/10" : "border-gray-100"}`}>
        <h2 className={`text-xs font-bold uppercase tracking-widest ${isExpanded ? "text-gray-400" : "text-gray-500"}`}>
          Mô phỏng 3D Container Lạnh — ESP32 + Relay
        </h2>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-gray-400">Kéo để xoay · Cuộn để zoom</span>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`text-[10px] font-bold px-2 py-1 rounded transition-all cursor-pointer flex items-center gap-1.5 ${
              isExpanded 
                ? "text-red-400 hover:text-red-300 bg-red-950/40 border border-red-900/30" 
                : "text-blue-500 hover:text-blue-600 bg-blue-50"
            }`}
          >
            {isExpanded ? (
              <>
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 14h6v6M20 10h-6V4M14 10l6-6M10 14l-6 6"/></svg>
                <span>Thu nhỏ</span>
              </>
            ) : (
              <>
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
                <span>Phóng to</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div
        className={`w-full ${isExpanded ? "flex-1" : "h-[420px]"} rounded-xl relative overflow-hidden border ${isExpanded ? "border-white/10" : "border-gray-200"}`}
        style={{ background: "#0A0A0A" }}
      >
        {/* Floating toolbar */}
        <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-black/60 border border-white/10 text-white hover:bg-black/80 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            title={isExpanded ? "Thu nhỏ" : "Phóng to toàn màn hình"}
          >
            {isExpanded ? (
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 14h6v6M20 10h-6V4M14 10l6-6M10 14l-6 6"/></svg>
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
            )}
          </button>
          <button
            onClick={() => setResetKey(prev => prev + 1)}
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-black/60 border border-white/10 text-white hover:bg-black/80 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            title="Đặt lại góc nhìn"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
          </button>
        </div>

        <Canvas key={resetKey} camera={{ position: [8, 6, 10], fov: 38 }}>
          <color attach="background" args={["#0A0A0A"]} />
          <ambientLight intensity={0.7} />
          <pointLight position={[10, 10, 10]} intensity={1.8} />
          <pointLight position={[-8, 4, -6]} intensity={0.8} color="#88AAFF" />
          {/* Green spotlight focused on ESP32 */}
          <pointLight position={[3.5, 2.5, -2]} intensity={3.5} color="#00FF88" distance={4} decay={2} />
          {/* Red spotlight focused on Relay */}
          <pointLight position={[3.5, 2.0, -2.2]} intensity={2.8} color="#FF4400" distance={3.5} decay={2} />
          <ContainerModel state={state} onNodeSelect={(id) => setSelectedId(id)} selectedId={selectedId} />
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

        {/* HUD — detailed specs */}
        {selected ? (
          <div className="absolute bottom-3 left-3 bg-black/85 border border-white/10 rounded-xl p-3 text-[11px] text-gray-300 max-w-[270px] backdrop-blur-sm z-10">
            <div className="flex items-center gap-2 mb-2 border-b border-white/10 pb-2">
              <span className="text-base">{selected.icon}</span>
              <span className="font-bold text-white text-xs leading-tight">{selected.name}</span>
            </div>
            <table className="w-full">
              <tbody>
                {selected.rows.map(([label, value]) => (
                  <tr key={label}>
                    <td className="text-gray-500 pr-2 pb-0.5 whitespace-nowrap">{label}</td>
                    <td className="text-gray-200 pb-0.5 font-medium">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-2 pt-1 border-t border-white/10 text-[10px] text-gray-600">Click vào thiết bị khác để xem thông số</div>
            {/* Relay annotation panel — icon legend */}
            {selectedId === "RELAY" && (
              <div className="mt-2 pt-2 border-t border-orange-500/30">
                <div className="text-[10px] text-orange-400 font-bold mb-1.5 tracking-wider">📋 CHÚ THÍCH LINH KIỆN</div>
                <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[10px]">
                  {[
                    { icon: "🔵", part: "PCB Board",    desc: "Mạch in xanh dương" },
                    { icon: "⚫", part: "Cuộn relay",   desc: "Sinh từ trường đóng tiếp điểm" },
                    { icon: "🔴", part: "LED trạng thái", desc: "Sáng khi relay kích" },
                    { icon: "🟡", part: "Terminal vít",  desc: "Đấu dây tải 220V" },
                    { icon: "⚪", part: "Diode flyback", desc: "Bảo vệ ngược dòng" },
                    { icon: "🔲", part: "Optocoupler",   desc: "Cách ly ESP32 ↔ tải" },
                  ].map(({ icon, part, desc }) => (
                    <div key={part} className="flex items-start gap-1">
                      <span>{icon}</span>
                      <div>
                        <div className="text-gray-300 font-semibold leading-tight">{part}</div>
                        <div className="text-gray-600 leading-tight">{desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-1.5 text-[10px] text-orange-300/70 flex items-center gap-1">
                  <span>{state.fanRelay === "ON" ? "🔴" : "⭕"}</span>
                  <span>{state.fanRelay === "ON" ? "Relay đang ĐÓNG — Tải đang chạy" : "Relay đang MỞ — Tải ngắt điện"}</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="absolute bottom-3 left-3 bg-black/85 border border-white/10 rounded-xl px-3 py-2 text-[10px] text-gray-400 backdrop-blur-sm flex items-center gap-1.5 z-10">
            <span className="animate-pulse text-[#00bcff]">👉</span>
            <span>Nhấp vào bất kỳ linh kiện nào để xem chi tiết</span>
          </div>
        )}
      </div>

      {/* Component legend below canvas */}
      <div className={`grid grid-cols-4 gap-2 text-[10px] ${isExpanded ? "text-gray-400" : "text-gray-500"}`}>
        {[
          { icon: "🟢", label: "ESP32 (Wi-Fi/BT)" },
          { icon: "🔴", label: "Relay Module 2CH" },
          { icon: "❄️",  label: "Dàn lạnh (Evaporator)" },
          { icon: "🌀", label: `Quạt thông gió (${state.fanRelay === "ON" ? "ĐANG CHẠY" : "STANDBY"})` },
        ].map(({ icon, label }) => (
          <div key={label} className={`flex items-center gap-1.5 rounded-lg px-2 py-1.5 ${isExpanded ? "bg-white/5 border border-white/5" : "bg-gray-50"}`}>
            <span>{icon}</span>
            <span className="leading-tight">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
