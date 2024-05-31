import { MeshPortalMaterial, useTexture } from "@react-three/drei";
import * as THREE from "three";
import React, { useMemo, useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";

// Portal component creates a portal with animated particles
const Portal = ({ texture, floor = 0, position = [0, 10, 0] }) => {
  // State for the current number of particles and the opacity of the portal
  const [particleCount, setParticleCount] = useState(0);
  const [portalOpacity, setPortalOpacity] = useState(0);

  // Constants defining the maximum number of particles and the distribution radius
  const maxParticles = 50000;
  const radius = 5;

  // useMemo to create particle data arrays only once
  const particles = useMemo(
    () => ({
      positions: new Float32Array(maxParticles * 3),
      velocities: new Float32Array(maxParticles * 3),
      lifetimes: new Float32Array(maxParticles),
      lifeSpans: new Float32Array(maxParticles),
      colors: new Float32Array(maxParticles * 3),
    }),
    [maxParticles]
  );

  // Refs to store references to various elements and particle data arrays
  const ref = useRef();
  const groupRef = useRef();
  const velocitiesRef = useRef(particles.velocities);
  const lifetimesRef = useRef(particles.lifetimes);
  const lifeSpansRef = useRef(particles.lifeSpans);
  const colorsRef = useRef(particles.colors);

  // Define initial, mid, and final colors for particle lifecycle
  const initialColor = new THREE.Color(0xffff00);
  const midColor = new THREE.Color(0xffa500);
  const finalColor = new THREE.Color(0xff0000);

  // useEffect to set attributes on the buffer geometry after the component mounts
  useEffect(() => {
    if (ref.current) {
      ref.current.geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(particles.positions, 3)
      );
      ref.current.geometry.setAttribute(
        "color",
        new THREE.BufferAttribute(particles.colors, 3)
      );
      ref.current.geometry.attributes.position.needsUpdate = true;
      ref.current.geometry.attributes.color.needsUpdate = true;
    }
  }, [particles.positions, particles.colors]);

  // useFrame to update particle positions and colors on each frame
  useFrame((state, delta) => {
    if (
      ref.current?.geometry?.attributes?.position &&
      ref.current?.geometry?.attributes?.color
    ) {
      const { array: positions } = ref.current.geometry.attributes.position;
      const velocities = velocitiesRef.current;
      const lifetimes = lifetimesRef.current;
      const lifeSpans = lifeSpansRef.current;
      const colors = colorsRef.current;

      // Generate new particles if the current count is less than the maximum
      if (particleCount < maxParticles) {
        const numNewParticles = 500;
        for (
          let i = particleCount;
          i < particleCount + numNewParticles && i < maxParticles;
          i++
        ) {
          const angle = (Math.PI * 2) / 15000;
          const x = radius * Math.cos(i * angle);
          const y = radius * Math.sin(i * angle);
          const index = i * 3;
          positions[index] = x;
          positions[index + 1] = y;
          positions[index + 2] = 0;
          velocities[index] = -y * 0.05 + (Math.random() - 0.5) * 0.12;
          velocities[index + 1] = x * 0.05 + (Math.random() - 0.5) * 0.12;
          velocities[index + 2] = (Math.random() - 0.5) * 0.04;
          lifetimes[i] = 0;
          lifeSpans[i] = 400 + Math.random() * 1600;
          colors[index] = initialColor.r;
          colors[index + 1] = initialColor.g;
          colors[index + 2] = initialColor.b;
        }
        setParticleCount(particleCount + numNewParticles);
        if (particleCount + numNewParticles >= maxParticles) {
          setPortalOpacity(1);
        }
      }

      // Update particle positions, velocities, and colors
      for (let i = 0; i < particleCount * 3; i += 3) {
        const idx = i / 3;
        lifetimes[idx] += delta * 1000;

        positions[i] += velocities[i] + (Math.random() - 0.5) * 0.01;
        positions[i + 1] += velocities[i + 1] + (Math.random() - 0.5) * 0.01;
        positions[i + 2] += velocities[i + 2] + (Math.random() - 0.5) * 0.01;

        // Apply gravity to y-velocity
        velocities[i + 1] -= 0.004;

        // Calculate the particle's life ratio and update its color
        const lifeRatio = lifetimes[idx] / lifeSpans[idx];
        const currentColor = new THREE.Color();
        if (lifeRatio < 0.5) {
          currentColor.copy(initialColor).lerp(midColor, lifeRatio * 2);
        } else {
          currentColor.copy(midColor).lerp(finalColor, (lifeRatio - 0.5) * 2);
        }
        colors[i] = currentColor.r;
        colors[i + 1] = currentColor.g;
        colors[i + 2] = currentColor.b;

        // Convert local position to world position
        const localPosition = new THREE.Vector3(
          positions[i],
          positions[i + 1],
          positions[i + 2]
        );
        const globalPosition = localPosition.applyMatrix4(
          groupRef.current.matrixWorld
        );

        // Check against global floor and reset particle if necessary
        if (globalPosition.y <= floor || lifetimes[idx] >= lifeSpans[idx]) {
          const angle = Math.random() * 2 * Math.PI;
          positions[i] = radius * Math.cos(angle);
          positions[i + 1] = radius * Math.sin(angle);
          positions[i + 2] = 0;
          velocities[i] =
            -positions[i + 1] * 0.05 + (Math.random() - 0.5) * 0.02;
          velocities[i + 1] =
            positions[i] * 0.05 + (Math.random() - 0.5) * 0.02;
          velocities[i + 2] = (Math.random() - 0.5) * 0.04;
          lifetimes[idx] = 0;
          lifeSpans[idx] = 20 + Math.random() * 800;
        }
      }

      // Mark the position and color attributes as needing updates
      ref.current.geometry.attributes.position.needsUpdate = true;
      ref.current.geometry.attributes.color.needsUpdate = true;
    }
  });

  // Load the texture using useTexture hook
  const map = useTexture(texture);

  // Render the portal with particles and the portal material
  return (
    <group ref={groupRef} position={position} rotation={[0, Math.PI, 0]}>
      <points ref={ref}>
        <bufferGeometry />
        <pointsMaterial
          vertexColors={true}
          size={0.1}
          sizeAttenuation={true}
          transparent={true}
          opacity={0.9}
          blending={THREE.AdditiveBlending}
        />
      </points>
      <mesh>
        <circleGeometry args={[5, 32]} />
        <MeshPortalMaterial
          side={THREE.DoubleSide}
          transparent
          opacity={portalOpacity}
        >
          <mesh rotation={[0, Math.PI, 0]}>
            <ambientLight intensity={1} />
            <sphereGeometry args={[15, 32, 32]} />
            <meshStandardMaterial
              map={map}
              side={THREE.BackSide}
              transparent
              opacity={portalOpacity}
            />
          </mesh>
        </MeshPortalMaterial>
      </mesh>
    </group>
  );
};

export default Portal;
