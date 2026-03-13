'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Sphere, Html } from '@react-three/drei'
import { useState, useMemo } from 'react'
import * as THREE from 'three'

// Country data - lat/lng centers + user counts
const countries = [
  { name: 'USA', lat: 39.8283, lng: -98.5795, users: 12450 },
  { name: 'Canada', lat: 56.1304, lng: -106.3468, users: 2650 },
  { name: 'Brazil', lat: -14.2350, lng: -51.9253, users: 4320 },
  { name: 'UK', lat: 55.3781, lng: -3.4360, users: 7890 },
  { name: 'France', lat: 46.2276, lng: 2.2137, users: 3890 },
  { name: 'Germany', lat: 51.1657, lng: 10.4515, users: 8320 },
  { name: 'Spain', lat: 40.4637, lng: -3.7492, users: 2480 },
  { name: 'Italy', lat: 41.8719, lng: 12.5674, users: 2350 },
  { name: 'Poland', lat: 51.9194, lng: 19.1451, users: 1250 },
  { name: 'Turkey', lat: 38.9637, lng: 35.2433, users: 6540 },
  { name: 'Russia', lat: 61.5240, lng: 105.3188, users: 1100 },
  { name: 'China', lat: 35.8617, lng: 104.1954, users: 950 },
  { name: 'India', lat: 20.5937, lng: 78.9629, users: 5980 },
  { name: 'Japan', lat: 36.2048, lng: 138.2529, users: 4100 },
  { name: 'South Korea', lat: 35.9078, lng: 127.7669, users: 2100 },
  { name: 'Australia', lat: -25.2744, lng: 133.7751, users: 2890 },
  { name: 'Mexico', lat: 23.6345, lng: -102.5528, users: 1950 },
  { name: 'Argentina', lat: -38.4161, lng: -63.6167, users: 1520 },
  { name: 'South Africa', lat: -30.5595, lng: 22.9375, users: 1380 },
  { name: 'Egypt', lat: 26.8206, lng: 30.8025, users: 820 },
  { name: 'Saudi Arabia', lat: 23.8859, lng: 45.0792, users: 750 },
  { name: 'UAE', lat: 23.4241, lng: 53.8478, users: 680 },
  { name: 'Nigeria', lat: 9.0820, lng: 8.6753, users: 3450 },
  { name: 'Indonesia', lat: -0.7893, lng: 113.9213, users: 1800 },
  { name: 'Netherlands', lat: 52.1326, lng: 5.2913, users: 1650 },
]

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
  
  // Size based on users
  const ratio = country.users / maxUsers
  const size = 0.08 + ratio * 0.25
  
  return (
    <group position={position}>
      {/* Outer ring */}
      <Sphere 
        args={[size * 1.3, 16, 16]} 
        onPointerOver={() => setHovered(true)} 
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial 
          color="#000000" 
          transparent 
          opacity={hovered ? 0.8 : 0.4}
          side={THREE.BackSide}
        />
      </Sphere>
      
      {/* Inner core */}
      <Sphere args={[size, 16, 16]}>
        <meshStandardMaterial 
          color={hovered ? '#00c65e' : '#ffffff'} 
          emissive={hovered ? '#00c65e' : '#00c65e'}
          emissiveIntensity={hovered ? 0.8 : 0.3}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>
      
      {/* Glow effect */}
      <Sphere args={[size * 1.5, 16, 16]}>
        <meshBasicMaterial 
          color="#00c65e" 
          transparent 
          opacity={hovered ? 0.3 : 0.1}
          side={THREE.BackSide}
        />
      </Sphere>
      
      {/* Label */}
      {hovered && (
        <Html distanceFactor={10}>
          <div className="bg-black text-white px-4 py-2 rounded-lg text-sm whitespace-nowrap border-2 border-[#00c65e]">
            <div className="font-bold">{country.name}</div>
            <div className="text-[#00c65e] font-semibold">{country.users.toLocaleString()} nodes</div>
          </div>
        </Html>
      )}
    </group>
  )
}

function Globe() {
  const maxUsers = Math.max(...countries.map(c => c.users))
  const globeRadius = 3.5
  
  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 3, 5]} intensity={0.6} />
      <pointLight position={[-5, -3, -5]} intensity={0.3} color="#00c65e" />
      
      {/* Base globe - dark sphere */}
      <Sphere args={[globeRadius, 64, 64]}>
        <meshStandardMaterial 
          color="#0a0a0a" 
          metalness={0.1} 
          roughness={0.9}
        />
      </Sphere>
      
      {/* World map texture - outline style */}
      <Sphere args={[globeRadius * 1.001, 64, 64]}>
        <meshBasicMaterial 
          color="#1a1a1a"
          transparent
          opacity={0.5}
        />
      </Sphere>
      
      {/* Grid lines */}
      <Sphere args={[globeRadius * 1.003, 24, 24]}>
        <meshBasicMaterial 
          color="#2a2a2a" 
          wireframe 
          transparent 
          opacity={0.2} 
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
        minDistance={5} 
        maxDistance={15}
        autoRotate 
        autoRotateSpeed={0.2}
        dampingFactor={0.05}
        enableDamping
      />
    </>
  )
}

export default function Home() {
  return (
    <div style={{ width: '100vw', height: '100vh', margin: 0, padding: 0, overflow: 'hidden' }}>
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }} style={{ background: '#000000' }}>
        <Globe />
      </Canvas>
    </div>
  )
}
