import { CameraControls } from "./CameraControls";
import Pete from "./Pete";
import Tyler from "./Tyler";
import ParticleEffect from "./ParticleEffect";
import BloodFloor from "./BloodFloor";
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
      
      {/* Iluminación neón cálida de sótano - MENOS SEPIA, MÁS ILUMINADO */}
      <ambientLight intensity={0.4} color="#FFD099" /> {/* Luz ambiente más clara y menos sepia */}
      
      {/* Foco principal del techo - menos amarillento, más iluminado */}
      <spotLight
        position={[0, 8, 0]}
        intensity={1.5}
        angle={Math.PI / 3}
        penumbra={0.8}
        color="#FFDD88" // Amarillo más suave y claro
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={1}
        shadow-camera-far={20}
      />
      
      {/* Focos laterales menos saturados */}
      <spotLight
        position={[-6, 5, 3]}
        intensity={0.8}
        angle={Math.PI / 4}
        penumbra={0.9}
        color="#FFBB66" // Menos naranja, más neutral
        target-position={[0, 0, 0]}
      />
      
      <spotLight
        position={[6, 5, 3]}
        intensity={0.8}
        angle={Math.PI / 4}
        penumbra={0.9}
        color="#FFCC77" // Menos saturado
        target-position={[0, 0, 0]}
      />
      
      {/* Luz trasera más clara */}
      <directionalLight
        position={[0, 3, -8]}
        intensity={0.2}
        color="#DDAA66" // Menos sepia, más claro
      />
      
      {/* Luz de relleno más intensa */}
      <directionalLight
        position={[0, -2, 5]}
        intensity={0.15}
        color="#CCAA77" // Menos saturado
      />
      
      {/* Blood effects - Gotas y manchas de sangre en fondo negro */}
      <ParticleEffect />
      <BloodFloor />
      
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
