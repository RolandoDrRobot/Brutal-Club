import { CameraControls } from "./CameraControls";
import Pete from "./Pete";
import Tyler from "./Tyler";
import ParticleEffect from "./ParticleEffect";
import BloodFloor from "./BloodFloor";
import Audience from "./Audience";
import BarBasement from "./UrbanEnvironment";
import { useCharacterAnimations } from "../contexts/CharacterAnimations";

const Experience = () => {
  const { isCombatMode, selectedPlayer1Character, selectedPlayer2Character } = useCharacterAnimations();

  // Positions and rotations according to mode
  const getCharacterTransforms = () => {
    if (isCombatMode) {
      // Combat mode: facing each other
      return {
        player1: {
          position: [-0.5, 0, 0],
          rotation: [0, Math.PI / 2, 0]
        },
        player2: {
          position: [0.5, 0, 0], 
          rotation: [0, -Math.PI / 2, 0]
        }
      };
    } else {
      // Sync mode: same distance but facing front
      return {
        player1: {
          position: [-0.5, 0, 0],
          rotation: [0, 0, 0]
        },
        player2: {
          position: [0.5, 0, 0],
          rotation: [0, 0, 0]
        }
      };
    }
  };

  // Function to render the correct character according to selection
  const renderCharacter = (characterModel, player, position, rotation) => {
    const props = { player, position, rotation };
    
    switch (characterModel.toLowerCase()) {
      case 'pete':
        return <Pete {...props} />;
      case 'tyler':
        return <Tyler {...props} />;
      case 'vince':
        return <Tyler {...props} />;
      case 'bob':
        return <Pete {...props} />;
      default:
        return <Pete {...props} />;
    }
  };

  const transforms = getCharacterTransforms();

  return (
    <>
      <CameraControls />
      <ambientLight intensity={0.2} />
      <directionalLight
        position={[-5, 10, 5]}
        intensity={0.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      
      {/* Bar basement */}
      <BarBasement />
      
      {/* Blood effects - In both modes */}
      <ParticleEffect />
      <BloodFloor />
      
      {/* Audience - Characters dancing around */}
      <Audience />
      
      <group position={[0, -1, 0]}>
        {/* Player 1 - Selected character */}
        {renderCharacter(selectedPlayer1Character, 1, transforms.player1.position, transforms.player1.rotation)}
        
        {/* Player 2 - Selected character */}
        {renderCharacter(selectedPlayer2Character, 2, transforms.player2.position, transforms.player2.rotation)}
      </group>
    </>
  );
};

export default Experience;
