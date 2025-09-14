import React from 'react';
import { motion } from 'framer-motion';
import { Progress } from '@mantine/core';

const EnhancedProgressBar = ({ 
  value, 
  statName, 
  isAnimating = false, 
  color = "#FFB300",
  size = "lg"
}) => {
  const getStatColor = (stat) => {
    return '#A00000';
  };

  const statColor = getStatColor(statName) || color;

  return (
    <motion.div
      style={{ width: '100%' }}
      animate={isAnimating ? {
        scale: [1, 1.05, 1],
        filter: [
          'drop-shadow(0 0 0px rgba(255, 215, 0, 0))',
          `drop-shadow(0 0 10px ${statColor})`,
          'drop-shadow(0 0 0px rgba(255, 215, 0, 0))'
        ]
      } : {}}
      transition={{
        duration: 0.8,
        ease: "easeOut"
      }}
    >
      <Progress
        value={value}
        color="#FFB300"
        size={size}
        radius="md"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          height: size === 'lg' ? '30px' : '20px'
        }}
        styles={{
          bar: {
            background: `linear-gradient(90deg, ${statColor}, ${statColor}AA)`,
            transition: 'all 0.3s ease'
          }
        }}
      />
      
      {/* Sparkle effects when animating */}
      {isAnimating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1, repeat: 2 }}
          style={{
            position: 'absolute',
            top: '50%',
            left: `${value}%`,
            transform: 'translate(-50%, -50%)',
            fontSize: '12px',
            color: statColor,
            pointerEvents: 'none'
          }}
        >
          ✨
        </motion.div>
      )}
    </motion.div>
  );
};

export default EnhancedProgressBar;
