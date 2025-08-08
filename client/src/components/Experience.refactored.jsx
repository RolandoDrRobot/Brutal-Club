import { CameraControls } from "./CameraControls";
import Pete from "./Pete";
import Tyler from "./Tyler";
import ParticleEffect from "./ParticleEffect";
import BloodFloor from "./BloodFloor";
import Audience from "./Audience";
import BarBasement from "./UrbanEnvironment";
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
      
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
      
      {/* Environment */}
      <BarBasement />
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
      
      {/* Audience and effects */}
      <Audience />
      <ParticleEffect />
    </>
  );
};

export default Experience; 