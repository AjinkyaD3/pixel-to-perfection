import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [showLogo, setShowLogo] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Show logo immediately
    setShowLogo(true);
  
    // Hide splash screen after 2 seconds
    const splashTimer = setTimeout(() => {
      setShowSplash(false);
      onComplete();
    }, 2000);
  
    return () => clearTimeout(splashTimer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {showSplash && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background"
        >
          <div className="absolute inset-0 -z-10 cyber-grid opacity-20"></div>
          
          <AnimatePresence>
            {showLogo && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.5, opacity: 0 }}
                transition={{ 
                  type: "spring",
                  stiffness: 260,
                  damping: 20
                }}
                className="relative"
              >
                <div className="absolute inset-0 -z-10">
                  <div className="absolute inset-0 bg-neon-gradient animate-gradient-animation opacity-20 blur-xl"></div>
                </div>
                <img 
                  src="/logo.png" 
                  alt="Logo" 
                  className="w-32 h-32 md:w-48 md:h-48 object-contain"
                />
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    delay: 0.2,
                    type: "spring",
                    stiffness: 260,
                    damping: 20
                  }}
                  className="absolute -inset-4 border-2 border-neon-blue rounded-full"
                />
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    delay: 0.4,
                    type: "spring",
                    stiffness: 260,
                    damping: 20
                  }}
                  className="absolute -inset-8 border-2 border-neon-purple rounded-full"
                />
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    delay: 0.6,
                    type: "spring",
                    stiffness: 260,
                    damping: 20
                  }}
                  className="absolute -inset-12 border-2 border-neon-pink rounded-full"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen; 