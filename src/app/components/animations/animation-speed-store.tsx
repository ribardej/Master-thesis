import { useState, useEffect } from "react";

// Global animation speed multiplier. 1 = normal, 0.5 = slower, 2 = faster
let globalSpeed = 1;
const listeners = new Set<() => void>();

export function setGlobalAnimationSpeed(speed: number) {
  globalSpeed = speed;
  listeners.forEach((listener) => listener());
}

export function useGlobalAnimationSpeed() {
  const [speed, setSpeed] = useState(globalSpeed);

  useEffect(() => {
    const listener = () => setSpeed(globalSpeed);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  return [speed, setGlobalAnimationSpeed] as const;
}

export function AnimationSpeedControl({ baseTimeMs = 5000 }: { baseTimeMs?: number }) {
  const [speed, setSpeed] = useGlobalAnimationSpeed();
  const timeInSeconds = (baseTimeMs / speed / 1000).toFixed(1);

  return (
    <div className="flex items-center gap-2 text-sm text-gray-600 bg-white px-3 py-1.5 rounded-md border shadow-sm w-full">
      <span className="text-xs font-medium">Speed</span>
      <input
        type="range"
        min="0.4"
        max="2"
        step="0.2"
        value={speed}
        onChange={(e) => setSpeed(parseFloat(e.target.value))}
        className="flex-1 mx-2 accent-indigo-600"
        title={`Time per step: ${timeInSeconds}s`}
      />
      <span className="text-xs font-mono text-gray-500 min-w-[3rem] text-right whitespace-nowrap">({timeInSeconds}s)</span>
    </div>
  );
}
