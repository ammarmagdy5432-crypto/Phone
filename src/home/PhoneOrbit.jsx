import { useEffect, useMemo, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Center, Environment, ContactShadows } from '@react-three/drei';
import { MODEL_PATH, useIsolatedScene } from './Phone';

/*
 * Interactive 360° viewer. Shares the hero's GLB file (one download) but works
 * on an isolated clone so recolouring here never affects the hero phone.
 */
function PhoneModelInternal({ phoneColor }) {
  const { scene, meshes } = useIsolatedScene(MODEL_PATH);

  const body = useMemo(
    () => meshes.find((m) => m.material.name === 'Body')?.material || meshes[0]?.material,
    [meshes]
  );

  useEffect(() => {
    if (!body) return;
    body.color.set(phoneColor);
    body.needsUpdate = true;
  }, [phoneColor, body]);

  return <primitive object={scene} scale={1} position={[0, 0, 0]} rotation={[0, Math.PI, 0]} />;
}

export default function PhoneOrbit({ phoneColor, autoRotate = true }) {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={1.5} />
        <directionalLight position={[3, 5, 2]} intensity={1.3} />

        <Suspense fallback={null}>
          <Environment preset="city" />
          <Center>
            <PhoneModelInternal phoneColor={phoneColor} />
          </Center>
          <ContactShadows position={[0, -1.5, 0]} opacity={0.4} blur={2.4} far={3.5} />
        </Suspense>

        <OrbitControls
          makeDefault
          enablePan={false}
          enableZoom={false}
          enableDamping
          dampingFactor={0.08}
          autoRotate={autoRotate}
          autoRotateSpeed={1.2}
        />
      </Canvas>
    </div>
  );
}
