'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Sphere, Html } from '@react-three/drei'
import { useState, useRef } from 'react'
import * as THREE from 'three'

// Country data - will connect to backend later
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
]

function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lng + 180) * (Math.PI / 180)
  const x = -radius * Math.sin(phi) * Math.cos(theta)
  const z = radius * Math.sin(phi) * Math.sin(theta)
  const y = radius * Math.cos(phi)
  return new THREE.Vector3(x, y, z)
}

function CountryMarker({ country, radius }: { country: typeof countries[0], radius: number }) {
  const [hovered, setHovered] = useState(false)
  const position = latLngToVector3(country.lat, country.lng, radius)
  
  return (
    <group position={position}>
      <Sphere args={[0.15, 16, 16]} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
        <meshStandardMaterial color={hovered ? "#ff6b35" : "#6b5b95"} emissive={hovered ? "#ff6b35" : "#6b5b95"} emissiveIntensity={0.5} />
      </Sphere>
      {hovered && (
        <Html distanceFactor={10}>
          <div className="bg-black/80 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap border border-white/20">
            <div className="font-bold">{country.name}</div>
            <div className="text-orange-400">{country.users.toLocaleString()} users</div>
          </div>
        </Html>
      )}
    </group>
  )
}

function Globe() {
  const sphereRef = useRef<THREE.Mesh>(null)
  
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#6b5b95" />
      
      <Sphere ref={sphereRef} args={[2, 64, 64]}>
        <meshStandardMaterial 
          color="#1a1a2e" 
          metalness={0.3} 
          roughness={0.7}
          wireframe={false}
        />
      </Sphere>
      
      {/* Wireframe overlay */}
      <Sphere args={[2.01, 32, 32]}>
        <meshBasicMaterial color="#4a4a6a" wireframe transparent opacity={0.1} />
      </Sphere>
      
      {countries.map((country) => (
        <CountryMarker key={country.name} country={country} radius={2} />
      ))}
      
      <OrbitControls 
        enableZoom={true} 
        enablePan={false} 
        minDistance={3} 
        maxDistance={10}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </>
  )
}

export default function Home() {
  const totalUsers = countries.reduce((acc, c) => acc + c.users, 0)
