import { useEffect, useState ,Suspense} from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, ContactShadows,OrbitControls, SpotLight } from '@react-three/drei'
import Phone from './Phone'
import PhoneModell from './PhoneOrbit'
import StickyTextScroll from './Text'
import AppleNavbar from './NavBar'
import AppleFooter from './foter'
import PowerSection from './Section'
import ColorPickerSection from './OrbitSection'
import download from './iphone.webp';
import { AmbientLight } from 'three';
  import { motion } from 'framer-motion'; 
  import useViewport from './useViewport'

export default function App() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [phoneColor, setPhoneColor] = useState('#1c1c1e')
  const { isMobile, isTablet } = useViewport()

  useEffect(() => {
    const handleScroll = () => {
      const totalScrollableHeight = document.documentElement.scrollHeight - window.innerHeight
      if (totalScrollableHeight <= 0) return

      const currentScroll = window.scrollY
      const progress = Math.min(Math.max(currentScroll / totalScrollableHeight, 0), 1)

      setScrollProgress(progress)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const colors = [
    { name: 'Black', hex: '#070200' },
    { name: 'Selver', hex: '#989797' },
    { name: 'Navy  ', hex: '#020c27' },
    { name: 'Gray', hex: '#4f4e4e' },
  ]

  return (
    <div>
      
      <AppleNavbar/>
      {/* الكانفاس يظل بـ zIndex: 10 عشان التلفون يفضل باين فوق الخلفيات */}
      <div className="phone"
        style={{
          position: 'fixed',
          inset: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 10,
          
          
          // يسمح للماوس بالسكرول والنقر عبر المساحات الفاضية
        }}
      >


        <Canvas camera={{ position: [0, 0, isMobile ? 6.2 : 5], fov: isMobile ? 50 : 45 }}>

          <ambientLight intensity={1.5} />
        <directionalLight position={[3, 5, 2]} intensity={1.3} />
          
          <Phone scrollProgress={scrollProgress} phoneColor={phoneColor} isMobile={isMobile} />

          <Environment preset="city" />
          <ContactShadows position={[0, -1.4, 0]} opacity={0.35} blur={2.5} far={3} />
        </Canvas>

      </div>

{/* ===================== القسم الأول (Hero) ===================== */}
<section 
className="h1Text"
  style={{
    height: '80vh',
    position: 'relative',
    overflow: 'hidden',
    background: 'radial-gradient(circle at center, #252525 0%, #000000 50%)',
    zIndex: 2
  }}
>
  <motion.div 
    initial={{ opacity: 0, x: -90 }}
    animate={{ opacity: 0.5, x: 0 }}
    transition={{ duration: 2.2, ease: "easeOut" }}
    className="hero-copy"
  >
    <h1 className="hero-title"> IPhone 15 </h1>
    <h2 className="hero-subtitle">Pro</h2>
  </motion.div>
</section>
      <StickyTextScroll/>

      {/* ===================== قسم المحتوى والأزرار ===================== */}
      
  
<PowerSection/>
 <ColorPickerSection/>




      
      {/* عرض المكون */}
        <AppleFooter/>
        
    </div>
  )
}