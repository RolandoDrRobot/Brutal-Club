import { CameraControls } from "./CameraControls";
import Pete from "./Pete";
import Tyler from "./Tyler";
import ParticleEffect from "./ParticleEffect";
import BloodFloor from "./BloodFloor";
import { useCharacterAnimations } from "../contexts/CharacterAnimations";
import { getCharacterTransforms, getCharacterComponent } from "../utils/characterUtils";

const Experience = () => {
  const { isCombatMode, selectedPlayer1Character, selectedPlayer2Character } = useCharacterAnimations();

  // Get character transforms using utility function
  const transforms = getCharacterTransforms(isCombatMode);

  // Character component map
  const characterComponents = {
    Pete,
    Tyler
  };

  // Function to render the correct character according to selection
  const renderCharacter = (characterModel, player, position, rotation) => {
    const props = { player, position, rotation };
    const componentType = getCharacterComponent(characterModel);
    const Component = characterComponents[componentType];
    
    return Component ? <Component {...props} /> : <Pete {...props} />;
  };

  return (
    <>
      <CameraControls />
      
      {/* Iluminación balanceada para fondo negro */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.9} castShadow />
      {/* Luz adicional desde el frente */}
      <directionalLight position={[0, 5, 10]} intensity={0.5} color="#ffffff" />
      {/* Luz de relleno desde atrás sutil */}
      <directionalLight position={[0, 3, -5]} intensity={0.25} color="#f0f0f0" />
      
      {/* Fondo negro con efectos de sangre */}
      <BloodFloor />
      
      {/* Characters */}
      <group>
        {renderCharacter(
          selectedPlayer1Character, 
          1, 
          transforms.player1.position, 
          transforms.player1.rotation
        )}
        {renderCharacter(
          selectedPlayer2Character, 
          2, 
          transforms.player2.position, 
          transforms.player2.rotation
        )}
      </group>
      
      {/* Effects */}
      <ParticleEffect />
    </>
  );
};

export default Experience; 