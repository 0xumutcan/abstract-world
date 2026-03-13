'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Sphere, Html, Earth } from '@react-three/drei'
import { useState, useRef, useMemo } from 'react'
import * as THREE from 'three'

// Full country data with lat/lng
const countries = [
  { name: 'USA', lat: 37.0902, lng: -95.7129, users: 12450 },
  { name: 'Germany', lat: 51.1657, lng: 10.4515, users: 8320 },
  { name: 'UK', lat: 55.3781, lng: -3.4360, users: 7890 },
  { name: 'Turkey', lat: 38.9637, lng: 35.2433, users: 6540 },
  { name: 'India', lat: 20.5937, lng: 78.9629, users: 5980 },
  { name: 'Brazil', lat: -14.2350, lng: -51.9253, users: 4320 },
  { name: 'Japan', lat: 36.2048, lng: 138.2529, users: 4100 },
  { name: 'France', lat: 46.2276, lng: 2.2137, users: 3890 },
  { name: 'Nigeria', lat: 9.0820, lng: 8.6753, users: 3450 },
  { name: 'Australia', lat: -25.2744, lng: 133.7751, users: 2890 },
  { name: 'Canada', lat: 56.1304, lng: -106.3468, users: 2650 },
  { name: 'Spain', lat: 40.4637, lng: -3.7492, users: 2480 },
  { name: 'Italy', lat: 41.8719, lng: 12.5674, users: 2350 },
  { name: 'South Korea', lat: 35.9078, lng: 127.7669, users: 2100 },
  { name: 'Mexico', lat: 23.6345, lng: -102.5528, users: 1950 },
  { name: 'Indonesia', lat: -0.7893, lng: 113.9213, users: 1800 },
  { name: 'Netherlands', lat: 52.1326, lng: 5.2913, users: 1650 },
  { name: 'Argentina', lat: -38.4161, lng: -63.6167, users: 1520 },
  { name: 'South Africa', lat: -30.5595, lng: 22.9375, users: 1380 },
  { name: 'Poland', lat: 51.9194, lng: 19.1451, users: 1250 },
  { name: 'Russia', lat: 61.5240, lng: 105.3188, users: 1100 },
  { name: 'China', lat: 35.8617, lng: 104.1954, users: 950 },
  { name: 'Egypt', lat: 26.8206, lng: 30.8025, users: 820 },
  { name: 'Saudi Arabia', lat: 23.8859, lng: 45.0792, users: 750 },
  { name: 'UAE', lat: 23.4241, lng: 53.8478, users: 680 },
]

// Calculate marker size based on users
function getMarkerSize(users: number, maxUsers: number): number {
  const minSize = 0.08
  const maxSize = 0.35
  const ratio = users / maxUsers
  return minSize + (maxSize - minSize) * Math.pow(ratio, 0.5)
}

function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lng + 180) * (Math.PI / 180)
  const x = -radius * Math.sin(phi) * Math.cos(theta)
  const z = radius * Math.sin(phi) * Math.sin(theta)
  const y = radius * Math.cos(phi)
  return new THREE.Vector3(x, y, z)
}

function CountryMarker({ country, radius, maxUsers }: { country: typeof countries[0], radius: number, maxUsers: number }) {
  const [hovered, setHovered] = useState(false)
  const position = latLngToVector3(country.lat, country.lng, radius)
  const size = getMarkerSize(country.users, maxUsers)
  
  // Color gradient based on user count
  const color = useMemo(() => {
    const ratio = country.users / maxUsers
    if (ratio > 0.5) return '#ff6b35' // orange for high
    if (ratio > 0.25) return '#f7c948' // yellow for medium
    return '#6b5b95' // purple for low
  }, [country.users, maxUsers])
  
  return (
    <group position={position}>
      <Sphere 
        args={[size, 32, 32]} 
        onPointerOver={() => setHovered(true)} 
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial 
          color={color} 
          emissive={color}
          emissiveIntensity={hovered ? 1 : 0.6}
          roughness={0.3}
          metalness={0.7}
        />
      </Sphere>
      {hovered && (
        <Html distanceFactor={12}>
          <div className="bg-black/90 text-white px-4 py-3 rounded-xl text-sm whitespace-nowrap border border-white/20 backdrop-blur-sm -translate-x-1/2 -translate-y-1/2">
            <div className="font-bold text-lg">{country.name}</div>
            <div className="text-orange-400 font-semibold">{country.users.toLocaleString()} nodes</div>
          </div>
        </Html>
      )}
    </group>
  )
}

function Globe() {
  const maxUsers = Math.max(...countries.map(c => c.users))
  const globeRadius = 2.5
  
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 3, 5]} intensity={1.2} />
      <pointLight position={[-5, -3, -5]} intensity={0.4} color="#6b5b95" />
      
      {/* Earth sphere */}
      <Sphere args={[globeRadius, 64, 64]}>
        <meshStandardMaterial 
          color="#0a1628"
          metalness={0.2}
          roughness={0.8}
        />
      </Sphere>
      
      {/* Atmosphere glow */}
      <Sphere args={[globeRadius * 1.02, 64, 64]}>
        <meshBasicMaterial 
          color="#1e3a5f" 
          transparent 
          opacity={0.15}
          side={THREE.BackSide}
        />
      </Sphere>
      
      {/* Country markers */}
      {countries.map((country) => (
        <CountryMarker 
          key={country.name} 
          country={country} 
          radius={globeRadius}
          maxUsers={maxUsers}
        />
      ))}
      
      <OrbitControls 
        enableZoom={true} 
        enablePan={false} 
        minDistance={3} 
        maxDistance={12}
        autoRotate
        autoRotateSpeed={0.3}
        dampingFactor={0.05}
        enableDamping
      />
    </>
  )
}

export default function Home() {
  const totalUsers = countries.reduce((acc, c) => acc + c.users, 0)
  const countryCount = countries.length
  
  return (
    <main className="w-screen h-screen bg-black relative overflow-hidden">
      {/* 3D Canvas - full screen, centered */}
      <Canvas 
        camera={{ position: [0, 0, 7], fov: 50 }}
        style={{ background: 'radial-gradient(ellipse at center, #0d1b2a 0%, #000000 100%)' }}
      >
        <Globe />
      </Canvas>
      
      {/* UI Overlay - Top */}
      <div className="absolute top-0 left-0 w-full p-8 flex justify-between items-start pointer-events-none">
        <div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-400 via-yellow-400 to-purple-500 bg-clip-text text-transparent">
            Abstract World
          </h1>
          <p className="text-gray-400 mt-3 text-xl">
            {totalUsers.toLocaleString()} nodes worldwide
          </p>
        </div>
        
        <div className="text-right pointer-events-auto">
          <p className="text-sm text-gray-500 mb-3">Join the network</p>
          <button className="bg-gradient-to-r from-orange-500 to-purple-600 text-white px-8 py-4 rounded-full font-semibold hover:opacity-90 transition-all hover:scale-105 shadow-lg shadow-orange-500/20">
            Connect Wallet
          </button>
        </div>
      </div>
      
      {/* UI Overlay - Bottom */}
      <div className="absolute bottom-0 left-0 w-full p-8 flex justify-center pointer-events-none">
        <div className="bg-black/60 backdrop-blur-md px-8 py-4 rounded-2xl flex gap-12 text-sm border border-white/10">
          <div>
            <span className="text-gray-400">Countries</span>
            <span className="ml-3 font-bold text-white text-lg">{countryCount}</span>
          </div>
          <div>
            <span className="text-gray-400">Total Nodes</span>
            <span className="ml-3 font-bold text-orange-400 text-lg">{totalUsers.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-gray-400">Network</span>
            <span className="ml-3 font-bold text-purple-400 text-lg">Abstract</span>
          </div>
        </div>
      </div>
    </main>
  )
}
