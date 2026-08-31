import { useState } from 'react';
import { motion } from 'framer-motion';
import download from './iphone.webp';
import PhoneModell from './PhoneOrbit'

// 1. تعريف مصفوفة الألوان المتاحة
const colors = [
  { name: 'Natural', hex: '#8f8a81' },
  { name: 'Gray', hex: 'gray' },
  { name: 'White', hex: '#f2f2f2' },
  { name: 'Black', hex: '#1c1c1e' },
];

export default function ColorPickerSection() {
  // 2. تعريف حالة اللون المختار (افتراضياً أول لون)
  const [phoneColor, setPhoneColor] = useState(colors[0].hex);

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.7, ease: "easeOut" } 
    }
  };

  const fadeInRight = {
    hidden: { opacity: 0, x: -50 },
    visible: { 
      opacity: 1, 
      x: 0, 
      transition: { duration: 0.7, ease: "easeOut" } 
    }
  };

  const scaleUp = {
    hidden: { opacity: 0, scale: 1 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      transition: { duration: 0.8, ease: "easeOut" } 
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.2 }}
      style={{ width: '100%' }}
    >

      <div style={{ background: 'radial-gradient(circle at center, #1b1a1a 0%, #000000 50%)', width: '100%', color: 'white', padding: '40px 16px 80px' }}>
      <motion.h1 
        variants={fadeInUp}
        className="st" 
        style={{ justifySelf:"left",
          marginTop: "clamp(80px, 15vw, 0)", 
          color: 'rgba(255, 255, 255, 0.74)'
        }}
      >
        Choose your favorite Color
      </motion.h1>
        <div className="color-picker-columns">
          
          <motion.div 
            className="color-buttons-col" 
            variants={{
              visible: { transition: { staggerChildren: 0.12 } }
            }}
          >
            {colors.map((color) => (
              <motion.button
                key={color.hex}
                variants={fadeInRight}
                onClick={() => setPhoneColor(color.hex)}
                className="color-btn"
                style={{
                  border: phoneColor === color.hex ? '2px solid #fff' : 'none',
                  backgroundColor: color.hex,
                }}
              >
                {color.name}
              </motion.button>
            ))}
          </motion.div>

          <motion.div 
            variants={scaleUp}
            className="phone-preview-col"
          >
            <div className="phone-preview-stage">
      
              <div className="phone-preview-3d">
                <PhoneModell phoneColor={phoneColor} />
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </motion.div>
  );
}
