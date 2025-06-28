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

  // Configure volume according to mode - CORRECTED
  useEffect(() => {
    if (audioRef.current && songs[currentSongIndex].file) {
      // Balance volume with the crowd sound
      const targetVolume = isCombatMode ? 0.6 : 0.5;
      
      console.log(`Changing music volume to ${targetVolume} (Mode: ${isCombatMode ? 'Combat' : 'Dance'})`);
      
      // Apply volume immediately
      audioRef.current.volume = targetVolume;
      
      // Ensure it's playing if it's not "No Music"
      if (audioRef.current.paused && isPlaying) {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(console.error);
      }
      
      // Also make smooth transition
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
            audioRef.current.volume = targetVolume; // Ensure final volume
          }
        }
      }, 50);
      
      return () => clearInterval(volumeInterval);
    }
  }, [isCombatMode]); // Remove currentSongIndex from dependencies

  // Function to go to the next song
  const nextSong = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    
    const nextIndex = (currentSongIndex + 1) % songs.length;
    setCurrentSongIndex(nextIndex);
    setIsPlaying(false);
    
    // If not "No Music", automatically play
    if (songs[nextIndex].file) {
      setTimeout(() => {
        if (audioRef.current) {
          // Set initial volume
          audioRef.current.volume = isCombatMode ? 0.6 : 0.5;
          
          const playPromise = audioRef.current.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                setIsPlaying(true);
              })
              .catch(error => {
                console.log('Auto-play blocked:', error);
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
      
      // Auto-play any song that has a file
      setTimeout(() => {
        if (audioRef.current) {
          // Set initial volume
          audioRef.current.volume = isCombatMode ? 0.6 : 0.5;
          
          const playPromise = audioRef.current.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                setIsPlaying(true);
                console.log(`Auto-playing: ${songs[currentSongIndex].name}`);
              })
              .catch(error => {
                console.log('Auto-play blocked:', error);
                setIsPlaying(false);
              });
          }
        }
      }, 300);
    }
  }, [currentSongIndex]); // Remove isCombatMode from dependencies

  // Auto-play when component mounts - IMPROVED
  useEffect(() => {
    // Listener for the startMusic event from the loader
    const handleStartMusic = () => {
      console.log('🎵 Received startMusic event, starting automatic playback...');
      
      // Ensure we're on the first song with a file
      if (currentSongIndex === 1 && audioRef.current && songs[1].file) {
        // Set initial volume
        audioRef.current.volume = isCombatMode ? 0.6 : 0.5;
        
        const attemptPlay = (attempts = 0) => {
          if (attempts >= 5) {
            console.log('Auto-play failed after 5 attempts');
            return;
          }
          
          const playPromise = audioRef.current.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                setIsPlaying(true);
                console.log('✅ Auto-play from startMusic event successful');
              })
              .catch(error => {
                console.log(`Auto-play attempt ${attempts + 1} failed:`, error);
                // Retry after a brief delay
                setTimeout(() => attemptPlay(attempts + 1), 1000);
              });
          }
        };
        
        // Small delay to ensure the audio is ready
        setTimeout(() => {
          attemptPlay();
        }, 500);
      }
    };
    
    // Add listener for the custom event
    window.addEventListener('startMusic', handleStartMusic);
    
    // Automatically play the first song when loading (fallback)
    const timer = setTimeout(() => {
      if (audioRef.current && songs[1].file && currentSongIndex === 1 && !isPlaying) {
        console.log('🎵 Fallback auto-play attempt...');
        // Set initial volume
        audioRef.current.volume = isCombatMode ? 0.6 : 0.5;
        
        // Try multiple times if necessary
        const attemptPlay = (attempts = 0) => {
          if (attempts >= 3) {
            console.log('Fallback auto-play failed after 3 attempts');
            return;
          }
          
          const playPromise = audioRef.current.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                setIsPlaying(true);
                console.log('✅ Fallback auto-play initial successful');
              })
              .catch(error => {
                console.log(`Fallback auto-play attempt ${attempts + 1} failed:`, error);
                // Retry after a brief delay
                setTimeout(() => attemptPlay(attempts + 1), 1000);
              });
          }
        };
        
        attemptPlay();
      }
    }, 3000); // Longer delay for fallback

    return () => {
      clearTimeout(timer);
      window.removeEventListener('startMusic', handleStartMusic);
    };
  }, []); // Only on mount, no mode dependencies

  // Handle when a song ends (move to the next one)
  const handleSongEnd = () => {
    nextSong();
  };

  // Function to trigger random dance
  const triggerRandomDance = () => {
    if (!isCombatMode && animations.length > 0) {
      // Filter dance animations (avoid combat, intro, and celebration animations)
      const danceAnimations = ['dance1', 'dance2', 'dance3', 'dance4', 'dance5', 'dance6'];
      const availableDances = [];
      
      // Find which dance animations are available
      danceAnimations.forEach(danceName => {
        const index = animations.findIndex(anim => anim.toLowerCase().includes(danceName.toLowerCase()));
        if (index >= 0) {
          availableDances.push(index);
        }
      });
      
      // If there are dance animations available, select a random one
      if (availableDances.length > 0) {
        const randomIndex = availableDances[Math.floor(Math.random() * availableDances.length)];
        console.log(`Triggering random dance: ${animations[randomIndex]} (index ${randomIndex})`);
        triggerSyncAnimation(randomIndex);
      }
    }
  };

  const currentSong = songs[currentSongIndex];
  const isMobile = window.innerWidth <= 768;

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
            console.log(`Playing: ${currentSong.name}`);
          }}
          onPause={() => setIsPlaying(false)}
          onCanPlay={() => {
            // Try to play when the audio is ready
            if (audioRef.current && !isPlaying) {
              audioRef.current.volume = isCombatMode ? 0.6 : 0.5;
              
              const playPromise = audioRef.current.play();
              if (playPromise !== undefined) {
                playPromise
                  .then(() => {
                    setIsPlaying(true);
                    console.log('Auto-play from onCanPlay successful');
                  })
                  .catch(error => {
                    console.log('Auto-play from onCanPlay failed:', error);
                  });
              }
            }
          }}
          onLoadedData={() => {
            // Try to play when the data is loaded
            if (audioRef.current) {
              // Set initial volume
              audioRef.current.volume = isCombatMode ? 0.6 : 0.5;
              
              const playPromise = audioRef.current.play();
              if (playPromise !== undefined) {
                playPromise
                  .then(() => {
                    setIsPlaying(true);
                    console.log('Auto-play from onLoadedData successful');
                  })
                  .catch(error => {
                    console.log('Auto-play from onLoadedData failed:', error);
                    setIsPlaying(false);
                  });
              }
            }
          }}
          onError={(e) => {
            console.error('Error loading audio:', e);
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