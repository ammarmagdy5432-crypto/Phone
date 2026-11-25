// src/PhoneOrbit.jsx
import React, { useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Center, Environment, ContactShadows } from '@react-three/drei';

const MODEL_PATH = '/zz.glb';

function PhoneModelInternal({ phoneColor }) {
  const { scene, materials } = useGLTF(MODEL_PATH);

  useEffect(() => {
    const targetMaterial = materials['Body'] || Object.values(materials)[0];
    if (targetMaterial) {
      targetMaterial.color.set(phoneColor);
      targetMaterial.needsUpdate = true;
    }
  }, [phoneColor, materials]);

  return <primitive object={scene} scale={1} position={[0, 0, 0]} rotation={[0, Math.PI, 0]} />;
}

useGLTF.preload(MODEL_PATH);

export default function PhoneModell({ phoneColor }) {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={1.5} />
        <directionalLight position={[3, 5, 2]} intensity={1.3} />
        <Environment preset="city" />

        <Suspense fallback={null}>
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
          autoRotate
          autoRotateSpeed={1.2}
        />
      </Canvas>
    </div>
  );
}