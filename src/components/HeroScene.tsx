"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { heroState } from "@/lib/heroState";

// 2D simplex noise — Ian McEwan & Stefan Gustavson, Ashima Arts (MIT).
const noise = /* glsl */ `
vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m; m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}
`;

const vertexShader = /* glsl */ `
uniform float uTime;
uniform float uTravel;
uniform vec2 uMouse;
uniform float uMouseStrength;
varying float vHeight;
varying float vDepth;
varying float vMouse;
${noise}

// Ridged fractal noise reads as mountain ranges rather than rolling hills.
float ridged(vec2 p) {
  float h = 0.0, amp = 0.55, freq = 1.0;
  for (int i = 0; i < 4; i++) {
    float n = 1.0 - abs(snoise(p * freq));
    h += n * n * amp;
    freq *= 2.03;
    amp *= 0.48;
  }
  return h;
}

void main() {
  vec3 pos = position;
  vec2 p = pos.xz * 0.16 + vec2(0.0, -uTime * 0.025 - uTravel);
  float h = ridged(p);

  // Keep a low valley down the middle so the peaks frame the headline.
  float valley = smoothstep(0.6, 5.5, abs(pos.x));
  h *= mix(0.55, 1.15, valley);

  // The pointer pushes up a soft summit wherever it hovers.
  float d = distance(pos.xz, uMouse);
  float m = exp(-d * d * 0.28) * uMouseStrength;
  h += m * 0.75;

  pos.y = h * 2.2;
  vHeight = pos.y;
  vMouse = m;
  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  vDepth = -mv.z;
  gl_Position = projectionMatrix * mv;
}
`;

const fragmentShader = /* glsl */ `
uniform vec3 uBg;
uniform vec3 uLine;
uniform vec3 uAccent;
uniform float uOpacity;
varying float vHeight;
varying float vDepth;
varying float vMouse;

// Anti-aliased iso-line at every integer of v.
float contour(float v) {
  float w = fwidth(v);
  float f = abs(fract(v - 0.5) - 0.5) / max(w, 1e-4);
  return 1.0 - min(f, 1.0);
}

void main() {
  float c = vHeight * 7.0;
  float minor = contour(c) * 0.4;
  float major = contour(c / 5.0);
  float lines = max(minor, major);

  vec3 lineColor = mix(uLine, uAccent, smoothstep(0.08, 0.55, vMouse));
  // Faint snow on the high ground gives the terrain body between lines.
  vec3 ground = uBg + vec3(0.035, 0.032, 0.028) * smoothstep(0.8, 3.2, vHeight);

  float fog = smoothstep(22.0, 5.0, vDepth);
  vec3 col = mix(ground, lineColor, lines * (0.35 + 0.65 * fog));
  col = mix(uBg, col, fog * uOpacity);
  gl_FragColor = vec4(col, 1.0);
  #include <colorspace_fragment>
}
`;

const BG = new THREE.Color("#0c0b09");

function Terrain({ animate }: { animate: boolean }) {
  const { camera } = useThree();
  const mat = useRef<THREE.ShaderMaterial>(null);

  const geometry = useMemo(() => {
    const g = new THREE.PlaneGeometry(34, 34, 360, 360);
    g.rotateX(-Math.PI / 2);
    g.translate(0, 0, -8);
    return g;
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uTravel: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 100) },
      uMouseStrength: { value: 0 },
      uOpacity: { value: 0 },
      uBg: { value: BG.clone() },
      uLine: { value: new THREE.Color("#ede7db") },
      uAccent: { value: new THREE.Color("#ff5a1f") },
    }),
    [],
  );

  const ray = useMemo(() => new THREE.Raycaster(), []);
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), -1), []);
  const hit = useMemo(() => new THREE.Vector3(), []);
  const ndc = useMemo(() => new THREE.Vector2(), []);
  const look = useMemo(() => new THREE.Vector3(0, 0.8, 0), []);
  const lastPointer = useRef({ x: 0, y: 0 });

  useFrame((_, delta) => {
    const u = mat.current!.uniforms;
    const dt = Math.min(delta, 0.05);
    const { pointer, progress } = heroState;

    if (animate) u.uTime.value += dt;
    u.uTravel.value = progress * 1.4;
    u.uOpacity.value += (1 - u.uOpacity.value) * dt * 1.5;

    // Camera drifts with the pointer and sinks toward the peaks on scroll.
    const tx = pointer.x * 0.8;
    const ty = 3.1 + pointer.y * 0.35 - progress * 1.6;
    const tz = 7.5 - progress * 3;
    camera.position.x += (tx - camera.position.x) * dt * 2.5;
    camera.position.y += (ty - camera.position.y) * dt * 2.5;
    camera.position.z += (tz - camera.position.z) * dt * 2.5;
    camera.lookAt(look);

    // Project the pointer onto the terrain and grow a summit under it while it moves.
    ndc.set(pointer.x, pointer.y);
    ray.setFromCamera(ndc, camera);
    if (ray.ray.intersectPlane(plane, hit)) {
      const m = u.uMouse.value as THREE.Vector2;
      m.x += (hit.x - m.x) * dt * 6;
      m.y += (hit.z - m.y) * dt * 6;
    }
    const moved = Math.hypot(pointer.x - lastPointer.current.x, pointer.y - lastPointer.current.y);
    lastPointer.current = { ...pointer };
    const target = Math.min(1, u.uMouseStrength.value + moved * 4);
    u.uMouseStrength.value += (target - u.uMouseStrength.value) * 0.5;
    // A small resting summit stays under the cursor once it has shown up.
    const floor = heroState.pointerActive ? 0.35 : 0;
    u.uMouseStrength.value = Math.max(floor, u.uMouseStrength.value - dt * 0.4);
  });

  return (
    <mesh geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  );
}

export default function HeroScene({ animate }: { animate: boolean }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  // Stop rendering entirely once the hero is off-screen.
  useEffect(() => {
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    io.observe(wrapRef.current!);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className="hero__canvas" aria-hidden="true">
      <Canvas
        frameloop={visible ? "always" : "never"}
        dpr={[1, 1.75]}
        camera={{ fov: 42, position: [0, 3.1, 7.5], near: 0.1, far: 60 }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <color attach="background" args={[BG]} />
        <Terrain animate={animate} />
      </Canvas>
    </div>
  );
}
