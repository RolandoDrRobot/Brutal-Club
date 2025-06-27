import React, { useState, useRef, useEffect } from 'react';
import { Button, Group, Text, Box } from '@mantine/core';
import { useCharacterAnimations } from '../contexts/CharacterAnimations';
import musicIcon from '../assets/music.png';
import danceIcon from '../assets/dance.png';

const MusicPlayer = () => {
  const { isCombatMode, triggerSyncAnimation, animations } = useCharacterAnimations();
  
  // Lista de canciones (usando los archivos reales del directorio music)
  const songs = [
    { id: 0, name: "Sin Música", artist: "", file: null },
    { id: 1, name: "Now That We're Dead", artist: "Metallica", file: "/music/Metallica Now That We're Dead (official audio).mp3" },
    { id: 2, name: "Lights Out", artist: "Max Styler", file: "/music/Max Styler - Lights Out (Extended Mix).mp3" },
    { id: 3, name: "Garden Of Groove", artist: "Michael Bibi", file: "/music/Michael Bibi - Garden Of Groove (Original Mix).mp3" },
    { id: 4, name: "Bow Down", artist: "Ice Cube", file: "/music/Ice Cube - Bow Down (West side connection).mp3" },
    { id: 5, name: "Nine Thou", artist: "Styles Of Beyond", file: "/music/Styles Of Beyond - Nine Thou (Grant Mohrman Supertars Remix).mp3" },
    { id: 6, name: "Another", artist: "Full On The Mouth", file: "/music/Full On The Mouth - Another.mp3" }
  ];

  const [currentSongIndex, setCurrentSongIndex] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // Configurar volumen según el modo - CORREGIDO
  useEffect(() => {
    if (audioRef.current && songs[currentSongIndex].file) {
      // Balancear volumen con el crowd sound
      const targetVolume = isCombatMode ? 0.6 : 0.5;
      
      console.log(`Cambiando volumen de música a ${targetVolume} (Modo: ${isCombatMode ? 'Combate' : 'Baile'})`);
      
      // Aplicar volumen inmediatamente
      audioRef.current.volume = targetVolume;
      
      // Asegurar que esté reproduciéndose si no es "Sin Música"
      if (audioRef.current.paused && isPlaying) {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(console.error);
      }
      
      // También hacer transición suave
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
            audioRef.current.volume = targetVolume; // Asegurar volumen final
          }
        }
      }, 50);
      
      return () => clearInterval(volumeInterval);
    }
  }, [isCombatMode]); // Remover currentSongIndex de las dependencias

  // Función para siguiente canción
  const nextSong = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    
    const nextIndex = (currentSongIndex + 1) % songs.length;
    setCurrentSongIndex(nextIndex);
    setIsPlaying(false);
    
    // Si no es "Sin Música", reproducir automáticamente
    if (songs[nextIndex].file) {
      setTimeout(() => {
        if (audioRef.current) {
          // Configurar volumen inicial
          audioRef.current.volume = isCombatMode ? 0.6 : 0.5;
          
          const playPromise = audioRef.current.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                setIsPlaying(true);
              })
              .catch(error => {
                console.log('Auto-play bloqueado:', error);
                setIsPlaying(false);
              });
          }
        }
      }, 200);
    }
  };

  // Auto-reproducir cuando cambia la canción
  useEffect(() => {
    if (songs[currentSongIndex].file && audioRef.current) {
      audioRef.current.load();
      
      // Auto-reproducir cualquier canción que tenga archivo
      setTimeout(() => {
        if (audioRef.current) {
          // Configurar volumen inicial
          audioRef.current.volume = isCombatMode ? 0.6 : 0.5;
          
          const playPromise = audioRef.current.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                setIsPlaying(true);
                console.log(`Auto-reproduciendo: ${songs[currentSongIndex].name}`);
              })
              .catch(error => {
                console.log('Auto-play bloqueado:', error);
                setIsPlaying(false);
              });
          }
        }
      }, 300);
    }
  }, [currentSongIndex]); // Remover isCombatMode de las dependencias

  // Auto-reproducir al montar el componente - MEJORADO
  useEffect(() => {
    // Reproducir la primera canción automáticamente al cargar
    const timer = setTimeout(() => {
      if (audioRef.current && songs[1].file && currentSongIndex === 1) {
        // Configurar volumen inicial
        audioRef.current.volume = isCombatMode ? 0.6 : 0.5;
        
        // Intentar múltiples veces si es necesario
        const attemptPlay = (attempts = 0) => {
          if (attempts >= 3) {
            console.log('Auto-play falló después de 3 intentos');
            return;
          }
          
          const playPromise = audioRef.current.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                setIsPlaying(true);
                console.log('Auto-play inicial exitoso');
              })
              .catch(error => {
                console.log(`Auto-play intento ${attempts + 1} falló:`, error);
                // Reintentar después de un breve delay
                setTimeout(() => attemptPlay(attempts + 1), 500);
              });
          }
        };
        
        attemptPlay();
      }
    }, 1500); // Aumentar delay inicial para asegurar que todo esté cargado

    return () => clearTimeout(timer);
  }, []); // Solo al montar, sin dependencias de modo

  // Manejar cuando termina una canción (pasar a la siguiente)
  const handleSongEnd = () => {
    nextSong();
  };

  // Función para activar baile aleatorio
  const triggerRandomDance = () => {
    if (!isCombatMode && animations.length > 0) {
      // Filtrar animaciones de baile (evitar animaciones de combate, intro y celebración)
      const danceAnimations = ['dance1', 'dance2', 'dance3', 'dance4', 'dance5', 'dance6'];
      const availableDances = [];
      
      // Buscar qué animaciones de baile están disponibles
      danceAnimations.forEach(danceName => {
        const index = animations.findIndex(anim => anim.toLowerCase().includes(danceName.toLowerCase()));
        if (index >= 0) {
          availableDances.push(index);
        }
      });
      
      // Si hay animaciones de baile disponibles, seleccionar una aleatoria
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
            console.log(`Reproduciendo: ${currentSong.name}`);
          }}
          onPause={() => setIsPlaying(false)}
          onCanPlay={() => {
            // Intentar reproducir cuando el audio esté listo
            if (audioRef.current && !isPlaying) {
              audioRef.current.volume = isCombatMode ? 0.6 : 0.5;
              
              const playPromise = audioRef.current.play();
              if (playPromise !== undefined) {
                playPromise
                  .then(() => {
                    setIsPlaying(true);
                    console.log('Auto-play desde onCanPlay exitoso');
                  })
                  .catch(error => {
                    console.log('Auto-play desde onCanPlay falló:', error);
                  });
              }
            }
          }}
          onLoadedData={() => {
            // Intentar reproducir cuando los datos estén cargados
            if (audioRef.current) {
              // Configurar volumen inicial
              audioRef.current.volume = isCombatMode ? 0.6 : 0.5;
              
              const playPromise = audioRef.current.play();
              if (playPromise !== undefined) {
                playPromise
                  .then(() => {
                    setIsPlaying(true);
                    console.log('Auto-play desde onLoadedData exitoso');
                  })
                  .catch(error => {
                    console.log('Auto-play desde onLoadedData falló:', error);
                    setIsPlaying(false);
                  });
              }
            }
          }}
          onError={(e) => {
            console.error('Error cargando audio:', e);
            setIsPlaying(false);
          }}
        />
      )}

      {/* Iconos de Música y Baile */}
      <Group spacing="sm" position="center" style={{ alignItems: 'center', flexDirection: 'column' }}>
        {/* Icono de Música */}
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

        {/* Icono de Baile - Solo en modo baile */}
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