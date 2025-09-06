import React, { useState, useEffect } from 'react';
import { Button, Group, Box } from '@mantine/core';
import { useCharacterAnimations } from '../contexts/CharacterAnimations';
import { useMusic } from '../hooks/useAudio';
import musicIcon from '../assets/optimized/music.webp';
import danceIcon from '../assets/optimized/dance.webp';

const MusicPlayer = () => {
  const { isCombatMode, triggerSyncAnimation, animations } = useCharacterAnimations();
  const { playMusic, nextTrack, isTrackPlaying, setCombatMode } = useMusic();
  
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    setCombatMode(isCombatMode);
  }, [isCombatMode, setCombatMode]);

  useEffect(() => {
    setIsPlaying(isTrackPlaying());
  }, [isTrackPlaying]);

  useEffect(() => {
    const handleStartMusic = () => {
      playMusic(1);
    };
    
    window.addEventListener('startMusic', handleStartMusic);
    
    const timer = setTimeout(() => {
      if (!isPlaying) {
        playMusic(1);
      }
    }, 3000);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('startMusic', handleStartMusic);
    };
  }, [playMusic, isPlaying]);

  const handleNextSong = () => {
    nextTrack();
  };

  const triggerRandomDance = () => {
    if (!isCombatMode && animations.length > 0) {
      const danceAnimations = ['dance1', 'dance2', 'dance3', 'dance4', 'dance5', 'dance6'];
      const availableDances = [];
      
      danceAnimations.forEach(danceName => {
        const index = animations.findIndex(anim => anim.toLowerCase().includes(danceName.toLowerCase()));
        if (index >= 0) {
          availableDances.push(index);
        }
      });
      
      if (availableDances.length > 0) {
        const randomIndex = availableDances[Math.floor(Math.random() * availableDances.length)];
        triggerSyncAnimation(randomIndex);
      }
    }
  };

  const isVisible = true;

  return (
    <Box style={{
      position: 'absolute',
      zIndex: 200,
      top: '65%',
      right: '2%',
      borderRadius: '0px',
      boxShadow: '0 0 10px rgba(243, 34, 16, 0.3)',
      width: 'fit-content',
      height: 'fit-content',
      opacity: isVisible ? 1 : 0,
      transition: 'opacity 0.3s ease',
      pointerEvents: isVisible ? 'auto' : 'none'
    }}>
      {/* Music and Dance Icons */}
      <Group spacing="sm" position="center" style={{ alignItems: 'center', flexDirection: 'column' }}>
        {/* Music Icon */}
        <Button
          variant="unstyled"
          size="xs"
          onClick={handleNextSong}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            width: '35px',
            height: '35px',
            padding: '0',
            minWidth: 'unset',
            cursor: 'pointer'
          }}
        >
          <img 
            src={musicIcon} 
            alt="Music" 
            style={{ 
              width: "35px",
              height: "35px",
              objectFit: "cover",
              pointerEvents: "none"
            }} 
          />
        </Button>

        {/* Dance Icon - Only in dance mode */}
        {!isCombatMode && (
          <Button
            variant="unstyled"
            size="xs"
            onClick={triggerRandomDance}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              width: '35px',
              height: '35px',
              padding: '0',
              minWidth: 'unset',
              cursor: 'pointer'
            }}
          >
            <img 
              src={danceIcon} 
              alt="Dance" 
              style={{ 
                width: "35px",
                height: "35px",
                objectFit: "cover",
                pointerEvents: "none"
              }} 
            />
          </Button>
        )}
      </Group>
    </Box>
  );
};

export default MusicPlayer; 