import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Text } from '@mantine/core';

const CharacterPurchaseModal = ({ 
  isVisible, 
  onClose, 
  characterName,
  characterDescription,
  characterEmoji,
  coinsSpent 
}) => {
  const [particles, setParticles] = useState([]);

  // Generate particles for animation
  useEffect(() => {
    if (isVisible) {
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 0.7,
        scale: 0.5 + Math.random() * 0.5,
        rotation: Math.random() * 360
      }));
      setParticles(newParticles);

      // Auto close after 4 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  // Particle variants for different animations
  const particleVariants = {
    hidden: { 
      scale: 0, 
      opacity: 0,
      y: 20
    },
    visible: (custom) => ({
      scale: [0, custom.scale, 0],
      opacity: [0, 1, 0],
      y: [20, -60, -120],
      x: [0, (custom.x - 50) * 2.5],
      rotate: custom.rotation,
      transition: {
        duration: 2.5,
        delay: custom.delay,
        ease: "easeOut"
      }
    })
  };

  const modalVariants = {
    hidden: {
      scale: 0,
      opacity: 0,
      rotate: -15,
      y: 150
    },
    visible: {
      scale: 1,
      opacity: 1,
      rotate: 0,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 300,
        duration: 0.8
      }
    },
    exit: {
      scale: 0,
      opacity: 0,
      rotate: 15,
      y: -150,
      transition: {
        duration: 0.5,
        ease: "easeInOut"
      }
    }
  };

  const textVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: (delay = 0) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: 0.4 + delay,
        duration: 0.6,
        ease: "easeOut"
      }
    })
  };

  const characterNameVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: [0, 1.2, 1],
      opacity: 1,
      transition: {
        delay: 0.6,
        duration: 0.9,
        ease: "easeOut"
      }
    }
  };

  const emojiVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: [0, 1.3, 1],
      rotate: [0, 360, 0],
      transition: {
        delay: 0.3,
        duration: 1,
        ease: "easeOut"
      }
    }
  };

  const glowVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: [0, 2, 1.5],
      opacity: [0, 0.6, 0.2],
      transition: {
        delay: 0.2,
        duration: 1.2,
        ease: "easeOut"
      }
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            pointerEvents: 'auto'
          }}
          onClick={onClose}
        >
          {/* Gold coin particles */}
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              custom={particle}
              variants={particleVariants}
              initial="hidden"
              animate="visible"
              style={{
                position: 'absolute',
                width: '12px',
                height: '12px',
                backgroundColor: '#FFD700',
                borderRadius: '50%',
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                boxShadow: '0 0 15px #FFD700',
                pointerEvents: 'none'
              }}
            />
          ))}

          {/* Main Modal */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.95)',
              border: '4px solid #f32210',
              borderRadius: '20px',
              padding: '50px 40px',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              minWidth: '320px',
              maxWidth: '450px'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Background Glow */}
            <motion.div
              variants={glowVariants}
              initial="hidden"
              animate="visible"
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '250px',
                height: '250px',
                background: 'radial-gradient(circle, #f3221030 0%, transparent 70%)',
                transform: 'translate(-50%, -50%)',
                borderRadius: '50%',
                pointerEvents: 'none'
              }}
            />

            {/* Character Emoji */}
            <motion.div
              variants={emojiVariants}
              initial="hidden"
              animate="visible"
              style={{
                fontSize: '80px',
                marginBottom: '20px',
                filter: 'drop-shadow(0 0 15px #f32210)'
              }}
            >
              {characterEmoji || '🥊'}
            </motion.div>

            {/* Recruited Text */}
            <motion.div
              variants={textVariants}
              initial="hidden"
              animate="visible"
              custom={0}
            >
              <Text
                style={{
                  fontSize: '32px',
                  fontWeight: 900,
                  color: '#f32210',
                  fontFamily: 'Anton, sans-serif',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  marginBottom: '15px'
                }}
              >
                RECRUITED!
              </Text>
            </motion.div>

            {/* Character Name */}
            <motion.div
              variants={characterNameVariants}
              initial="hidden"
              animate="visible"
            >
              <Text
                style={{
                  fontSize: '28px',
                  fontWeight: 800,
                  color: '#FFD700',
                  fontFamily: 'Anton, sans-serif',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  marginBottom: '10px'
                }}
              >
                {characterName}
              </Text>
            </motion.div>

            {/* Character Description */}
            <motion.div
              variants={textVariants}
              initial="hidden"
              animate="visible"
              custom={0.1}
            >
              <Text
                style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#F5F5DC',
                  fontFamily: 'Anton, sans-serif',
                  letterSpacing: '0.5px',
                  marginBottom: '25px',
                  lineHeight: 1.3
                }}
              >
                {characterDescription}
              </Text>
            </motion.div>

            {/* Coins Spent */}
            <motion.div
              variants={textVariants}
              initial="hidden"
              animate="visible"
              custom={0.2}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                marginBottom: '15px'
              }}
            >
              <Text
                style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  color: '#FFD700',
                  fontFamily: 'Anton, sans-serif',
                  letterSpacing: '1px'
                }}
              >
                COST: {coinsSpent} COINS
              </Text>
              <motion.span
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{ fontSize: '20px' }}
              >
                🪙
              </motion.span>
            </motion.div>

            {/* Ready for Battle */}
            <motion.div
              variants={textVariants}
              initial="hidden"
              animate="visible"
              custom={0.3}
            >
              <Text
                style={{
                  fontSize: '20px',
                  fontWeight: 700,
                  color: '#f32210',
                  fontFamily: 'Anton, sans-serif',
                  letterSpacing: '1px',
                  textTransform: 'uppercase'
                }}
              >
                Ready for Battle!
              </Text>
            </motion.div>

            {/* Pulse Effect */}
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.2, 0.5, 0.2]
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                border: '2px solid #f32210',
                borderRadius: '20px',
                pointerEvents: 'none'
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CharacterPurchaseModal;
