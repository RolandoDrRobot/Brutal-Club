import { CameraControls } from "./CameraControls";
import Pete from "./Pete";
import Tyler from "./Tyler";

import BloodFloor from "./BloodFloor";
import BarBasement from "./BarBasement";
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
      // Sync mode: same distance but facing each other (like combat)
      return {
        player1: {
          position: [-0.5, 0, 0],
          rotation: [0, Math.PI / 2, 0]  // Mirando hacia la derecha (al Player 2)
        },
        player2: {
          position: [0.5, 0, 0],
          rotation: [0, -Math.PI / 2, 0] // Mirando hacia la izquierda (al Player 1)
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
      
      {/* Bar Basement Scenario */}
      <BarBasement />
      
      {/* Blood effects - Mantener gotas de sangre en el piso */}
      <BloodFloor />
      
      <group position={[0, 0, 0]}>
        {renderCharacter(selectedPlayer1Character, 1, transforms.player1.position, transforms.player1.rotation)}
        {renderCharacter(selectedPlayer2Character, 2, transforms.player2.position, transforms.player2.rotation)}
      </group>
    </>
  );
};

export default Experience;
