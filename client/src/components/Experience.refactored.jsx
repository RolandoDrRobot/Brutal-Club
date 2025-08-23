import { CameraControls } from "./CameraControls";
import Pete from "./Pete";
import Tyler from "./Tyler";

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
      
      {/* Iluminación neón cálida - MENOS SEPIA, MÁS ILUMINADO */}
      <ambientLight intensity={0.4} color="#FFD099" />
      
      {/* Foco principal menos amarillento */}
      <spotLight
        position={[0, 8, 0]}
        intensity={1.5}
        angle={Math.PI / 3}
        penumbra={0.8}
        color="#FFDD88"
        castShadow
      />
      
      {/* Focos laterales menos saturados */}
      <spotLight position={[-6, 5, 3]} intensity={0.8} angle={Math.PI / 4} penumbra={0.9} color="#FFBB66" />
      <spotLight position={[6, 5, 3]} intensity={0.8} angle={Math.PI / 4} penumbra={0.9} color="#FFCC77" />
      
      {/* Ambiente trasero más claro */}
      <directionalLight position={[0, 3, -8]} intensity={0.2} color="#DDAA66" />
      
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
      

    </>
  );
};

export default Experience; 