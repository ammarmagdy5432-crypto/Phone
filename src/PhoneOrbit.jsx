// src/PhoneOrbit.jsx
import React, { useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Center ,Environment} from '@react-three/drei';

const MODEL_PATH = '/zz.glb';

// 1️⃣ استلام phoneColor هنا وتحديث خامة الموديل
function PhoneModelInternal({ phoneColor }) {
  const { scene, materials } = useGLTF(MODEL_PATH);

  useEffect(() => {
    // تحديد الخامة المسؤولة عن لون الهاتف
    const targetMaterial = materials['Body'] || Object.values(materials)[0];
    if (targetMaterial) {
      targetMaterial.color.set(phoneColor);
    }
  }, [phoneColor, materials]);

  return <primitive object={scene} scale={1} position={[1, 0, 0]} rotation={[0, Math.PI, 0]}  />;
}

useGLTF.preload(MODEL_PATH);

// 2️⃣ استقبال phoneColor في المكون الرئيسي وتمريره للـ Model الداخلي
export default function PhoneModell({ phoneColor }) {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={1.5} />
        <directionalLight position={[3, 5, 2]} intensity={1.3} />
          <Environment preset="city" />
                                                          
        <Suspense fallback={null}>
          <Center>
            <PhoneModelInternal phoneColor={phoneColor} />
          </Center>
        </Suspense>

        <OrbitControls makeDefault enablePan={false} enableZoom={false} />
      </Canvas>
    </div>
  );
}