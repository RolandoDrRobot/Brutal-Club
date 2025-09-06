import { CameraControls } from "./CameraControls";
import Pete from "./Pete";
import Tyler from "./Tyler";
import BloodFloor from "./BloodFloor";
import { useCharacterAnimations } from "../contexts/CharacterAnimations";
import React, { Suspense, useState, useEffect } from "react";
import { useModelLoader } from "../hooks/useModelLoader";

const Audience = React.lazy(() => import("./Audience"));
const BarBasement = React.lazy(() => import("./BarBasement"));

const Experience = () => {
  const { isCombatMode, selectedPlayer1Character, selectedPlayer2Character } = useCharacterAnimations();
  const { loadOpponentModel } = useModelLoader();
  
  const [loadedModels, setLoadedModels] = useState(new Set(['pete']));
  const [showAudience, setShowAudience] = useState(false);

  useEffect(() => {
    const loadOpponentIfNeeded = async () => {
      if (selectedPlayer2Character && !loadedModels.has(selectedPlayer2Character.toLowerCase())) {
        try {
          await loadOpponentModel(selectedPlayer2Character);
          setLoadedModels(prev => new Set([...prev, selectedPlayer2Character.toLowerCase()]));
        } catch (error) {

        }
      }
    };

    loadOpponentIfNeeded();
  }, [selectedPlayer2Character, loadedModels, loadOpponentModel]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAudience(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const getCharacterTransforms = () => {
    if (isCombatMode) {
      return {
        player1: {
          position: [-0.5, -1.2, 0],
          rotation: [0, Math.PI / 2, 0]
        },
        player2: {
          position: [0.5, -1.2, 0], 
          rotation: [0, -Math.PI / 2, 0]
        }
      };
    } else {
      return {
        player1: {
          position: [-0.5, -1.2, 0],
          rotation: [0, Math.PI / 2, 0]
        },
        player2: {
          position: [0.5, -1.2, 0],
          rotation: [0, -Math.PI / 2, 0]
        }
      };
    }
  };

  const renderCharacter = (characterModel, player, position, rotation) => {
    const props = { player, position, rotation };
    
    const modelName = characterModel.toLowerCase();
    if (!loadedModels.has(modelName) && modelName !== 'pete') {
      return <Pete {...props} />;
    }
    
    switch (modelName) {
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
      
      {/* Bar Basement Scenario - Lazy loaded */}
      <Suspense fallback={null}>
        <BarBasement />
      </Suspense>
      
      {/* Audience around the fighters - Lazy loaded and delayed */}
      {showAudience && (
        <Suspense fallback={null}>
          <Audience />
        </Suspense>
      )}
      
      {/* Blood effects - Mantener gotas de sangre en el piso */}
      <BloodFloor />
      
      <group position={[0, 0, 0]}>
        <group scale={[1.0, 1.0, 1.0]}>
          {renderCharacter(selectedPlayer1Character, 1, transforms.player1.position, transforms.player1.rotation)}
        </group>
        <group scale={[1.0, 1.0, 1.0]}>
          {renderCharacter(selectedPlayer2Character, 2, transforms.player2.position, transforms.player2.rotation)}
        </group>
      </group>
    </>
  );
};

export default Experience;
