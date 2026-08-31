import { motion } from 'framer-motion';

export default function PowerSection() {
  const fadeInVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: "easeOut" } 
    }
  };

  return (
    <div 
      className="power-section"
      style={{ 
        justifySelf: "center", 
        alignContent: "center", 
        justifyItems: "center", 
        position: 'relative', 
        minHeight: '50vh', 
        backgroundColor: '#000000', 
        margin: '40px auto', 
        pointerEvents: 'auto', 
        color:'rgba(255, 255, 255, 0.74)'
      }}
    >
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ 
          once: false, // بيسمح للأنيماشن يتكرر كل ما تطلع وتنزل
          amount: 0.2  // بيشتغل لما يوصل 80% من أسفل الشاشة
        }}
        transition={{ staggerChildren: 0.15 }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}
      >
        <motion.h1 
          variants={fadeInVariant} 
          className="power-title"
          style={{ textAlign: 'center', margin: '10px 0' }}
        >
          New dimensions in power
        </motion.h1>

        <motion.h2 
          variants={fadeInVariant} 
          className="power-subtitle"
          style={{ textAlign: 'center', margin: '10px 0' }}
        >
          Battery life All-time high
        </motion.h2>

        <motion.h3 
          variants={fadeInVariant} 
          style={{ textAlign: 'center', margin: '10px 0' }}
        >
          Apple Intelligence Effortlessly helpful every day
        </motion.h3>

        <motion.div 
          variants={fadeInVariant}
          className="power-icons"
          style={{ display: 'flex', marginTop: '50px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}
        >
          <img 
            src="/images-removebg-preview (5).png" 
            alt="" 
          />
          <img 
            src="/34-347603_white-apple-logo-transparent-removebg-preview.png" 
            alt="" 
          />
          <img 
            src="/ios-icon-logo-software-phone-apple-symbol-name-white-design-mobile-illustration-with-black-background-free-vector-removebg-preview.png" 
            alt="" 
          />
        </motion.div>
      </motion.div>
    </div>
  );
}