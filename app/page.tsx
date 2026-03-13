'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Sphere } from '@react-three/drei'
import { useRef, useState, useMemo } from 'react'
import * as THREE from 'three'

// Simplified country regions as lat/lng bounds
const countries = [
  { name: 'USA', latMin: 25, latMax: 49, lngMin: -125, lngMax: -66, users: 12450 },
  { name: 'Canada', latMin: 42, latMax: 83, lngMin: -141, lngMax: -52, users: 2650 },
  { name: 'Brazil', latMin: -34, latMax: 5, lngMin: -74, lngMax: -34, users: 4320 },
  { name: 'UK', latMin: 50, latMax: 60, lngMin: -8, lngMax: 2, users: 7890 },
  { name: 'France', latMin: 42, latMax: 51, lngMin: -5, lngMax: 9, users: 3890 },
  { name: 'Germany', latMin: 47, latMax: 55, lngMin: 6, lngMax: 15, users: 8320 },
  { name: 'Spain', latMin: 36, latMax: 44, lngMin: -9, lngMax: 4, users: 2480 },
  { name: 'Italy', latMin: 36, latMax: 47, lngMin: 7, lngMax: 18, users: 2350 },
  { name: 'Poland', latMin: 49, latMax: 55, lngMin: 14, lngMax: 24, users: 1250 },
  { name: 'Turkey', latMin: 36, latMax: 42, lngMin: 26, lngMax: 45, users: 6540 },
  { name: 'Russia', latMin: 41, latMax: 82, lngMin: 19, lngMax: 180, users: 1100 },
  { name: 'China', latMin: 18, latMax: 54, lngMin: 73, lngMax: 135, users: 950 },
  { name: 'India', latMin: 6, latMax: 36, lngMin: 68, lngMax: 97, users: 5980 },
  { name: 'Japan', latMin: 24, latMax: 46, lngMin: 123, lngMax: 146, users: 4100 },
  { name: 'South Korea', latMin: 33, latMax: 39, lngMin: 124, lngMax: 132, users: 2100 },
  { name: 'Australia', latMin: -44, latMax: -10, lngMin: 113, lngMax: 154, users: 2890 },
  { name: 'Mexico', latMin: 14, latMax: 33, lngMin: -118, lngMax: -86, users: 1950 },
  { name: 'Argentina', latMin: -55, latMax: -22, lngMin: -74, lngMax: -53, users: 1520 },
  { name: 'South Africa', latMin: -35, latMax: -22, lngMin: 16, lngMax: 33, users: 1380 },
  { name: 'Egypt', latMin: 22, latMax: 32, lngMin: 25, lngMax: 35, users: 820 },
  { name: 'Saudi Arabia', latMin: 16, latMax: 32, lngMin: 35, lngMax: 56, users: 750 },
  { name: 'UAE', latMin: 22, latMax: 26, lngMin: 51, lngMax: 56, users: 680 },
  { name: 'Nigeria', latMin: 4, latMax: 14, lngMin: 3, lngMax: 14, users: 3450 },
  { name: 'Indonesia', latMin: -11, latMax: 6, lngMin: 95, lngMax: 141, users: 1800 },
  { name: 'Netherlands', latMin: 51, latMax: 54, lngMin: 3, lngMax: 8, users: 1650 },
]

function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lng + 180) * (Math.PI / 180)
  const x = -radius * Math.sin(phi) * Math.cos(theta)
  const z = radius * Math.sin(phi) * Math.sin(theta)
  const y = radius * Math.cos(phi)
  return new THREE.Vector3(x, y, z)
}

function CountryMesh({ country, globeRadius }: { country: typeof countries[0], globeRadius: number }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  
  // Calculate center lat/lng
  const centerLat = (country.latMin + country.latMax) / 2
  const centerLng = (country.lngMin + country.lngMax) / 2
  
  // Approximate size based on bounds
  const latSize = Math.abs(country.latMax - country.latMin)
  const lngSize = Math.abs(country.lngMax - country.lngMin)
  const size = Math.max(latSize, lngSize) * 0.015
  
  // Height rises on hover
  const height = hovered ? 0.15 : 0
  
  const position = latLngToVector3(centerLat, centerLng, globeRadius + height)
  
  // Rotation to face outward from globe center
  const rotation = new THREE.Euler(
    (90 - centerLat) * (Math.PI / 180),
    0,
    -(centerLng + 90) * (Math.PI / 180)
  )
  
  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={rotation}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <planeGeometry args={[size, size, 8, 8]} />
      <meshStandardMaterial
        color={hovered ? '#00c65e' : '#ffffff'}
        emissive={hovered ? '#00c65e' : '#000000'}
        emissiveIntensity={hovered ? 0.3 : 0}
        transparent
        opacity={hovered ? 0.9 : 0.15}
        side={THREE.DoubleSide}
        wireframe={false}
      />
    </mesh>
  )
}

function Globe() {
  const globeRadius = 3.5
  
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 3, 5]} intensity={0.8} />
      <pointLight position={[-5, -3, -5]} intensity={0.3} color="#00c65e" />
      
      {/* Base globe - dark */}
      <Sphere args={[globeRadius, 64, 64]}>
        <meshStandardMaterial color="#0a0a0a" metalness={0.3} roughness={0.8} />
      </Sphere>
      
      {/* Grid lines */}
      <Sphere args={[globeRadius * 1.002, 24, 24]}>
        <meshBasicMaterial color="#1a1a1a" wireframe transparent opacity={0.3} />
      </Sphere>
      
      {/* Country squares */}
      {countries.map((country) => (
        <CountryMesh key={country.name} country={country} globeRadius={globeRadius} />
      ))}
      
      <OrbitControls 
        enableZoom={true} 
        enablePan={false} 
        minDistance={6} 
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
