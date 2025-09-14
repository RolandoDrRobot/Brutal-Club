import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Text } from '@mantine/core';
import '../styles/fightAnimations.css';
import coverbgImg from '../assets/optimized/coverbg.webp';
import coinImg from '../assets/optimized/coin.webp';

const CoinPurchaseResultModal = ({ 
  isVisible, 
  onClose, 
  coinAmount,
  packageName
}) => {
  const [particles, setParticles] = useState([]);


  useEffect(() => {
    if (isVisible) {
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 0.5,
        scale: 0.6 + Math.random() * 0.4,
        rotation: Math.random() * 360
      }));
      setParticles(newParticles);


      const timer = setTimeout(() => {
        onClose();
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);


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
        duration: 2.2,
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

  const coinVariants = {
    hidden: { scale: 0, opacity: 0, rotate: -180 },
    visible: {
      scale: [0, 1.4, 1],
      opacity: 1,
      rotate: 0,
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
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100000,
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
                width: '12px',
                height: '12px',
                backgroundColor: '#bbb092',
                borderRadius: '50%',
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                boxShadow: '0 0 12px #bbb092',
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
                  fontSize: '28px',
                  fontWeight: 700,
                  color: '#bbb092',
                  fontFamily: 'Anton, sans-serif',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  marginBottom: '20px'
                }}
              >
                Coins Obtained!
              </Text>
            </div>


            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '15px',
                marginBottom: '15px',
                animation: 'electricFadeIn 0.8s ease-out 0.4s both'
              }}
            >
              <img
                src={coinImg}
                alt="Coin"
                style={{
                  width: '50px',
                  height: '50px'
                }}
              />
              <Text
                style={{
                  fontSize: '56px',
                  fontWeight: 900,
                  color: '#bbb092',
                  fontFamily: 'Anton, sans-serif',
                  letterSpacing: '3px',
                  animation: 'electricPulse 0.7s ease-out 0.6s both'
                }}
              >
                +{coinAmount}
              </Text>
            </div>


            <div
              style={{
                animation: 'electricGlitch 0.7s ease-out 0.8s both'
              }}
            >
              <Text
                style={{
                  fontSize: '18px',
                  fontWeight: 600,
                  color: '#bbb092',
                  fontFamily: 'Anton, sans-serif',
                  letterSpacing: '1px',
                  textTransform: 'uppercase'
                }}
              >
                {packageName}
              </Text>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CoinPurchaseResultModal;
