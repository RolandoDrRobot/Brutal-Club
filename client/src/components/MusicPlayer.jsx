import React, { useState, useRef, useEffect } from 'react';
import { Button, Group, Text, Box } from '@mantine/core';
import { useCharacterAnimations } from '../contexts/CharacterAnimations';
import musicIcon from '../assets/music.png';
import danceIcon from '../assets/dance.png';

const MusicPlayer = () => {
  const { isCombatMode, triggerSyncAnimation, animations } = useCharacterAnimations();
  
  // Song list (using actual files from the music directory)
  const songs = [
    { id: 0, name: "No Music", artist: "", file: null },
    { id: 1, name: "Now That We're Dead", artist: "Metallica", file: "/music/Metallica Now That We're Dead (official audio).mp3" },
    { id: 2, name: "Lights Out", artist: "Max Styler", file: "/music/Max Styler - Lights Out (Extended Mix).mp3" },
    { id: 3, name: "Bow Down", artist: "Ice Cube", file: "/music/Ice Cube - Bow Down (West side connection).mp3" },
    { id: 4, name: "Nine Thou", artist: "Styles Of Beyond", file: "/music/Styles Of Beyond - Nine Thou (Grant Mohrman Supertars Remix).mp3" },
    { id: 5, name: "Another", artist: "Full On The Mouth", file: "/music/Full On The Mouth - Another.mp3" }
  ];

  const [currentSongIndex, setCurrentSongIndex] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // Configure volume according to mode
  useEffect(() => {
    if (audioRef.current && songs[currentSongIndex].file) {
      const targetVolume = isCombatMode ? 0.6 : 0.5;
      
      audioRef.current.volume = targetVolume;
      
      if (audioRef.current.paused && isPlaying) {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(() => {}); // Silent error handling
      }
      
      const currentVolume = audioRef.current.volume;
      const volumeStep = (targetVolume - currentVolume) / 10;
      
      let step = 0;
      const volumeInterval = setInterval(() => {
        if (step < 10 && audioRef.current) {
          const newVolume = Math.max(0, Math.min(1, currentVolume + (volumeStep * step)));
          audioRef.current.volume = newVolume;
          step++;
        } else {
          clearInterval(volumeInterval);
          if (audioRef.current) {
            audioRef.current.volume = targetVolume;
          }
        }
      }, 50);
      
      return () => clearInterval(volumeInterval);
    }
  }, [isCombatMode]);

  // Function to go to the next song
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

  // Auto-play when the song changes
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

  // Auto-play when component mounts
  useEffect(() => {
    const handleStartMusic = () => {
      if (currentSongIndex === 1 && audioRef.current && songs[1].file) {
        audioRef.current.volume = isCombatMode ? 0.6 : 0.5;
        
        const attemptPlay = (attempts = 0) => {
          if (attempts >= 5) {
            return;
          }
          
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
          if (attempts >= 3) {
            return;
          }
          
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
    }, 3000);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('startMusic', handleStartMusic);
    };
  }, []);

  // Handle when a song ends
  const handleSongEnd = () => {
    nextSong();
  };

  // Function to trigger random dance
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

  const currentSong = songs[currentSongIndex];

  return (
    <Box style={{
      position: 'absolute',
      zIndex: 200,
      top: '65%',
      right: '2%',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderRadius: '8px',
      boxShadow: '0 0 10px rgba(252, 63, 49, 0.3)',
      width: 'fit-content',
      height: 'fit-content'
    }}>
      {/* Audio element */}
      {currentSong.file && (
        <audio
          ref={audioRef}
          src={currentSong.file}
          onEnded={handleSongEnd}
          loop={false}
          preload="auto"
          autoPlay={true}
          muted={false}
          onPlay={() => {
            setIsPlaying(true);
          }}
          onPause={() => setIsPlaying(false)}
          onCanPlay={() => {
            if (audioRef.current && !isPlaying) {
              audioRef.current.volume = isCombatMode ? 0.6 : 0.5;
              
              const playPromise = audioRef.current.play();
              if (playPromise !== undefined) {
                playPromise
                  .then(() => {
                    setIsPlaying(true);
                  })
                  .catch(() => {});
              }
            }
          }}
          onLoadedData={() => {
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
          }}
          onError={() => {
            setIsPlaying(false);
          }}
        />
      )}

      {/* Music and Dance Icons */}
      <Group spacing="sm" position="center" style={{ alignItems: 'center', flexDirection: 'column' }}>
        {/* Music Icon */}
        <Button
          variant="unstyled"
          size="xs"
          onClick={nextSong}
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