"use client";

import { Suspense, useRef, useMemo, useEffect, useCallback } from "react";
import { Canvas, useFrame, useThree, extend } from "@react-three/fiber";
import * as THREE from "three";

// ─── GLSL Noise (Simplex 3D) ──────────────────────────────────────────────

const noise = /* glsl */ `
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }
`;

// ─── Custom Shader Material ───────────────────────────────────────────────

class MorphBlobMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uHover: { value: 0 },
        uColor1: { value: new THREE.Color("#1a1a2e") },
        uColor2: { value: new THREE.Color("#16213e") },
        uColor3: { value: new THREE.Color("#0f3460") },
        uColorAccent: { value: new THREE.Color("#e94560") },
      },
      vertexShader: /* glsl */ `
        ${noise}
        uniform float uTime;
        uniform vec2 uMouse;
        uniform float uHover;
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying float vDisplacement;

        void main() {
          vNormal = normal;
          vPosition = position;

          // Layered noise for organic movement
          float n1 = snoise(position * 0.8 + uTime * 0.15) * 0.5;
          float n2 = snoise(position * 1.6 + uTime * 0.25) * 0.25;
          float n3 = snoise(position * 3.2 + uTime * 0.1) * 0.125;

          float displacement = n1 + n2 + n3;

          // Mouse influence — bulge toward cursor
          float mouseInfluence = smoothstep(2.0, 0.0,
            length(position.xy - uMouse * 2.0)) * uHover * 0.35;
          displacement += mouseInfluence;

          vDisplacement = displacement;

          vec3 newPosition = position + normal * displacement * 0.4;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform float uTime;
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        uniform vec3 uColor3;
        uniform vec3 uColorAccent;
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying float vDisplacement;

        void main() {
          // Fresnel for edge glow
          vec3 viewDir = normalize(cameraPosition - vPosition);
          float fresnel = pow(1.0 - max(dot(viewDir, vNormal), 0.0), 3.0);

          // Multi-color gradient based on displacement + position
          float t = vDisplacement * 0.5 + 0.5;
          vec3 color = mix(uColor1, uColor2, smoothstep(0.0, 0.5, t));
          color = mix(color, uColor3, smoothstep(0.3, 0.8, t));

          // Add subtle accent at peaks
          color = mix(color, uColorAccent, smoothstep(0.7, 1.0, t) * 0.3);

          // Fresnel edge lighting
          color += fresnel * 0.35 * mix(uColor3, uColorAccent, 0.5);

          // Subtle transparency at edges
          float alpha = 0.85 + fresnel * 0.15;

          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      side: THREE.FrontSide,
    });
  }
}

extend({ MorphBlobMaterial });

// ─── Morphing Blob ─────────────────────────────────────────────────────────

function MorphBlob() {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<MorphBlobMaterial>(null);
  const mouseTarget = useRef(new THREE.Vector3(1.5, 0, 0));
  const mouseCurrent = useRef(new THREE.Vector3(1.5, 0, 0));
  const shaderMouse = useRef(new THREE.Vector2(0, 0));
  const hoverTarget = useRef(0);
  const hoverCurrent = useRef(0);
  const { viewport } = useThree();

  const handlePointerMove = useCallback((e: MouseEvent) => {
    // Normalized mouse (-1 to 1)
    const nx = (e.clientX / window.innerWidth) * 2 - 1;
    const ny = -(e.clientY / window.innerHeight) * 2 + 1;

    // Map to world-space position so the blob follows the cursor
    mouseTarget.current.x = nx * (viewport.width / 2) * 0.7;
    mouseTarget.current.y = ny * (viewport.height / 2) * 0.7;

    // Shader mouse for the bulge effect
    shaderMouse.current.set(nx, ny);
    hoverTarget.current = 1;
  }, [viewport]);

  const handlePointerLeave = useCallback(() => {
    // Drift back to default position
    mouseTarget.current.set(1.5, 0, 0);
    hoverTarget.current = 0;
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handlePointerMove);
    document.addEventListener("mouseleave", handlePointerLeave);
    return () => {
      window.removeEventListener("mousemove", handlePointerMove);
      document.removeEventListener("mouseleave", handlePointerLeave);
    };
  }, [handlePointerMove, handlePointerLeave]);

  useFrame((state, delta) => {
    if (!matRef.current || !meshRef.current) return;

    matRef.current.uniforms.uTime.value = state.clock.elapsedTime;

    // Smooth position follow (blob chases the mouse)
    mouseCurrent.current.lerp(mouseTarget.current, delta * 1.8);
    meshRef.current.position.copy(mouseCurrent.current);

    // Shader mouse for bulge effect
    matRef.current.uniforms.uMouse.value.copy(shaderMouse.current);

    // Smooth hover transition
    hoverCurrent.current += (hoverTarget.current - hoverCurrent.current) * delta * 3;
    matRef.current.uniforms.uHover.value = hoverCurrent.current;

    // Gentle autonomous rotation
    meshRef.current.rotation.y += delta * 0.08;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.15) * 0.1;
  });

  const material = useMemo(() => new MorphBlobMaterial(), []);

  return (
    <mesh ref={meshRef} scale={2.2} position={[1.5, 0, 0]}>
      <icosahedronGeometry args={[1, 64]} />
      <primitive object={material} ref={matRef} attach="material" />
    </mesh>
  );
}

// ─── Constellation particles with connections ──────────────────────────────

function Constellation({ count = 60 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const mouseRef = useRef(new THREE.Vector2(0, 0));

  // Each particle gets a unique phase offset + oscillation speed so motion
  // stays bounded and organic instead of drifting off-screen.
  const { basePositions, phases } = useMemo(() => {
    const base = new Float32Array(count * 3);
    const ph = new Float32Array(count * 4); // 4 random seeds per particle
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 3 + Math.random() * 7;
      base[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      base[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      base[i * 3 + 2] = (Math.random() - 0.5) * 5;
      ph[i * 4] = Math.random() * Math.PI * 2;
      ph[i * 4 + 1] = Math.random() * Math.PI * 2;
      ph[i * 4 + 2] = 0.08 + Math.random() * 0.15; // speed x/y
      ph[i * 4 + 3] = 0.05 + Math.random() * 0.1;  // speed z
    }
    return { basePositions: base, phases: ph };
  }, [count]);

  const livePositions = useMemo(() => new Float32Array(count * 3), [count]);

  const pointGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
      "position",
      new THREE.BufferAttribute(livePositions, 3)
    );
    return geo;
  }, [livePositions]);

  // Pre-allocate line geometry (max possible connections)
  const maxLineVerts = count * 8;
  const linePositions = useMemo(
    () => new Float32Array(maxLineVerts * 6),
    [maxLineVerts]
  );
  const lineGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
      "position",
      new THREE.BufferAttribute(linePositions, 3)
    );
    geo.setDrawRange(0, 0);
    return geo;
  }, [linePositions]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame((state) => {
    if (!pointsRef.current || !linesRef.current) return;

    const pos = livePositions;
    const t = state.clock.elapsedTime;

    // ── Update particle positions (bounded oscillation around base) ──
    for (let i = 0; i < count; i++) {
      const p0 = phases[i * 4];
      const p1 = phases[i * 4 + 1];
      const sXY = phases[i * 4 + 2];
      const sZ = phases[i * 4 + 3];

      // Smooth, bounded oscillation — particles always stay near base
      pos[i * 3] =
        basePositions[i * 3] +
        Math.sin(t * sXY + p0) * 0.6 +
        Math.sin(t * sXY * 0.4 + p1) * 0.3;
      pos[i * 3 + 1] =
        basePositions[i * 3 + 1] +
        Math.cos(t * sXY * 0.9 + p1) * 0.6 +
        Math.cos(t * sXY * 0.35 + p0) * 0.3;
      pos[i * 3 + 2] =
        basePositions[i * 3 + 2] + Math.sin(t * sZ + p0) * 0.25;

      // Gentle mouse repulsion (temporary — springs back on its own)
      const mx = mouseRef.current.x * 6;
      const my = mouseRef.current.y * 4;
      const dx = pos[i * 3] - mx;
      const dy = pos[i * 3 + 1] - my;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 0.01 && dist < 3) {
        const force = (3 - dist) * 0.015;
        pos[i * 3] += (dx / dist) * force;
        pos[i * 3 + 1] += (dy / dist) * force;
      }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;

    // ── Build connection lines between nearby particles ──
    let lineIdx = 0;
    const connDistSq = 3.2 * 3.2;
    const maxIdx = maxLineVerts * 6;
    for (let i = 0; i < count && lineIdx < maxIdx; i++) {
      for (let j = i + 1; j < count && lineIdx < maxIdx; j++) {
        const dx = pos[i * 3] - pos[j * 3];
        const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
        const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
        const dSq = dx * dx + dy * dy + dz * dz;
        if (dSq < connDistSq) {
          linePositions[lineIdx++] = pos[i * 3];
          linePositions[lineIdx++] = pos[i * 3 + 1];
          linePositions[lineIdx++] = pos[i * 3 + 2];
          linePositions[lineIdx++] = pos[j * 3];
          linePositions[lineIdx++] = pos[j * 3 + 1];
          linePositions[lineIdx++] = pos[j * 3 + 2];
        }
      }
    }

    // Zero out any stale line data beyond the current set
    for (let k = lineIdx; k < lineIdx + 6 && k < maxIdx; k++) {
      linePositions[k] = 0;
    }

    linesRef.current.geometry.attributes.position.needsUpdate = true;
    linesRef.current.geometry.setDrawRange(0, lineIdx / 3);
  });

  return (
    <group>
      <points ref={pointsRef} geometry={pointGeometry}>
        <pointsMaterial
          size={0.07}
          color="#666666"
          transparent
          opacity={0.6}
          sizeAttenuation
        />
      </points>
      <lineSegments ref={linesRef} geometry={lineGeometry}>
        <lineBasicMaterial color="#444444" transparent opacity={0.2} />
      </lineSegments>
    </group>
  );
}

// ─── Ambient orbital rings ─────────────────────────────────────────────────

function OrbitalRings() {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.y = state.clock.elapsedTime * 0.03;
  });

  return (
    <group ref={group} position={[1.5, 0, 0]}>
      {[3.0, 3.6, 4.2].map((radius, i) => (
        <mesh key={i} rotation={[0.3 + i * 0.4, i * 0.6, i * 0.2]}>
          <torusGeometry args={[radius, 0.003, 16, 120]} />
          <meshBasicMaterial
            color="#444444"
            transparent
            opacity={0.15 - i * 0.03}
          />
        </mesh>
      ))}
    </group>
  );
}

// ─── Main Scene ────────────────────────────────────────────────────────────

function SceneContent() {
  const { viewport } = useThree();
  const isMobile = viewport.width < 6;

  return (
    <>
      <MorphBlob />
      <Constellation count={isMobile ? 30 : 55} />
      <OrbitalRings />
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={0.3} />
    </>
  );
}

export function HeroScene() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>
      </Canvas>
    </div>
  );
}
