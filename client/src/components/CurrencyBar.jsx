import React, { useState, useRef, useEffect } from 'react';
import { Box } from '@mantine/core';
import { useGameState } from '../contexts/GameState';
import { useCharacterAnimations } from '../contexts/CharacterAnimations';
import { useMediaQuery } from '@mantine/hooks';
import { useButtonSound } from '../hooks/useButtonSound';
import CoinPurchaseModal from './CoinPurchaseModal';
import coinImg from '../assets/optimized/coin.webp';
import statCoinImg from '../assets/optimized/statCoin.webp';
import homeImg from '../assets/optimized/home.webp';
import musicImg from '../assets/optimized/music.webp';
import '../styles/fightAnimations.css';

const CurrencyBar = () => {
  const { coins, statPoints, setCoins } = useGameState() || {};
  const { navigateToMenu, isCombatMode } = useCharacterAnimations();
  const { playButtonSound } = useButtonSound();
  const isMobile = useMediaQuery("(max-width: 768px)");


  const [showCoinPurchaseModal, setShowCoinPurchaseModal] = useState(false);


  const handleCoinPurchase = (packageData) => {
    if (setCoins) {
      setCoins(currentCoins => currentCoins + packageData.coins);
    }

  };



  const songs = [
    { id: 0, name: "No Music", artist: "", file: null },
    { id: 1, name: "Nine Thou", artist: "Styles Of Beyond", file: "/music/Styles Of Beyond - Nine Thou (Grant Mohrman Supertars Remix).mp3" },
    { id: 2, name: "Another", artist: "Full On The Mouth", file: "/music/Full On The Mouth - Another.mp3" }
  ];

  const [currentSongIndex, setCurrentSongIndex] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);


  const nextSong = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    
    const nextIndex = (currentSongIndex + 1) % songs.length;
    setCurrentSongIndex(nextIndex);
    setIsPlaying(false);
    
    if (songs[nextIndex].file) {
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.volume = isCombatMode ? 0.6 : 0.5;
          
          const playPromise = audioRef.current.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                setIsPlaying(true);
              })
              .catch(() => {
                setIsPlaying(false);
              });
          }
        }
      }, 200);
    }
  };


  useEffect(() => {
    if (songs[currentSongIndex].file && audioRef.current) {
      audioRef.current.load();
      
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.volume = isCombatMode ? 0.6 : 0.5;
          
          const playPromise = audioRef.current.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                setIsPlaying(true);
              })
              .catch(() => {
                setIsPlaying(false);
              });
          }
        }
      }, 300);
    }
  }, [currentSongIndex]);


  useEffect(() => {
    const handleStartMusic = () => {
      if (currentSongIndex === 1 && audioRef.current && songs[1].file) {
        audioRef.current.volume = isCombatMode ? 0.6 : 0.5;
        
        const attemptPlay = (attempts = 0) => {
          if (attempts >= 5) return;
          
          const playPromise = audioRef.current.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                setIsPlaying(true);
              })
              .catch(() => {
                setTimeout(() => attemptPlay(attempts + 1), 1000);
              });
          }
        };
        
        setTimeout(() => {
          attemptPlay();
        }, 500);
      }
    };
    
    window.addEventListener('startMusic', handleStartMusic);
    
    const timer = setTimeout(() => {
      if (audioRef.current && songs[1].file && currentSongIndex === 1 && !isPlaying) {
        audioRef.current.volume = isCombatMode ? 0.6 : 0.5;
        
        const attemptPlay = (attempts = 0) => {
          if (attempts >= 5) return;
          
          const playPromise = audioRef.current.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                setIsPlaying(true);
              })
              .catch(() => {
                setTimeout(() => attemptPlay(attempts + 1), 1000);
              });
          }
        };
        
        attemptPlay();
      }
    }, 2000);
    
    return () => {
      window.removeEventListener('startMusic', handleStartMusic);
      clearTimeout(timer);
    };
  }, []);


  useEffect(() => {
    if (audioRef.current && songs[currentSongIndex].file) {
      const targetVolume = isCombatMode ? 0.6 : 0.5;
      audioRef.current.volume = targetVolume;
      
      if (audioRef.current.paused && isPlaying) {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(() => {});
      }
    }
  }, [isCombatMode]);

  return (
    <>
    <Box
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        padding: isMobile ? '8px 15px' : '10px 20px',
        backdropFilter: 'blur(10px)',
        borderRadius: '0px',
        animation: 'electricFadeIn 0.8s ease-out 0.2s both'
      }}
    >
      <Box
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          maxWidth: '400px',
          margin: '0 auto'
        }}
      >

        <Box
          style={{
            fontSize: isMobile ? '18px' : '22px',
            fontWeight: 700,
            color: '#A00000',
            fontFamily: 'Anton, sans-serif',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            textShadow: '0 0 5px rgba(243, 34, 16, 0.8), 2px 2px 4px rgba(0, 0, 0, 0.8)',
            animation: 'electricGlitch 0.7s ease-out 0.5s both'
          }}
        >
          ROLOXWORLD
        </Box>


        <Box
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: isMobile ? '8px' : '12px'
          }}
        >

          <Box
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              padding: '4px',
              borderRadius: '50%',
              animation: 'electricPulse 0.7s ease-out 0.6s both'
            }}
            onClick={() => {
              playButtonSound();
              navigateToMenu();
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "scale(1.1)";
              e.target.style.opacity = "0.8";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "scale(1)";
              e.target.style.opacity = "1";
            }}
          >
            <img 
              src={homeImg}
              alt="Home"
              style={{
                width: isMobile ? '32px' : '40px',
                height: isMobile ? '32px' : '40px',
                filter: 'none',
                pointerEvents: 'none'
              }}
            />
          </Box>


          <Box
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              padding: '4px',
              borderRadius: '50%',
              animation: 'electricStatic 0.7s ease-out 0.7s both'
            }}
            onClick={() => {
              playButtonSound();
              nextSong();
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "scale(1.1)";
              e.target.style.opacity = "0.8";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "scale(1)";
              e.target.style.opacity = "1";
            }}
          >
            <img 
              src={musicImg}
              alt="Music"
              style={{
                width: isMobile ? '32px' : '40px',
                height: isMobile ? '32px' : '40px',
                filter: 'none',
                pointerEvents: 'none'
              }}
            />
          </Box>
        </Box>


        <Box
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end'
          }}
        >

          <Box
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: isMobile ? '6px' : '8px',
              fontSize: isMobile ? '16px' : '18px',
              fontWeight: 700,
              backgroundColor: 'transparent',
              color: '#A00000',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              fontFamily: 'Anton, sans-serif',
              minWidth: isMobile ? '70px' : '80px',
              justifyContent: 'center',
              animation: 'electricStatic 0.7s ease-out 0.7s both'
            }}
          >
            <img 
              src={statCoinImg}
              alt="Stat Points"
              style={{
                width: isMobile ? '24px' : '28px',
                height: isMobile ? '24px' : '28px',
                filter: 'none'
              }}
            />
            <span style={{
              fontWeight: 900,
              color: 'rgb(245, 245, 220)'
            }}>
              {statPoints || 0}
            </span>
          </Box>


          <Box
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: isMobile ? '6px' : '8px',
              fontSize: isMobile ? '16px' : '18px',
              fontWeight: 700,
              backgroundColor: 'transparent',
              color: 'rgb(245, 245, 220)',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              fontFamily: 'Anton, sans-serif',
              minWidth: isMobile ? '70px' : '80px',
              justifyContent: 'center',
              animation: 'electricFlicker 0.7s ease-out 0.8s both',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              borderRadius: '8px',
              padding: '4px 8px'
            }}
            onClick={() => {
              playButtonSound();
              setShowCoinPurchaseModal(true);
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "scale(1.05)";
              e.target.style.backgroundColor = "rgba(255, 215, 0, 0.1)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "scale(1)";
              e.target.style.backgroundColor = "transparent";
            }}
          >
            <img 
              src={coinImg}
              alt="Coin"
              style={{
                width: isMobile ? '24px' : '28px',
                height: isMobile ? '24px' : '28px',
                filter: 'none'
              }}
            />
            <span style={{
              fontWeight: 900
            }}>
              {coins || 0}
            </span>
          </Box>
        </Box>
      </Box>




      {songs[currentSongIndex].file && (
        <audio
          ref={audioRef}
          src={songs[currentSongIndex].file}
          preload="auto"
          autoPlay
          style={{ display: 'none' }}
        />
      )}
    </Box>


    <CoinPurchaseModal
      isVisible={showCoinPurchaseModal}
      onClose={() => setShowCoinPurchaseModal(false)}
      onPurchase={handleCoinPurchase}
    />
  </>
  );
};

export default CurrencyBar;
