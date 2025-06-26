import React from 'react';
import { Button, Box, Text, Stack } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

const MainMenu = ({ onStartClick, onFightersClick, onShopClick, onBackClick }) => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Inject fight-themed CSS animations
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fightPunchIn {
        0% {
          transform: scale(0.3) rotate(-10deg);
          opacity: 0;
        }
        50% {
          transform: scale(1.1) rotate(2deg);
          opacity: 0.8;
        }
        70% {
          transform: scale(0.95) rotate(-1deg);
          opacity: 1;
        }
        100% {
          transform: scale(1) rotate(0deg);
          opacity: 1;
        }
      }
      
      @keyframes screenShake {
        0%, 100% { transform: translateX(0); }
        10% { transform: translateX(-2px) rotate(0.5deg); }
        20% { transform: translateX(2px) rotate(-0.5deg); }
        30% { transform: translateX(-1px) rotate(0.3deg); }
        40% { transform: translateX(1px) rotate(-0.3deg); }
        50% { transform: translateX(-0.5px) rotate(0.1deg); }
        60% { transform: translateX(0.5px) rotate(-0.1deg); }
        70% { transform: translateX(0); }
      }
      
      @keyframes titleSlam {
        0% {
          transform: translateY(-100px) scale(0.5);
          opacity: 0;
          text-shadow: 0 0 0px #fc3f31;
        }
        60% {
          transform: translateY(10px) scale(1.05);
          opacity: 1;
          text-shadow: 
            0 0 30px #fc3f31,
            0 0 60px rgba(252, 63, 49, 0.8),
            0 4px 30px rgba(252, 63, 49, 0.5);
        }
        80% {
          transform: translateY(-5px) scale(0.98);
        }
        100% {
          transform: translateY(0) scale(1);
          opacity: 1;
          text-shadow: 
            0 0 20px #fc3f31,
            0 0 40px rgba(252, 63, 49, 0.5),
            0 4px 20px rgba(252, 63, 49, 0.3);
        }
      }
      
      @keyframes buttonsPunchSequence {
        0% {
          transform: translateX(-200px) rotate(-15deg);
          opacity: 0;
        }
        70% {
          transform: translateX(10px) rotate(2deg);
          opacity: 0.8;
        }
        85% {
          transform: translateX(-5px) rotate(-1deg);
          opacity: 1;
        }
        100% {
          transform: translateX(0) rotate(0deg);
          opacity: 1;
        }
      }
      
      @keyframes backgroundImpact {
        0% {
          background-color: #1a1a1a;
        }
        5% {
          background-color: #2a1a1a;
        }
        15% {
          background-color: #1a1a1a;
        }
        25% {
          background-color: #2a1a1a;
        }
        35% {
          background-color: #1a1a1a;
        }
        100% {
          background-color: #1a1a1a;
        }
      }
      
      @keyframes redFlash {
        0%, 100% { 
          box-shadow: 
            0 0 20px #fc3f31,
            0 0 40px rgba(252, 63, 49, 0.3),
            inset 0 0 20px rgba(252, 63, 49, 0.1);
        }
        50% { 
          box-shadow: 
            0 0 40px #fc3f31,
            0 0 80px rgba(252, 63, 49, 0.6),
            inset 0 0 40px rgba(252, 63, 49, 0.3);
        }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const menuButtonStyle = {
    fontSize: isMobile ? "28px" : "36px",
    fontWeight: 700,
    padding: isMobile ? "12px 30px" : "15px 45px",
    minHeight: isMobile ? "60px" : "80px",
    minWidth: isMobile ? "220px" : "280px",
    backgroundColor: "transparent",
    borderColor: "#fc3f31",
    border: "4px solid #fc3f31",
    borderRadius: "15px",
    color: "#fc3f31",
    textTransform: "uppercase",
    letterSpacing: "3px",
    fontFamily: "Anton, sans-serif",
    boxShadow: `
      0 0 20px #fc3f31,
      0 0 40px rgba(252, 63, 49, 0.3),
      inset 0 0 20px rgba(252, 63, 49, 0.1)
    `,
    transition: "all 0.3s ease",
    cursor: "pointer",
    marginBottom: isMobile ? "15px" : "20px",
    animation: "redFlash 2s ease-in-out infinite"
  };

  const handleButtonHover = (e, isEntering) => {
    if (!isMobile) {
      if (isEntering) {
        e.target.style.transform = "scale(1.05) rotate(1deg)";
        e.target.style.backgroundColor = "rgba(252, 63, 49, 0.1)";
        e.target.style.boxShadow = `
          0 0 30px #fc3f31,
          0 0 60px rgba(252, 63, 49, 0.5),
          inset 0 0 30px rgba(252, 63, 49, 0.2)
        `;
        e.target.style.animation = "screenShake 0.5s ease-in-out";
      } else {
        e.target.style.transform = "scale(1) rotate(0deg)";
        e.target.style.backgroundColor = "transparent";
        e.target.style.boxShadow = `
          0 0 20px #fc3f31,
          0 0 40px rgba(252, 63, 49, 0.3),
          inset 0 0 20px rgba(252, 63, 49, 0.1)
        `;
        e.target.style.animation = "redFlash 2s ease-in-out infinite";
      }
    }
  };

  return (
    <Box
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#1a1a1a',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        backgroundImage: `
          radial-gradient(circle at 20% 20%, rgba(252, 63, 49, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(252, 63, 49, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.9) 100%)
        `,
        animation: "fightPunchIn 1s ease-out, backgroundImpact 1.5s ease-out"
      }}
    >
      {/* Main title */}
      <Stack spacing={isMobile ? "xl" : "xxl"} align="center">
        <Box 
          style={{ 
            textAlign: 'center', 
            marginBottom: isMobile ? '40px' : '60px',
            animation: "titleSlam 1.2s ease-out"
          }}
        >
          <Text
            style={{
              fontSize: isMobile ? '60px' : '120px',
              fontWeight: 900,
              color: '#fc3f31',
              fontFamily: 'Anton, sans-serif',
              letterSpacing: '8px',
              textShadow: `
                0 0 20px #fc3f31,
                0 0 40px rgba(252, 63, 49, 0.5),
                0 4px 20px rgba(252, 63, 49, 0.3)
              `,
              lineHeight: 0.9,
              marginBottom: '10px'
            }}
          >
            FIGHT CLUB
          </Text>
          <Text
            style={{
              fontSize: isMobile ? '18px' : '24px',
              fontWeight: 400,
              color: '#ffffff',
              fontFamily: 'Arial, sans-serif',
              letterSpacing: '2px',
              marginTop: '10px',
              animation: "fightPunchIn 1.5s ease-out 0.3s both"
            }}
          >
            You do not talk about fight club
          </Text>
        </Box>

        {/* Menu buttons */}
        <Stack 
          spacing={isMobile ? "lg" : "xl"} 
          align="center"
          style={{
            animation: "buttonsPunchSequence 1s ease-out 0.5s both"
          }}
        >
          <Button
            variant="outline"
            size="xl"
            onClick={onStartClick}
            style={{
              ...menuButtonStyle,
              animationDelay: "0.7s"
            }}
            onMouseEnter={(e) => handleButtonHover(e, true)}
            onMouseLeave={(e) => handleButtonHover(e, false)}
          >
            START
          </Button>

          <Button
            variant="outline"
            size="xl"
            onClick={onFightersClick}
            style={{
              ...menuButtonStyle,
              animationDelay: "0.9s"
            }}
            onMouseEnter={(e) => handleButtonHover(e, true)}
            onMouseLeave={(e) => handleButtonHover(e, false)}
          >
            FIGHTERS
          </Button>

          <Button
            variant="outline"
            size="xl"
            onClick={onShopClick}
            style={{
              ...menuButtonStyle,
              animationDelay: "1.1s"
            }}
            onMouseEnter={(e) => handleButtonHover(e, true)}
            onMouseLeave={(e) => handleButtonHover(e, false)}
          >
            SHOP
          </Button>

          <Button
            variant="outline"
            size="xl"
            onClick={onBackClick}
            style={{
              ...menuButtonStyle,
              animationDelay: "1.3s"
            }}
            onMouseEnter={(e) => handleButtonHover(e, true)}
            onMouseLeave={(e) => handleButtonHover(e, false)}
          >
            BACK
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default MainMenu; 