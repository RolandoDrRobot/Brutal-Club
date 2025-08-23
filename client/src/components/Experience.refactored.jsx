import { CameraControls } from "./CameraControls";
import Pete from "./Pete";
import Tyler from "./Tyler";
import BloodFloor from "./BloodFloor";
import { useCharacterAnimations } from "../contexts/CharacterAnimations";
import { getCharacterTransforms, getCharacterComponent } from "../utils/characterUtils";
import React, { Suspense } from "react";

// OPTIMIZED: Lazy load heavy 3D components for better code splitting
const Audience = React.lazy(() => import("./Audience"));
const BarBasement = React.lazy(() => import("./BarBasement"));

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
      
      {/* Bar Basement Scenario - Lazy loaded */}
      <Suspense fallback={null}>
        <BarBasement />
      </Suspense>
      
      {/* Audience around the fighters - Lazy loaded */}
      <Suspense fallback={null}>
        <Audience />
      </Suspense>
      
      {/* Blood effects - Mantener gotas de sangre en el piso */}
      <BloodFloor />
      
      <group position={[0, 0, 0]}>
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