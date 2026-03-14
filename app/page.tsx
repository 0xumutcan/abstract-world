'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Sphere, Html, Line } from '@react-three/drei'
import { useState, useMemo } from 'react'
import * as THREE from 'three'

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

function CountryMarker({ 
  country, 
  radius, 
  maxUsers,
  isHovered,
  onHover
}: { 
  country: typeof countries[0], 
  radius: number, 
  maxUsers: number,
  isHovered: boolean,
  onHover: (country: typeof countries[0] | null) => void
}) {
  const position = latLngToVector3(country.lat, country.lng, radius)
  
  const ratio = country.users / maxUsers
  const size = 0.08 + ratio * 0.25
  
  // Line going up from country
  const lineEnd = new THREE.Vector3(position.x, position.y + 2, position.z)
  
  return (
    <group>
      <group position={position}>
        <Sphere args={[size * 1.0, 16, 16]} 
          onPointerOver={() => onHover(country)} 
          onPointerOut={() => onHover(null)}
        >
          <meshStandardMaterial 
            color="#000000" 
            transparent 
            opacity={isHovered ? 0.2 : 0.1}
            side={THREE.BackSide}
          />
        </Sphere>
        
        <Sphere args={[size * 0.7, 16, 16]}>
          <meshStandardMaterial 
            color={isHovered ? '#00c65e' : '#ffffff'} 
            emissive={isHovered ? '#00c65e' : '#00c65e'}
            emissiveIntensity={isHovered ? 0.5 : 0.2}
            transparent
            opacity={0.7}
            roughness={0.2}
            metalness={0.8}
          />
        </Sphere>
        
        <Sphere args={[size * 1.2, 16, 16]}>
          <meshBasicMaterial 
            color="#00c65e" 
            transparent 
            opacity={isHovered ? 0.25 : 0.02}
            side={THREE.BackSide}
          />
        </Sphere>
        
        {/* Neon line going up when hovered */}
        {/* {isHovered && (
          <Line
            points={[position, lineEnd]}
            color="#00c65e"
            lineWidth={3}
            transparent
            opacity={0.9}
          />
        )} */}
      </group>
    </group>
  )
}

function Globe({ onCountryHover }: { onCountryHover: (country: typeof countries[0] | null) => void }) {
  const maxUsers = Math.max(...countries.map(c => c.users))
  const globeRadius = 3.5
  const [hoveredCountry, setHoveredCountry] = useState<typeof countries[0] | null>(null)
  
  const handleHover = (country: typeof countries[0] | null) => {
    setHoveredCountry(country)
    onCountryHover(country)
  }
  
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 3, 5]} intensity={1.0} />
      <pointLight position={[-5, -3, -5]} intensity={0.5} color="#00c65e" />
      
      {/* Earth texture - brighter */}
      <Sphere args={[globeRadius, 64, 64]}>
        <meshStandardMaterial 
          map={useMemo(() => {
            const textureLoader = new THREE.TextureLoader()
            return textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg')
          }, [])}
          color="#ffffff"
          emissive="#222222"
          emissiveIntensity={0.6}
          metalness={0.0} 
          roughness={0.5} 
        />
      </Sphere>
      
      {countries.map((country) => (
        <CountryMarker 
          key={country.name} 
          country={country} 
          radius={globeRadius}
          maxUsers={maxUsers}
          isHovered={hoveredCountry?.name === country.name}
          onHover={handleHover}
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

function CountryPanel({ country }: { country: typeof countries[0] | null }) {
  if (!country) return null
  
  return (
    <div style={{
      position: 'absolute',
      bottom: '40px',
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'rgba(0, 0, 0, 0.9)',
      border: '2px solid #00c65e',
      borderRadius: '16px',
      padding: '24px 48px',
      minWidth: '280px',
      boxShadow: '0 8px 32px rgba(0, 198, 94, 0.3), 0 0 60px rgba(0, 198, 94, 0.1)',
      backdropFilter: 'blur(10px)',
    }}>
      <div style={{
        fontSize: '32px',
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: '12px',
        letterSpacing: '2px',
        textAlign: 'center',
      }}>
        {country.name}
      </div>
      <div style={{
        fontSize: '42px',
        fontWeight: '800',
        color: '#00c65e',
        textAlign: 'center',
        textShadow: '0 0 30px rgba(0, 198, 94, 0.8)',
      }}>
        {country.users.toLocaleString()}
      </div>
      <div style={{
        fontSize: '14px',
        color: '#666666',
        marginTop: '8px',
        textTransform: 'uppercase',
        letterSpacing: '3px',
        textAlign: 'center',
      }}>
        Active Nodes
      </div>
    </div>
  )
}

export default function Home() {
  const [hoveredCountry, setHoveredCountry] = useState<typeof countries[0] | null>(null)
  
  return (
    <div style={{ width: '100vw', height: '100vh', margin: 0, padding: 0, overflow: 'hidden' }}>
      {/* Logo */}
      <div style={{
        position: 'absolute',
        top: '32px',
        left: '32px',
        zIndex: 100,
      }}>
        <img 
          src="/abtlas-logo.jpg" 
          alt="ABTLAS" 
          style={{ height: '48px', objectFit: 'contain' }}
        />
      </div>
      
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }} style={{ background: '#000000' }}>
        <Globe onCountryHover={setHoveredCountry} />
      </Canvas>
      
      <CountryPanel country={hoveredCountry} />
    </div>
  )
}
