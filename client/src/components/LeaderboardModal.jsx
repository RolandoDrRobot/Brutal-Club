import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Text, Button } from '@mantine/core';
import '../styles/fightAnimations.css';
import coverbgImg from '../assets/optimized/coverbg.webp';

const LeaderboardModal = ({ isVisible, onClose }) => {
  const fakeLeaderboardData = [
    { rank: 1, name: 'FIGHTER_ALPHA', level: 15, wins: 47, avatar: '🥊' },
    { rank: 2, name: 'CHAMPION_BETA', level: 14, wins: 42, avatar: '👑' },
    { rank: 3, name: 'WARRIOR_GAMMA', level: 13, wins: 38, avatar: '⚔️' },
    { rank: 4, name: 'GLADIATOR_DELTA', level: 12, wins: 35, avatar: '🛡️' },
    { rank: 5, name: 'FIGHTER_ECHO', level: 11, wins: 32, avatar: '🥋' },
    { rank: 6, name: 'CHAMPION_FOXTROT', level: 10, wins: 28, avatar: '🏆' },
    { rank: 7, name: 'WARRIOR_GOLF', level: 9, wins: 25, avatar: '⚡' },
    { rank: 8, name: 'GLADIATOR_HOTEL', level: 8, wins: 22, avatar: '🔥' },
    { rank: 9, name: 'FIGHTER_INDIA', level: 7, wins: 19, avatar: '💪' },
    { rank: 10, name: 'CHAMPION_JULIET', level: 6, wins: 16, avatar: '🌟' }
  ];

  const getRankColor = (rank) => {
    switch (rank) {
      case 1: return '#FFD700';
      case 2: return '#C0C0C0';
      case 3: return '#CD7F32';
      default: return '#A00000';
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
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
            height: '100dvh',
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            pointerEvents: 'auto',
            overflow: 'hidden'
          }}
          onClick={onClose}
        >
          <div
            style={{
              backgroundImage: `url(${coverbgImg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              width: '100vw',
              height: '100dvh',
              padding: '30px 15px',
              textAlign: 'center',
              position: 'relative',
              overflow: 'auto',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              animation: 'electricEntry 0.8s ease-out'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Title */}
            <div
              style={{
                animation: 'electricFadeIn 0.7s ease-out 0.2s both'
              }}
            >
              <Text
                style={{
                  fontSize: '32px',
                  fontWeight: 900,
                  color: '#F5F5DC',
                  fontFamily: 'Anton, sans-serif',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  animation: 'electricTitle 0.8s ease-out 0.3s both',
                  marginBottom: '10px'
                }}
              >
                LEADERBOARD
              </Text>
              
              <Text
                style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#A00000',
                  fontFamily: 'Anton, sans-serif',
                  letterSpacing: '0.5px',
                  marginBottom: '30px',
                  lineHeight: 1.3,
                  animation: 'electricGlitch 0.7s ease-out 0.5s both'
                }}
              >
                TOP FIGHTERS WORLDWIDE
              </Text>
            </div>

            {/* Leaderboard List */}
            <Box style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              marginBottom: '25px',
              maxHeight: '60dvh',
              overflowY: 'auto',
              width: '100%',
              maxWidth: '600px',
              padding: '0 10px'
            }}>
              {fakeLeaderboardData.map((player, index) => (
                <div
                  key={player.rank}
                  style={{
                    animation: `electricStatic 0.6s ease-out ${0.6 + index * 0.1}s both`,
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
                >
                  <Box
                    style={{
                      width: '100%',
                      height: '80px',
                      backgroundColor: 'rgba(0, 0, 0, 0.7)',
                      borderRadius: '12px',
                      padding: '0 10px',
                      position: 'relative',
                      cursor: 'default',
                      border: `2px solid ${getRankColor(player.rank)}`,
                      boxShadow: `
                        0 0 15px ${getRankColor(player.rank)},
                        0 0 25px rgba(243, 34, 16, 0.3),
                        inset 0 0 15px rgba(243, 34, 16, 0.1)
                      `,
                      minHeight: '80px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      margin: '0 auto'
                    }}
                  >
                    {/* Rank Circle */}
                    <Box style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '55px',
                      height: '55px',
                      backgroundColor: 'rgba(0, 0, 0, 0.9)',
                      border: `3px solid ${getRankColor(player.rank)}`,
                      borderRadius: '50%',
                      fontSize: '22px',
                      flexShrink: 0,
                      boxShadow: `0 0 15px ${getRankColor(player.rank)}`
                    }}>
                      {getRankIcon(player.rank)}
                    </Box>
                    
                    {/* Player Info */}
                    <Box style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      minWidth: '0',
                      flex: '1'
                    }}>
                      <Text
                        style={{
                          fontSize: '18px',
                          fontWeight: 700,
                          color: '#F5F5DC',
                          fontFamily: 'Anton, sans-serif',
                          letterSpacing: '1px',
                          lineHeight: 1.2,
                          textTransform: 'uppercase',
                          textShadow: '0 0 5px #F5F5DC',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          maxWidth: '200px'
                        }}
                      >
                        {player.name}
                      </Text>
                    </Box>

                    {/* Level Badge */}
                    <Box style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      borderRadius: '8px',
                      padding: '8px 16px',
                      flexShrink: 0,
                      boxShadow: `0 0 10px ${getRankColor(player.rank)}`
                    }}>
                      <Text
                        style={{
                          fontSize: '16px',
                          fontWeight: 900,
                          color: getRankColor(player.rank),
                          fontFamily: 'Anton, sans-serif',
                          letterSpacing: '1px',
                          lineHeight: 1,
                          textTransform: 'uppercase',
                          textShadow: `0 0 8px ${getRankColor(player.rank)}`
                        }}
                      >
                        LVL {player.level}
                      </Text>
                    </Box>
                  </Box>
                </div>
              ))}
            </Box>

            {/* Close Button */}
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
                  color: '#F5F5DC',
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
                CLOSE
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LeaderboardModal;
