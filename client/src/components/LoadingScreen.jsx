import React from 'react';
import coverbgImg from '../assets/optimized/coverbg.webp';

const LoadingScreen = ({ progress = 0 }) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100dvh',
        zIndex: 9999,
        overflow: 'hidden'
      }}
    >
      <img
        src={coverbgImg}
        alt=""
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center'
        }}
      />
      
      {/* 📊 PROGRESS BAR - At bottom of screen */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '6px',
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
        }}
      >
        <div
          style={{
            width: `${Math.max(0, Math.min(100, progress))}%`,
            height: '100%',
            backgroundColor: 'rgb(245, 245, 220)',
            transition: 'width 0.3s ease-out',
            boxShadow: '0 0 10px rgba(245, 245, 220, 0.8), 0 0 20px rgba(245, 245, 220, 0.4)',
          }}
        />
      </div>
    </div>
  );
};

export default LoadingScreen; 