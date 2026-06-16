import { useState, useEffect, useCallback } from "react";

export interface TelemetryState {
  c2h4: number; // ppm
  temperatureAmbient: number; // °C
  temperatureCore: number; // °C
  humidity: number; // %
  batteryVoltage: number; // V
  nodeStatus: "NORMAL" | "WARNING" | "CRITICAL";
  telemetryInterval: string; // "15m" | "1m"
  fanRelay: "ON" | "OFF";
  coolingRelay: "ON" | "OFF";
  dslHours: number; // Remaining shelf life in hours
  actuationMode: "AUTO" | "MANUAL";
  c2h4Trend: "UP" | "DOWN" | "STABLE";
  tempTrend: "UP" | "DOWN" | "STABLE";
}

export function useTelemetrySim() {
  const [state, setState] = useState<TelemetryState>({
    c2h4: 12.5,
    temperatureAmbient: 4.2,
    temperatureCore: 4.5,
    humidity: 88.5,
    batteryVoltage: 4.12,
    nodeStatus: "NORMAL",
    telemetryInterval: "15m",
    fanRelay: "OFF",
    coolingRelay: "OFF",
    dslHours: 320, // initial hours remaining
    actuationMode: "AUTO",
    c2h4Trend: "STABLE",
    tempTrend: "STABLE",
  });

  const setActuationMode = useCallback((mode: "AUTO" | "MANUAL") => {
    setState((prev) => ({ ...prev, actuationMode: mode }));
  }, []);

  const toggleFan = useCallback(() => {
    setState((prev) => {
      if (prev.actuationMode === "AUTO") return prev; // Ignore in AUTO mode
      const nextFan = prev.fanRelay === "ON" ? "OFF" : "ON";
      return { ...prev, fanRelay: nextFan };
    });
  }, []);

  const toggleCooling = useCallback(() => {
    setState((prev) => {
      if (prev.actuationMode === "AUTO") return prev; // Ignore in AUTO mode
      const nextCooling = prev.coolingRelay === "ON" ? "OFF" : "ON";
      return { ...prev, coolingRelay: nextCooling };
    });
  }, []);

  const triggerC2H4Spike = useCallback(() => {
    setState((prev) => ({
      ...prev,
      c2h4: 38.4, // Instant trigger above critical limit (25ppm)
    }));
  }, []);

  const resetSimulation = useCallback(() => {
    setState({
      c2h4: 12.5,
      temperatureAmbient: 4.2,
      temperatureCore: 4.5,
      humidity: 88.5,
      batteryVoltage: 4.12,
      nodeStatus: "NORMAL",
      telemetryInterval: "15m",
      fanRelay: "OFF",
      coolingRelay: "OFF",
      dslHours: 320,
      actuationMode: "AUTO",
      c2h4Trend: "STABLE",
      tempTrend: "STABLE",
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setState((prev) => {
        // --- 1. Simulation values changes ---
        let nextC2H4 = prev.c2h4;
        let nextTempAmbient = prev.temperatureAmbient;
        let nextTempCore = prev.temperatureCore;
        let nextHumidity = prev.humidity;
        let nextBattery = prev.batteryVoltage;

        // C2H4 dynamics
        let c2h4Trend: "UP" | "DOWN" | "STABLE" = "STABLE";
        if (prev.fanRelay === "ON") {
          // Fans dissipate C2H4 towards a clean room baseline of ~1.2 ppm
          if (nextC2H4 > 1.2) {
            nextC2H4 = Math.max(1.2, nextC2H4 - 0.9);
            c2h4Trend = "DOWN";
          }
        } else {
          // No fan: produce keeps ripening and generating C2H4
          nextC2H4 = Math.min(60.0, nextC2H4 + 0.15 + Math.random() * 0.05);
          c2h4Trend = "UP";
        }

        // Temperature dynamics
        let tempTrend: "UP" | "DOWN" | "STABLE" = "STABLE";
        if (prev.coolingRelay === "ON") {
          // Cooling active: bring temperature down towards target 3.2°C
          if (nextTempAmbient > 3.2) {
            nextTempAmbient = Math.max(3.2, nextTempAmbient - 0.12);
            tempTrend = "DOWN";
          }
        } else {
          // Cooling off: heat leaks in, temperature rises slowly towards ambient container storage temperature 14.5°C
          if (nextTempAmbient < 14.5) {
            nextTempAmbient = Math.min(14.5, nextTempAmbient + 0.08);
            tempTrend = "UP";
          }
        }

        // Core temperature follows ambient temperature with thermal mass delay
        const tempDiff = nextTempAmbient - nextTempCore;
        nextTempCore += tempDiff * 0.08; // thermal inertia

        // Humidity floats slightly
        nextHumidity = Math.max(75, Math.min(98, nextHumidity + (Math.random() - 0.5) * 0.4));

        // Battery drainage (drains faster when active transmitting under alarm)
        const drainRate = prev.telemetryInterval === "1m" ? 0.0004 : 0.00005;
        nextBattery = Math.max(3.2, nextBattery - drainRate);

        // --- 2. Active Actuation State Machine (AUTO Mode) ---
        let nextFan = prev.fanRelay;
        let nextCooling = prev.coolingRelay;

        if (prev.actuationMode === "AUTO") {
          // Fan logic: turn ON if C2H4 exceeds 25.0 ppm, turn OFF once cleared below 8.0 ppm
          if (nextC2H4 > 25.0) {
            nextFan = "ON";
          } else if (nextC2H4 < 8.0) {
            nextFan = "OFF";
          }

          // Cooling logic: turn ON if ambient temp exceeds 6.0°C, turn OFF once cooled below 3.8°C
          if (nextTempAmbient > 6.0) {
            nextCooling = "ON";
          } else if (nextTempAmbient < 3.8) {
            nextCooling = "OFF";
          }
        }

        // --- 3. Alert Overrides & Frequency ---
        let nextStatus: "NORMAL" | "WARNING" | "CRITICAL" = "NORMAL";
        if (nextC2H4 >= 25.0 || nextTempAmbient >= 8.0 || prev.dslHours <= 0) {
          nextStatus = "CRITICAL";
        } else if (nextC2H4 >= 15.0 || nextTempAmbient >= 6.0) {
          nextStatus = "WARNING";
        }

        // Telemetry interval logic
        const nextInterval = nextStatus === "CRITICAL" ? "1m" : "15m";

        // --- 4. Arrhenius Dynamic Shelf Life (DSL) ---
        // Basic Arrhenius Rate Model:
        // Relative decay rate = exp(Ea / R * (1/T_ref - 1/T_kelvin))
        // Let's model reference temperature as 4.0°C (277.15K) where standard shelf life is 360 hours.
        // If temperature is higher, shelf life drains proportionally faster.
        const T_kelvin = nextTempCore + 273.15;
        const T_ref = 4.0 + 273.15;
        const Ea_R = 7500; // Activation energy / Gas constant ratio approximation for fruit respiration
        const relativeDecayRate = Math.exp(Ea_R * (1 / T_ref - 1 / T_kelvin));

        // Drain shelf life based on current decay rate (scaled down per tick to look active but stable)
        // 1 tick = 1 hour of simulated aging to make the decay visible to judges
        const ageStep = 0.5 * relativeDecayRate;
        const nextDSL = Math.max(0, prev.dslHours - ageStep);

        return {
          c2h4: Number(nextC2H4.toFixed(2)),
          temperatureAmbient: Number(nextTempAmbient.toFixed(2)),
          temperatureCore: Number(nextTempCore.toFixed(2)),
          humidity: Number(nextHumidity.toFixed(2)),
          batteryVoltage: Number(nextBattery.toFixed(3)),
          nodeStatus: nextStatus,
          telemetryInterval: nextInterval,
          fanRelay: nextFan,
          coolingRelay: nextCooling,
          dslHours: Number(nextDSL.toFixed(1)),
          actuationMode: prev.actuationMode,
          c2h4Trend,
          tempTrend,
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return {
    state,
    setActuationMode,
    toggleFan,
    toggleCooling,
    triggerC2H4Spike,
    resetSimulation,
  };
}
