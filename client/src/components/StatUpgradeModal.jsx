import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Text } from '@mantine/core';
import '../styles/fightAnimations.css';
import coverbgImg from '../assets/optimized/coverbg.webp';

const StatUpgradeModal = ({ 
  isVisible, 
  onClose, 
  statName, 
  newLevel, 
  characterName,
  statDisplayName 
}) => {
  const [particles, setParticles] = useState([]);

  // Generate particles for animation
  useEffect(() => {
    if (isVisible) {
      const newParticles = Array.from({ length: 15 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 0.5,
        scale: 0.5 + Math.random() * 0.5,
        rotation: Math.random() * 360
      }));
      setParticles(newParticles);

      // Auto close after 3 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  // Use red for all stats as requested
  const getStatColor = (stat) => {
    return '#f32210'; // Player red for all stats
  };

  const statColor = getStatColor(statName);

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
      y: [20, -50, -100],
      x: [0, (custom.x - 50) * 2],
      rotate: custom.rotation,
      transition: {
        duration: 2,
        delay: custom.delay,
        ease: "easeOut"
      }
    })
  };

  const modalVariants = {
    hidden: {
      scale: 0,
      opacity: 0,
      rotate: -10,
      y: 100
    },
    visible: {
      scale: 1,
      opacity: 1,
      rotate: 0,
      y: 0,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 300,
        duration: 0.6
      }
    },
    exit: {
      scale: 0,
      opacity: 0,
      rotate: 10,
      y: -100,
      transition: {
        duration: 0.4,
        ease: "easeInOut"
      }
    }
  };

  const textVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: (delay = 0) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: 0.3 + delay,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  const levelNumberVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: [0, 1.3, 1],
      opacity: 1,
      transition: {
        delay: 0.5,
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const glowVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: [0, 1.5, 1],
      opacity: [0, 0.8, 0.3],
      transition: {
        delay: 0.2,
        duration: 1,
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
          {/* Particles */}
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              custom={particle}
              variants={particleVariants}
              initial="hidden"
              animate="visible"
              style={{
                position: 'absolute',
                width: '8px',
                height: '8px',
                backgroundColor: statColor,
                borderRadius: '0px',
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                boxShadow: `0 0 10px ${statColor}`,
                pointerEvents: 'none'
              }}
            />
          ))}

          {/* Main Modal */}
          <div
            style={{
              backgroundImage: `url(${coverbgImg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              width: '100vw',
              height: '100vh',
              padding: '40px',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              animation: 'electricEntry 0.8s ease-out'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Upgraded Text */}
            <div
              style={{
                animation: 'electricTitle 0.8s ease-out 0.2s both'
              }}
            >
              <Text
                style={{
                  fontSize: '20px',
                  fontWeight: 700,
                  color: '#FFD700',
                  fontFamily: 'Anton, sans-serif',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  marginBottom: '15px'
                }}
              >
                UPGRADED!
              </Text>
            </div>



            {/* Level Display */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '15px',
                animation: 'electricPulse 0.8s ease-out 0.4s both'
              }}
            >
              <Text
                style={{
                  fontSize: '48px',
                  fontWeight: 900,
                  color: '#FFD700',
                  fontFamily: 'Anton, sans-serif',
                  letterSpacing: '2px'
                }}
              >
                LEVEL {newLevel}
              </Text>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StatUpgradeModal;
