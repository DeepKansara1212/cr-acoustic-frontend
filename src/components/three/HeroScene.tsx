import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, Lightformer, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

function AbstractForm() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15;
      groupRef.current.rotation.x += delta * 0.03;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh castShadow>
        <icosahedronGeometry args={[1.6, 1]} />
        <MeshDistortMaterial
          color="#f2a93b"
          emissive="#f2a93b"
          emissiveIntensity={0.15}
          roughness={0.25}
          metalness={0.6}
          distort={0.28}
          speed={1.4}
        />
      </mesh>
      <mesh scale={1.55} rotation={[0.4, 0.2, 0]}>
        <icosahedronGeometry args={[1.6, 1]} />
        <meshBasicMaterial color="#4de6c8" wireframe transparent opacity={0.08} />
      </mesh>
    </group>
  );
}

export function HeroScene({ className }: { className?: string }) {
  return (
    <div className={className} aria-hidden="true">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 5.2], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <pointLight position={[4, 3, 4]} intensity={40} color="#f2a93b" />
          <pointLight position={[-4, -2, -3]} intensity={20} color="#4de6c8" />
          <Float speed={1.6} rotationIntensity={0.4} floatIntensity={0.8}>
            <AbstractForm />
          </Float>
          <Environment environmentIntensity={0.3} resolution={256}>
            <Lightformer intensity={2} color="#f2a93b" position={[4, 3, 4]} scale={[3, 3, 1]} />
            <Lightformer intensity={1.2} color="#4de6c8" position={[-4, -2, -3]} scale={[3, 3, 1]} />
            <Lightformer intensity={0.6} color="white" position={[0, 5, 0]} scale={10} form="ring" />
          </Environment>
        </Suspense>
      </Canvas>
    </div>
  );
}
