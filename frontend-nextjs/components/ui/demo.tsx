"use client"

import { useState } from "react"
import { Canvas } from "@react-three/fiber"
import { ShaderPlane, EnergyRing } from "./background-paper-shaders"

export default function DemoOne() {
  const [intensity, setIntensity] = useState(1.5)
  const [speed, setSpeed] = useState(1.0)
  const [activeEffect, setActiveEffect] = useState("mesh")

  return (
    <div className="w-full h-screen relative overflow-hidden">
      {activeEffect === "mesh" && (
        <div className="w-full h-full absolute inset-0">
          <Canvas camera={{ position: [0, 0, 5] }}>
            <ShaderPlane position={[0, 0, 0]} color1="#a855f7" color2="#0d0d0d" />
          </Canvas>
        </div>
      )}

      {activeEffect === "dots" && (
        <div className="w-full h-full absolute inset-0">
          <Canvas camera={{ position: [0, 0, 5] }}>
            <EnergyRing radius={2} position={[0, 0, 0]} />
          </Canvas>
        </div>
      )}

      {activeEffect === "combined" && (
        <div className="w-full h-full absolute inset-0">
          <Canvas camera={{ position: [0, 0, 5] }}>
            <ShaderPlane position={[0, 0, -1]} color1="#a855f7" color2="#0d0d0d" />
            <EnergyRing radius={2} position={[0, 0, 0]} />
          </Canvas>
        </div>
      )}

      {/* Lighting overlay effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/4 left-1/3 w-32 h-32 bg-purple-800/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: `${3 / speed}s` }}
        />
        <div
          className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-white/5 rounded-full blur-2xl animate-pulse"
          style={{ animationDuration: `${2 / speed}s`, animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 right-1/3 w-20 h-20 bg-purple-900/10 rounded-full blur-xl animate-pulse"
          style={{ animationDuration: `${4 / speed}s`, animationDelay: "0.5s" }}
        />
      </div>
    </div>
  )
}
