import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Text, Button } from '@mantine/core';

const PackOpeningModal = ({ 
  isVisible, 
  onClose, 
  packContents = []
}) => {
  const [currentStep, setCurrentStep] = useState('opening'); // 'opening', 'revealing', 'finished'
  const [revealedItems, setRevealedItems] = useState([]);
  const [particles, setParticles] = useState([]);

  // Generate particles for pack opening
  useEffect(() => {
    if (isVisible && currentStep === 'opening') {
      const newParticles = Array.from({ length: 25 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 1,
        scale: 0.3 + Math.random() * 0.4,
        rotation: Math.random() * 360,
        color: Math.random() > 0.5 ? '#FFD700' : '#f32210'
      }));
      setParticles(newParticles);

      // Start revealing items after pack opening animation
      const revealTimer = setTimeout(() => {
        setCurrentStep('revealing');
        setRevealedItems(packContents);
      }, 2000);

      return () => clearTimeout(revealTimer);
    }
  }, [isVisible, currentStep, packContents]);

  // Auto finish after showing items
  useEffect(() => {
    if (currentStep === 'revealing') {
      const finishTimer = setTimeout(() => {
        setCurrentStep('finished');
      }, 3000);

      return () => clearTimeout(finishTimer);
    }
  }, [currentStep]);

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
      scale: [0, custom.scale, 0],
      opacity: [0, 1, 0],
      y: [0, -80, -160],
      x: [0, (Math.random() - 0.5) * 200],
      rotate: [0, custom.rotation, custom.rotation * 2],
      transition: {
        duration: 2.5,
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
      case 'character': return '🥊';
      case 'stat_points': return '⚡';
      default: return '🎁';
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
          onClick={currentStep === 'finished' ? onClose : undefined}
        >
          {/* Explosion particles */}
          {currentStep === 'opening' && particles.map((particle) => (
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
                backgroundColor: particle.color,
                borderRadius: '50%',
                left: '50%',
                top: '50%',
                boxShadow: `0 0 10px ${particle.color}`,
                pointerEvents: 'none'
              }}
            />
          ))}

          {/* Pack Opening Animation */}
          {currentStep === 'opening' && (
            <motion.div
              variants={packVariants}
              animate="opening"
              style={{
                fontSize: '150px',
                filter: 'drop-shadow(0 0 20px #f32210)'
              }}
            >
              📦
            </motion.div>
          )}

          {/* Items Reveal */}
          {currentStep === 'revealing' && (
            <Box
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.95)',
                border: '4px solid #f32210',
                borderRadius: '20px',
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
                  🎁 Pack Opened!
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
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      border: `3px solid ${getItemTypeColor(item.type)}`,
                      borderRadius: '15px',
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
                        borderRadius: '10px',
                        fontFamily: 'Anton, sans-serif',
                        letterSpacing: '0.5px'
                      }}
                    >
                      {getRarityText(item.type)}
                    </Box>

                    {/* Item Icon */}
                    <Text style={{
                      fontSize: '50px',
                      marginBottom: '10px'
                    }}>
                      {getItemTypeIcon(item.type)}
                    </Text>

                    {/* Item Info */}
                    <Text
                      style={{
                        fontSize: '18px',
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
                          fontSize: '14px',
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
                          fontSize: '12px',
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
            </Box>
          )}

          {/* Finished State */}
          {currentStep === 'finished' && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.95)',
                border: '4px solid #FFD700',
                borderRadius: '20px',
                padding: '40px',
                textAlign: 'center'
              }}
            >
              <Text
                style={{
                  fontSize: '24px',
                  fontWeight: 700,
                  color: '#FFD700',
                  fontFamily: 'Anton, sans-serif',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  marginBottom: '20px'
                }}
              >
                Items added to your collection!
              </Text>
              
              <Button
                onClick={onClose}
                style={{
                  fontSize: '16px',
                  fontWeight: 700,
                  padding: '12px 30px',
                  backgroundColor: 'transparent',
                  border: '3px solid #FFD700',
                  borderRadius: '10px',
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
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PackOpeningModal;
