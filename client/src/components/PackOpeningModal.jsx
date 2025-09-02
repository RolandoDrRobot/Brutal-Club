import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Text, Button } from '@mantine/core';
import packImg from '../assets/pack.png';
import coverbgImg from '../assets/coverbg.png';

const PackOpeningModal = ({ 
  isVisible, 
  onClose, 
  packContents = []
}) => {
  const [currentStep, setCurrentStep] = useState('opening'); // 'opening', 'revealing'
  const [revealedItems, setRevealedItems] = useState([]);
  const [particles, setParticles] = useState([]);

  // Generate star particles for pack opening
  useEffect(() => {
    console.log('PackOpeningModal useEffect:', { isVisible, currentStep, packContents });
    if (isVisible && currentStep === 'opening') {
      console.log('Starting pack opening animation...');
      const newParticles = Array.from({ length: 40 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 1.5,
        scale: 0.5 + Math.random() * 0.8,
        rotation: Math.random() * 360,
        color: Math.random() > 0.3 ? '#FFD700' : '#FFF'
      }));
      setParticles(newParticles);

      // Start revealing items after pack opening animation
      const revealTimer = setTimeout(() => {
        console.log('Transitioning to revealing step...');
        setCurrentStep('revealing');
        setRevealedItems(packContents);
      }, 3000);

      return () => clearTimeout(revealTimer);
    }
  }, [isVisible, currentStep, packContents]);



  // Reset when modal closes
  useEffect(() => {
    if (!isVisible) {
      setCurrentStep('opening');
      setRevealedItems([]);
      setParticles([]);
    }
  }, [isVisible]);

  // Particle variants
  const particleVariants = {
    hidden: { 
      scale: 0, 
      opacity: 0,
      x: 0,
      y: 0
    },
    visible: (custom) => ({
      scale: [0, custom.scale, custom.scale * 0.5, 0],
      opacity: [0, 1, 1, 0],
      y: [0, -120, -200, -300],
      x: [0, (Math.random() - 0.5) * 300],
      rotate: [0, custom.rotation, custom.rotation * 3, custom.rotation * 4],
      transition: {
        duration: 3.5,
        delay: custom.delay,
        ease: "easeOut"
      }
    })
  };

  const packVariants = {
    opening: {
      scale: [1, 1.2, 0.8, 1.5, 0],
      rotate: [0, 5, -5, 10, -10, 0],
      opacity: [1, 1, 1, 1, 0],
      transition: {
        duration: 2,
        ease: "easeInOut"
      }
    }
  };

  const itemVariants = {
    hidden: { 
      scale: 0, 
      opacity: 0,
      y: 50,
      rotateY: 180
    },
    visible: (index) => ({
      scale: [0, 1.2, 1],
      opacity: 1,
      y: 0,
      rotateY: 0,
      transition: {
        delay: index * 0.3,
        duration: 0.8,
        ease: "easeOut"
      }
    })
  };

  const getItemTypeColor = (type) => {
    switch (type) {
      case 'character': return '#FFD700'; // Gold for characters (rare)
      case 'stat_points': return '#f32210'; // Red for stat points
      default: return '#F5F5DC';
    }
  };

  const getItemTypeIcon = (type) => {
    switch (type) {
      case 'character': return '';
      case 'stat_points': return '';
      default: return '';
    }
  };

  const getRarityText = (type) => {
    switch (type) {
      case 'character': return 'LEGENDARY';
      case 'stat_points': return 'COMMON';
      default: return 'ITEM';
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
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            pointerEvents: 'auto'
          }}
          onClick={currentStep === 'revealing' ? onClose : undefined}
        >
          {/* Star particles */}
          {currentStep === 'opening' && particles.map((particle) => (
            <motion.div
              key={particle.id}
              custom={particle}
              variants={particleVariants}
              initial="hidden"
              animate="visible"
              style={{
                position: 'absolute',
                width: '16px',
                height: '16px',
                left: '50%',
                top: '50%',
                pointerEvents: 'none',
                fontSize: '16px',
                color: particle.color,
                textShadow: `0 0 10px ${particle.color}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ⭐
            </motion.div>
          ))}

          {/* Pack Opening Animation */}
          {currentStep === 'opening' && (
            <motion.div
              variants={packVariants}
              animate="opening"
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                filter: 'drop-shadow(0 0 20px #FFD700)'
              }}
            >
              <img 
                src={packImg}
                alt="Fighter Pack"
                style={{
                  height: '45dvh'
                }}
              />
            </motion.div>
          )}

          {/* Items Reveal */}
          {currentStep === 'revealing' && (
            <Box
              style={{
                backgroundImage: `url(${coverbgImg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: '15px',
                margin: '25px',
                padding: '40px',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
                minWidth: '400px',
                maxWidth: '600px'
              }}
            >
              {/* Header */}
              <motion.div
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                <Text
                  style={{
                    fontSize: '36px',
                    fontWeight: 900,
                    color: '#FFD700',
                    fontFamily: 'Anton, sans-serif',
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    marginBottom: '30px'
                  }}
                >
                  Pack Opened!
                </Text>
              </motion.div>

              {/* Items Grid */}
              <Box style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '20px',
                marginBottom: '30px'
              }}>
                {revealedItems.map((item, index) => (
                  <motion.div
                    key={index}
                    custom={index}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    style={{
                      borderRadius: '10px',
                      padding: '20px',
                      position: 'relative',
                      boxShadow: `0 0 15px ${getItemTypeColor(item.type)}40`
                    }}
                  >
                    {/* Rarity Badge */}
                    <Box
                      style={{
                        position: 'absolute',
                        top: '-10px',
                        right: '10px',
                        backgroundColor: getItemTypeColor(item.type),
                        color: item.type === 'character' ? '#000' : '#fff',
                        fontSize: '10px',
                        fontWeight: 900,
                        padding: '4px 8px',
                        borderRadius: '0px',
                        fontFamily: 'Anton, sans-serif',
                        letterSpacing: '0.5px'
                      }}
                    >
                      {getRarityText(item.type)}
                    </Box>

                    {/* Item Icon */}
                    {getItemTypeIcon(item.type) && (
                      <Text style={{
                        fontSize: '50px',
                        marginBottom: '10px'
                      }}>
                        {getItemTypeIcon(item.type)}
                      </Text>
                    )}

                    {/* Item Info */}
                    <Text
                      style={{
                        fontSize: '24px',
                        fontWeight: 700,
                        color: getItemTypeColor(item.type),
                        fontFamily: 'Anton, sans-serif',
                        letterSpacing: '1px',
                        textTransform: 'uppercase',
                        marginBottom: '5px'
                      }}
                    >
                      {item.name}
                    </Text>

                    {item.type === 'stat_points' && (
                      <Text
                        style={{
                          fontSize: '18px',
                          fontWeight: 600,
                          color: '#F5F5DC',
                          fontFamily: 'Anton, sans-serif',
                          letterSpacing: '0.5px'
                        }}
                      >
                        +{item.amount} stat points
                      </Text>
                    )}

                    {item.type === 'character' && (
                      <Text
                        style={{
                          fontSize: '16px',
                          fontWeight: 600,
                          color: '#F5F5DC',
                          fontFamily: 'Anton, sans-serif',
                          letterSpacing: '0.5px'
                        }}
                      >
                        {item.description}
                      </Text>
                    )}
                  </motion.div>
                ))}
              </Box>

              {/* Continue button */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.6 }}
              >
                <Button
                  onClick={onClose}
                  style={{
                    fontSize: '24px',
                    fontWeight: 700,
                    padding: '0',
                    backgroundColor: 'transparent',
                    borderRadius: '0px',
                    color: '#FFD700',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    fontFamily: 'Anton, sans-serif',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  CONTINUE
                </Button>
              </motion.div>
            </Box>
          )}


        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PackOpeningModal;
