import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Text, Button } from '@mantine/core';
import '../styles/fightAnimations.css';
import coverbgImg from '../assets/optimized/coverbg.webp';
import coinImg from '../assets/optimized/coin.webp';
import pack1Img from '../assets/optimized/pack1.webp';
import pack2Img from '../assets/optimized/pack2.webp';
import pack3Img from '../assets/optimized/pack3.webp';
import CoinPurchaseResultModal from './CoinPurchaseResultModal';

const CoinPurchaseModal = ({ 
  isVisible, 
  onClose, 
  onPurchase
}) => {
  const [particles, setParticles] = useState([]);
  const [currentStep, setCurrentStep] = useState('selection');
  const [purchasedPackage, setPurchasedPackage] = useState(null);
  const [purchaseParticles, setPurchaseParticles] = useState([]);
  const [showResultModal, setShowResultModal] = useState(false);

  useEffect(() => {
    if (isVisible && currentStep === 'selection') {
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
  }, [isVisible, currentStep]);


  useEffect(() => {
    if (currentStep === 'purchasing') {
      const newPurchaseParticles = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 1.0,
        scale: 0.8 + Math.random() * 0.6,
        rotation: Math.random() * 360,
        color: Math.random() > 0.4 ? 'rgb(245, 245, 220)' : 'rgb(245, 245, 220)'
      }));
      setPurchaseParticles(newPurchaseParticles);


      const resultTimer = setTimeout(() => {
        setShowResultModal(true);

      }, 2500);

      return () => clearTimeout(resultTimer);
    }
  }, [currentStep]);


  useEffect(() => {
    if (!isVisible) {
      setCurrentStep('selection');
      setPurchasedPackage(null);
      setParticles([]);
      setPurchaseParticles([]);
      setShowResultModal(false);
    }
  }, [isVisible]);


  const coinPackages = [
    {
      id: 'small',
      coins: 10,
      price: '$2.99',
      color: 'rgb(245, 245, 220)',
      label: 'STARTER PACK',
      description: 'Perfect to get started',
      image: pack1Img
    },
    {
      id: 'medium', 
      coins: 20,
      price: '$4.99',
      color: '#FF6B35',
      label: 'VALUE PACK',
      description: 'Best value for money',
      popular: true,
      image: pack2Img
    },
    {
      id: 'large',
      coins: 30,
      price: '$6.99', 
      color: '#A00000',
      label: 'MEGA PACK',
      description: 'Maximum coins!',
      image: pack3Img
    }
  ];


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


  const packImageVariants = {
    initial: {
      scale: 1,
      rotate: 0,
      y: 0
    },
    animate: {
      scale: [1, 1.05, 1],
      rotate: [0, -2, 2, 0],
      y: [0, -4, 0],
      transition: {
        duration: 3,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "reverse"
      }
    },
    hover: {
      scale: 1.15,
      rotate: [0, -5, 5, 0],
      y: -8,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    tap: {
      scale: 0.95,
      transition: {
        duration: 0.1
      }
    }
  };


  const coinImageVariants = {
    initial: { rotate: 0 },
    animate: {
      rotate: [0, 15, -15, 0],
      scale: [1, 1.1, 1],
      transition: {
        duration: 2,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "reverse"
      }
    }
  };


  const purchaseParticleVariants = {
    hidden: { 
      scale: 0, 
      opacity: 0,
      x: 0,
      y: 0
    },
    visible: (custom) => ({
      scale: [0, custom.scale, custom.scale * 0.5, 0],
      opacity: [0, 1, 1, 0],
      y: [0, -150, -250, -350],
      x: [0, (Math.random() - 0.5) * 400],
      rotate: [0, custom.rotation, custom.rotation * 2, custom.rotation * 3],
      transition: {
        duration: 3.0,
        delay: custom.delay,
        ease: "easeOut"
      }
    })
  };

  const purchasePackVariants = {
    purchasing: {
      scale: [1, 1.3, 0.9, 1.6, 0],
      rotate: [0, 8, -8, 15, -15, 0],
      opacity: [1, 1, 1, 1, 0],
      transition: {
        duration: 2.5,
        ease: "easeInOut"
      }
    }
  };

  const handlePurchase = (packageData) => {
    setPurchasedPackage(packageData);
    setCurrentStep('purchasing');
    

    setTimeout(() => {
      onPurchase(packageData);
    }, 1000);
  };

  const handleResultModalClose = () => {
    setShowResultModal(false);
    setCurrentStep('selection');

  };

  return (
    <AnimatePresence>
      {isVisible && !showResultModal && (
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
            zIndex: 99999,
            pointerEvents: 'auto',
            overflow: 'hidden'
          }}
          onClick={currentStep === 'selection' ? onClose : undefined}
        >

          {currentStep === 'selection' && particles.map((particle) => (
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
                backgroundColor: 'rgb(245, 245, 220)',
                borderRadius: '0px',
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                boxShadow: '0 0 10px rgb(245, 245, 220)',
                pointerEvents: 'none'
              }}
            />
          ))}


          {currentStep === 'purchasing' && purchaseParticles.map((particle) => (
            <motion.div
              key={particle.id}
              custom={particle}
              variants={purchaseParticleVariants}
              initial="hidden"
              animate="visible"
              style={{
                position: 'absolute',
                width: '20px',
                height: '20px',
                left: '50%',
                top: '50%',
                pointerEvents: 'none',
                fontSize: '20px',
                color: particle.color,
                textShadow: `0 0 15px ${particle.color}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              💰
            </motion.div>
          ))}


          {currentStep === 'purchasing' && purchasedPackage && (
            <motion.div
              variants={purchasePackVariants}
              animate="purchasing"
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                filter: 'drop-shadow(0 0 30px rgb(245, 245, 220))'
              }}
            >
              <img 
                src={purchasedPackage.image}
                alt={`${purchasedPackage.label} Pack`}
                style={{
                  height: '50dvh',
                  maxHeight: '400px'
                }}
              />
            </motion.div>
          )}




          {currentStep === 'selection' && (
          <div
            style={{
              backgroundImage: `url(${coverbgImg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              width: '100vw',
              height: '100dvh',
              padding: '40px 30px',
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
                animation: 'electricFadeIn 0.7s ease-out 0.2s both'
              }}
            >
              <Box style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                gap: '8px',
                marginBottom: '10px'
              }}>
                <img 
                  src={coinImg}
                  alt="Coin"
                  style={{
                    width: '32px',
                    height: '32px',
                    animation: 'electricFlicker 0.8s ease-out 0.4s both'
                  }}
                />
                <Text
                  style={{
                    fontSize: '32px',
                    fontWeight: 900,
                    color: 'rgb(245, 245, 220)',
                    fontFamily: 'Anton, sans-serif',
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    animation: 'electricTitle 0.8s ease-out 0.3s both'
                  }}
                >
                  Buy Coins
                </Text>
              </Box>
              
              <Text
                style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: 'rgb(245, 245, 220)',
                  fontFamily: 'Anton, sans-serif',
                  letterSpacing: '0.5px',
                  marginBottom: '30px',
                  lineHeight: 1.3,
                  animation: 'electricGlitch 0.7s ease-out 0.5s both'
                }}
              >
                Choose your coin package to buy packs!
              </Text>
            </div>


            <Box style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '15px',
              marginBottom: '25px'
            }}>
              {coinPackages.map((pkg, index) => (
                <div
                  key={pkg.id}
                  style={{
                    animation: `electricStatic 0.6s ease-out ${0.6 + index * 0.15}s both`,
                    transition: 'transform 0.3s ease, filter 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.02)';
                    e.target.style.filter = 'brightness(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.filter = 'brightness(1)';
                  }}
                  onMouseDown={(e) => {
                    e.target.style.transform = 'scale(0.98)';
                  }}
                  onMouseUp={(e) => {
                    e.target.style.transform = 'scale(1.02)';
                  }}
                >
                  <Button
                    onClick={() => handlePurchase(pkg)}
                    style={{
                      width: '100%',
                      height: '85px',
                      backgroundColor: 'rgba(0, 0, 0, 0.7)',
                      borderRadius: '10px',
                      padding: '0 20px',
                      position: 'relative',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >

                    {pkg.popular && (
                      <Box
                        style={{
                          position: 'absolute',
                          top: '-10px',
                          right: '15px',
                          backgroundColor: 'rgb(245, 245, 220)',
                          color: '#000',
                          fontSize: '12px',
                          fontWeight: 900,
                          padding: '4px 12px',
                          borderRadius: '0px',
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

                      <Box style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                      }}>
                        <img 
                          src={pkg.image}
                          alt="Pack"
                          style={{
                            height: '60px',
                            marginRight: '10px',
                            cursor: 'pointer',
                            animation: `electricPulse 0.7s ease-out ${0.8 + index * 0.1}s both`,
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.transform = 'scale(1.15) rotate(5deg)';
                            e.target.style.filter = 'brightness(1.2) drop-shadow(0 0 15px rgba(255, 215, 0, 0.6))';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = 'scale(1) rotate(0deg)';
                            e.target.style.filter = 'brightness(1) drop-shadow(0 0 8px rgba(255, 215, 0, 0.3))';
                          }}
                        />
                        <Box>
                          <Text
                            style={{
                              fontSize: '24px',
                              fontWeight: 900,
                              color: 'rgb(245, 245, 220)',
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
                              color: '#A00000',
                              fontFamily: 'Anton, sans-serif',
                              letterSpacing: '0.5px'
                            }}
                          >
                            {pkg.description}
                          </Text>
                        </Box>
                      </Box>


                      <Box style={{
                        textAlign: 'right'
                      }}>
                        <Text
                          style={{
                            fontSize: '20px',
                            fontWeight: 700,
                            color: 'rgb(245, 245, 220)',
                            fontFamily: 'Anton, sans-serif',
                            letterSpacing: '1px',
                            lineHeight: 1
                          }}
                        >
                          {pkg.price}
                        </Text>
                      </Box>
                    </Box>
                  </Button>
                </div>
              ))}
            </Box>


            <div
              style={{
                animation: 'electricEntry 0.8s ease-out 1.0s both'
              }}
            >
              <Button
                onClick={onClose}
                style={{
                  fontSize: '20px',
                  fontWeight: 700,
                  height: '50px',
                  padding: '12px 30px',
                  backgroundColor: 'transparent',
                  borderRadius: '0px',
                  color: 'rgb(245, 245, 220)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  fontFamily: 'Anton, sans-serif',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.animation = 'electricFlicker 0.4s ease-out';
                  e.target.style.transform = 'scale(1.05)';
                  e.target.style.filter = 'brightness(1.2)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.animation = '';
                  e.target.style.transform = 'scale(1)';
                  e.target.style.filter = 'brightness(1)';
                }}
              >
                CANCEL
              </Button>
            </div>
          </div>
          )}

        </motion.div>
      )}
      

      <CoinPurchaseResultModal
        isVisible={showResultModal}
        onClose={handleResultModalClose}
        coinAmount={purchasedPackage?.coins}
        packageName={purchasedPackage?.label}
      />
    </AnimatePresence>
  );
};

export default CoinPurchaseModal;
