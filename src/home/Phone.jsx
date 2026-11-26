import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

/* ============================================================
   🔧 Phone motion path — tweak these values to change the
   intro animation and the scroll-driven choreography.
   ============================================================ */

const INTRO_DURATION = 3;
const INTRO_START_SCALE = 0.7;
const INTRO_TARGET_SCALE = 0.8;
const INTRO_START_Y = 0;
const INTRO_TARGET_Y = -0.4;
const INTRO_START_OPACITY = 0.2;
const INTRO_TARGET_OPACITY = 1;

const SCROLL_KEYFRAMES = [
  { progress: 0.0, x: 1.0, y: 0.0, rotX: -0.5, rotY: -2.5, rotZ: -0.5, scaleMultiplier: 1.0 },
  { progress: 0.13, x: 2.0, y: -0.3, rotX: 0.0, rotY: -1.4, rotZ: 0.0, scaleMultiplier: 0.85 },
  { progress: 0.24, x: 2.0, y: -0.3, rotX: 0.0, rotY: -1.45, rotZ: 0.0, scaleMultiplier: 0.85 },
  { progress: 0.28, x: 2.0, y: -0.5, rotX: 0.0, rotY: -4.0, rotZ: 0.0, scaleMultiplier: 0.99 },
  { progress: 0.37, x: 2.0, y: -0.5, rotX: 0.0, rotY: -4.05, rotZ: 0.0, scaleMultiplier: 0.99 },
  { progress: 0.44, x: 2.0, y: -0.5, rotX: -0.3, rotY: -2.5, rotZ: 0.0, scaleMultiplier: 0.9 },
  { progress: 0.587, x: 2.0, y: -0.5, rotX: -0.35, rotY: -2.55, rotZ: 0.0, scaleMultiplier: 0.9 },
  { progress: 0.7, x: 2.0, y: -0.5, rotX: -0.35, rotY: -2.55, rotZ: 0.0, scaleMultiplier: 0.9 },
];

const SCROLL_FADE_START = 0.68;
const SCROLL_FADE_END = 0.8;
export const MODEL_PATH = '/phone.glb';

function getInterpolatedKeyframe(progress) {
  const frames = SCROLL_KEYFRAMES;
  if (progress <= frames[0].progress) return frames[0];
  if (progress >= frames[frames.length - 1].progress) return frames[frames.length - 1];

  let i = 0;
  while (i < frames.length - 1 && frames[i + 1].progress < progress) i++;

  const start = frames[i];
  const end = frames[i + 1];
  const t = (progress - start.progress) / (end.progress - start.progress);
  const lerp = THREE.MathUtils.lerp;

  return {
    x: lerp(start.x, end.x, t),
    y: lerp(start.y, end.y, t),
    rotX: lerp(start.rotX, end.rotX, t),
    rotY: lerp(start.rotY, end.rotY, t),
    rotZ: lerp(start.rotZ, end.rotZ, t),
    scaleMultiplier: lerp(start.scaleMultiplier, end.scaleMultiplier, t),
  };
}

/** Deep-clones a GLTF scene with its own materials so instances never leak state into each other. */
export function useIsolatedScene(path) {
  const { scene } = useGLTF(path);
  return useMemo(() => {
    const clone = scene.clone(true);
    const meshes = [];
    clone.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material = child.material.clone();
        meshes.push(child);
      }
    });
    return { scene: clone, meshes };
  }, [scene]);
}

/**
 * Hero phone. Reads scroll progress from a ref (instead of React state) so
 * scrolling never re-renders the page — only the WebGL frame loop reacts.
 */
export default function Phone({
  progressRef,
  phoneColor = '#717171',
  roughness = 0.07,
  metalness = 0.05,
  isMobile = false,
}) {
  const group = useRef();
  const { scene, meshes } = useIsolatedScene(MODEL_PATH);
  const introProgress = useRef(0);
  const lastTransparent = useRef(null);
  const { viewport } = useThree();

  useLayoutEffect(() => {
    meshes.forEach((mesh) => {
      mesh.material.color.set(phoneColor);
      if ('roughness' in mesh.material) mesh.material.roughness = roughness;
      if ('metalness' in mesh.material) mesh.material.metalness = metalness;
    });
  }, [meshes, phoneColor, roughness, metalness]);

  useFrame((_, delta) => {
    if (!group.current) return;
    const scrollProgress = progressRef.current;

    group.current.visible = scrollProgress < SCROLL_FADE_END;
    if (!group.current.visible) return;

    // 1. Intro animation
    if (introProgress.current < 1) {
      introProgress.current = Math.min(introProgress.current + delta / INTRO_DURATION, 1);
    }
    const eased = 1 - Math.pow(1 - introProgress.current, 3);
    const introScale = THREE.MathUtils.lerp(INTRO_START_SCALE, INTRO_TARGET_SCALE, eased);
    const introY = THREE.MathUtils.lerp(INTRO_START_Y, INTRO_TARGET_Y, eased);
    const introOpacity = THREE.MathUtils.lerp(INTRO_START_OPACITY, INTRO_TARGET_OPACITY, eased);

    // 2. Scroll choreography with damping
    const frame = getInterpolatedKeyframe(scrollProgress);
    const responsiveScaleFactor = Math.min(viewport.width / 4, 1.2);
    const targetScale = introScale * frame.scaleMultiplier * responsiveScaleFactor * (isMobile ? 0.54 : 1);
    const responsiveXFactor = viewport.width < 5 ? 0 : isMobile ? 0.35 : 1;
    const mobileYOffset = isMobile ? 1.05 : 0;
    const targetX = frame.x * responsiveXFactor;
    const targetY = introY + frame.y + mobileYOffset;

    const damp = THREE.MathUtils.damp;
    const speed = 10;
    group.current.position.x = damp(group.current.position.x, targetX, speed, delta);
    group.current.position.y = damp(group.current.position.y, targetY, speed, delta);
    group.current.rotation.x = damp(group.current.rotation.x, frame.rotX, speed, delta);
    group.current.rotation.y = damp(group.current.rotation.y, frame.rotY, speed, delta);
    group.current.rotation.z = damp(group.current.rotation.z, frame.rotZ, speed, delta);
    group.current.scale.setScalar(damp(group.current.scale.x, targetScale, speed, delta));

    // 3. Fade out in place at the end of the story
    let scrollFade = 1;
    if (scrollProgress > SCROLL_FADE_START) {
      scrollFade =
        1 - THREE.MathUtils.clamp((scrollProgress - SCROLL_FADE_START) / (SCROLL_FADE_END - SCROLL_FADE_START), 0, 1);
    }

    const finalOpacity = introOpacity * scrollFade;
    const transparent = finalOpacity < 0.99;
    const changed = lastTransparent.current !== transparent;
    lastTransparent.current = transparent;

    meshes.forEach((mesh) => {
      mesh.material.transparent = transparent;
      mesh.material.opacity = transparent ? finalOpacity : 1;
      if (changed) mesh.material.needsUpdate = true;
    });
  });

  return (
    <group ref={group} dispose={null}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload(MODEL_PATH);
