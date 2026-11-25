import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

/* ============================================================
   🔧 التحكم في مسار حركة وميلان الهاتف
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
  { progress: 0.70, x: 2.0, y: -0.5, rotX: -0.35, rotY: -2.55, rotZ: 0.0, scaleMultiplier: 0.9 },
];

const SCROLL_FADE_START = 0.68;
const SCROLL_FADE_END = 0.80;
const MODEL_PATH = '/phone.glb';

function getInterpolatedKeyframe(progress) {
  const frames = SCROLL_KEYFRAMES;

  if (progress <= frames[0].progress) return frames[0];
  if (progress >= frames[frames.length - 1].progress) return frames[frames.length - 1];

  let i = 0;
  while (i < frames.length - 1 && frames[i + 1].progress < progress) {
    i++;
  }

  const start = frames[i];
  const end = frames[i + 1];
  const segmentProgress = (progress - start.progress) / (end.progress - start.progress);

  return {
    x: THREE.MathUtils.lerp(start.x, end.x, segmentProgress),
    y: THREE.MathUtils.lerp(start.y, end.y, segmentProgress),
    rotX: THREE.MathUtils.lerp(start.rotX, end.rotX, segmentProgress),
    rotY: THREE.MathUtils.lerp(start.rotY, end.rotY, segmentProgress),
    rotZ: THREE.MathUtils.lerp(start.rotZ, end.rotZ, segmentProgress),
    scaleMultiplier: THREE.MathUtils.lerp(start.scaleMultiplier, end.scaleMultiplier, segmentProgress),
  };
}

export default function Phone({
  scrollProgress = 0,
  phoneColor = '#717171',
  roughness = 0.07,
  metalness = 0.05,
  isMobile = false,
}) {
  const group = useRef();
  const { scene } = useGLTF(MODEL_PATH);
  const introProgress = useRef(0);
  const lastTransparent = useRef(null);

  const { viewport } = useThree();

  useFrame((state, delta) => {
    if (!group.current) return;

    group.current.visible = scrollProgress < SCROLL_FADE_END;

    // 1. أنيميشن الظهور
    if (introProgress.current < 1) {
      introProgress.current = Math.min(introProgress.current + delta / INTRO_DURATION, 1);
    }

    const eased = 1 - Math.pow(1 - introProgress.current, 3);
    const introScale = THREE.MathUtils.lerp(INTRO_START_SCALE, INTRO_TARGET_SCALE, eased);
    const introY = THREE.MathUtils.lerp(INTRO_START_Y, INTRO_TARGET_Y, eased);
    const introOpacity = THREE.MathUtils.lerp(INTRO_START_OPACITY, INTRO_TARGET_OPACITY, eased);

    // 2. أنيميشن السكرول مع تنعيم الحركة (Damping)
    const currentFrame = getInterpolatedKeyframe(scrollProgress);

    const responsiveScaleFactor = Math.min(viewport.width / 4, 1.2);
    const targetScale =
      introScale * currentFrame.scaleMultiplier * responsiveScaleFactor * (isMobile ? 0.68 : 1);

    const responsiveXFactor = viewport.width < 5 ? 0 : isMobile ? 0.45 : 1;
    const mobileYOffset = isMobile ? 0.65 : 0;

    const targetX = currentFrame.x * responsiveXFactor;
    const targetY = introY + currentFrame.y + mobileYOffset;

    const dampSpeed = 10;
    group.current.position.x = THREE.MathUtils.damp(group.current.position.x, targetX, dampSpeed, delta);
    group.current.position.y = THREE.MathUtils.damp(group.current.position.y, targetY, dampSpeed, delta);

    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, currentFrame.rotX, dampSpeed, delta);
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, currentFrame.rotY, dampSpeed, delta);
    group.current.rotation.z = THREE.MathUtils.damp(group.current.rotation.z, currentFrame.rotZ, dampSpeed, delta);

    const nextScale = THREE.MathUtils.damp(group.current.scale.x, targetScale, dampSpeed, delta);
    group.current.scale.setScalar(nextScale);

    // 3. التلاشي في نفس المكان عند انتهاء قسم السكرول
    let scrollFade = 1;
    if (scrollProgress > SCROLL_FADE_START) {
      scrollFade =
        1 -
        THREE.MathUtils.clamp(
          (scrollProgress - SCROLL_FADE_START) / (SCROLL_FADE_END - SCROLL_FADE_START),
          0,
          1
        );
    }

    const finalOpacity = introOpacity * scrollFade;
    const shouldBeTransparent = finalOpacity < 0.99;
    const transparencyChanged = lastTransparent.current !== shouldBeTransparent;
    lastTransparent.current = shouldBeTransparent;

    // 4. تطبيق الخصائص والـ Material على الموديل بكفاءة
    group.current.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.color.set(phoneColor);

        if ('roughness' in child.material) {
          child.material.roughness = roughness;
        }
        if ('metalness' in child.material) {
          child.material.metalness = metalness;
        }

        if (shouldBeTransparent) {
          child.material.transparent = true;
          child.material.opacity = finalOpacity;
        } else {
          child.material.transparent = false;
          child.material.opacity = 1;
        }

        if (transparencyChanged) {
          child.material.needsUpdate = true;
        }
      }
    });
  });

  return (
    <group ref={group} dispose={null}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload(MODEL_PATH);