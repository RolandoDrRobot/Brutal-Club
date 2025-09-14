import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Text } from '@mantine/core';
import { useParticleEffects, useModalEffects } from '../hooks/useEffects';
import '../styles/fightAnimations.css';
import coverbgImg from '../assets/optimized/coverbg.webp';

const StatUpgradeModal = ({ 
  isVisible, 
  onClose, 
  newLevel
}) => {
  const { createStatUpgradeEffect } = useParticleEffects();
  const { createDefaultModal, getTextVariants } = useModalEffects();
  
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (isVisible) {
      const effect = createStatUpgradeEffect();
      setParticles(effect.particles);

      const timer = setTimeout(() => {
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  const particleVariants = createStatUpgradeEffect().variants;
  const modalVariants = createDefaultModal();
  const textVariants = getTextVariants();
  const statColor = '#A00000';

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
            height: '100dvh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            pointerEvents: 'auto'
          }}
          onClick={onClose}
        >

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


          <div
            style={{
              backgroundImage: `url(${coverbgImg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              width: '100vw',
              height: '100dvh',
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

            <div
              style={{
                animation: 'electricTitle 0.8s ease-out 0.2s both'
              }}
            >
              <Text
                style={{
                  fontSize: '20px',
                  fontWeight: 700,
                  color: '#bbb092',
                  fontFamily: 'Anton, sans-serif',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  marginBottom: '15px'
                }}
              >
                UPGRADED!
              </Text>
            </div>




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
                  color: '#bbb092',
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
