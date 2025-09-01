import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Text, Button } from '@mantine/core';

const CoinPurchaseModal = ({ 
  isVisible, 
  onClose, 
  onPurchase
}) => {
  const [particles, setParticles] = useState([]);

  // Generate particles for animation
  useEffect(() => {
    if (isVisible) {
      const newParticles = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 0.5,
        scale: 0.5 + Math.random() * 0.3,
        rotation: Math.random() * 360
      }));
      setParticles(newParticles);
    }
  }, [isVisible]);

  // Coin packages data
  const coinPackages = [
    {
      id: 'small',
      coins: 10,
      price: '$2.99',
      color: '#FFD700',
      label: 'STARTER PACK',
      description: 'Perfect to get started'
    },
    {
      id: 'medium', 
      coins: 20,
      price: '$4.99',
      color: '#FF6B35',
      label: 'VALUE PACK',
      description: 'Best value for money',
      popular: true
    },
    {
      id: 'large',
      coins: 30,
      price: '$6.99', 
      color: '#f32210',
      label: 'MEGA PACK',
      description: 'Maximum coins!'
    }
  ];

  // Particle variants
  const particleVariants = {
    hidden: { 
      scale: 0, 
      opacity: 0,
      y: 20
    },
    visible: (custom) => ({
      scale: [0, custom.scale, 0],
      opacity: [0, 1, 0],
      y: [20, -40, -80],
      x: [0, (custom.x - 50) * 1.5],
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
      y: 100
    },
    visible: {
      scale: 1,
      opacity: 1,
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
      y: -100,
      transition: {
        duration: 0.4,
        ease: "easeInOut"
      }
    }
  };

  const packageVariants = {
    hidden: { y: 30, opacity: 0 },
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

  const handlePurchase = (packageData) => {
    onPurchase(packageData.coins);
    onClose();
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
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
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
                width: '10px',
                height: '10px',
                backgroundColor: '#FFD700',
                borderRadius: '50%',
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                boxShadow: '0 0 10px #FFD700',
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
              padding: '40px 30px',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              minWidth: '350px',
              maxWidth: '500px',
              width: '90%'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Text
                style={{
                  fontSize: '32px',
                  fontWeight: 900,
                  color: '#FFD700',
                  fontFamily: 'Anton, sans-serif',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  marginBottom: '10px'
                }}
              >
                🪙 Buy Coins
              </Text>
              
              <Text
                style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#F5F5DC',
                  fontFamily: 'Anton, sans-serif',
                  letterSpacing: '0.5px',
                  marginBottom: '30px',
                  lineHeight: 1.3
                }}
              >
                Choose your coin package to buy packs!
              </Text>
            </motion.div>

            {/* Coin Packages */}
            <Box style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '15px',
              marginBottom: '25px'
            }}>
              {coinPackages.map((pkg, index) => (
                <motion.div
                  key={pkg.id}
                  variants={packageVariants}
                  initial="hidden"
                  animate="visible"
                  custom={index * 0.1}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={() => handlePurchase(pkg)}
                    style={{
                      width: '100%',
                      height: '80px',
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      border: `3px solid ${pkg.color}`,
                      borderRadius: '15px',
                      padding: '15px 20px',
                      position: 'relative',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: pkg.popular ? `0 0 20px ${pkg.color}60` : `0 0 10px ${pkg.color}30`
                    }}
                  >
                    {/* Popular Badge */}
                    {pkg.popular && (
                      <Box
                        style={{
                          position: 'absolute',
                          top: '-10px',
                          right: '15px',
                          backgroundColor: '#FFD700',
                          color: '#000',
                          fontSize: '12px',
                          fontWeight: 900,
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontFamily: 'Anton, sans-serif',
                          letterSpacing: '1px'
                        }}
                      >
                        POPULAR
                      </Box>
                    )}

                    <Box style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%'
                    }}>
                      {/* Left side - Coins */}
                      <Box style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                      }}>
                        <Text style={{
                          fontSize: '40px'
                        }}>
                          🪙
                        </Text>
                        <Box>
                          <Text
                            style={{
                              fontSize: '24px',
                              fontWeight: 900,
                              color: pkg.color,
                              fontFamily: 'Anton, sans-serif',
                              letterSpacing: '1px',
                              lineHeight: 1
                            }}
                          >
                            {pkg.coins} COINS
                          </Text>
                          <Text
                            style={{
                              fontSize: '12px',
                              fontWeight: 600,
                              color: '#F5F5DC',
                              fontFamily: 'Anton, sans-serif',
                              letterSpacing: '0.5px'
                            }}
                          >
                            {pkg.description}
                          </Text>
                        </Box>
                      </Box>

                      {/* Right side - Price */}
                      <Box style={{
                        textAlign: 'right'
                      }}>
                        <Text
                          style={{
                            fontSize: '20px',
                            fontWeight: 700,
                            color: '#FFD700',
                            fontFamily: 'Anton, sans-serif',
                            letterSpacing: '1px',
                            lineHeight: 1
                          }}
                        >
                          {pkg.price}
                        </Text>
                        <Text
                          style={{
                            fontSize: '14px',
                            fontWeight: 600,
                            color: pkg.color,
                            fontFamily: 'Anton, sans-serif',
                            letterSpacing: '1px',
                            textTransform: 'uppercase'
                          }}
                        >
                          {pkg.label}
                        </Text>
                      </Box>
                    </Box>
                  </Button>
                </motion.div>
              ))}
            </Box>

            {/* Close Button */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <Button
                onClick={onClose}
                style={{
                  fontSize: '16px',
                  fontWeight: 700,
                  padding: '12px 30px',
                  backgroundColor: 'transparent',
                  border: '2px solid #666',
                  borderRadius: '10px',
                  color: '#666',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  fontFamily: 'Anton, sans-serif',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                CANCEL
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CoinPurchaseModal;
