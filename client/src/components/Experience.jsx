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

  // Posiciones y rotaciones según el modo
  const getCharacterTransforms = () => {
    if (isCombatMode) {
      // Modo combate: mirándose uno al otro
      return {
        player1: {
          position: [-0.5, 0, 0],
          rotation: [0, Math.PI / 2, 0] // Mirando hacia la derecha
        },
        player2: {
          position: [0.5, 0, 0], 
          rotation: [0, -Math.PI / 2, 0] // Mirando hacia la izquierda
        }
      };
    } else {
      // Modo sincronización: misma distancia pero mirando al frente
      return {
        player1: {
          position: [-0.5, 0, 0], // Misma distancia
          rotation: [0, 0, 0] // Mirando al frente
        },
        player2: {
          position: [0.5, 0, 0], // Misma distancia
          rotation: [0, 0, 0] // Mirando al frente
        }
      };
    }
  };

  // Función para renderizar el personaje correcto según la selección
  const renderCharacter = (characterModel, player, position, rotation) => {
    const props = { player, position, rotation };
    
    switch (characterModel.toLowerCase()) {
      case 'pete':
        return <Pete {...props} />;
      case 'tyler':
        return <Tyler {...props} />;
      case 'vince':
        // Por ahora usar Tyler como placeholder para Vince
        console.log(`Using Tyler as placeholder for Vince (Player ${player})`);
        return <Tyler {...props} />;
      case 'bob':
        // Por ahora usar Pete como placeholder para Bob
        console.log(`Using Pete as placeholder for Bob (Player ${player})`);
        return <Pete {...props} />;
      default:
        // Fallback a Pete si el personaje no se reconoce
        console.warn(`Unknown character model: ${characterModel}, falling back to Pete`);
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
      
      {/* Sótano del bar */}
      <BarBasement />
      
      {/* Efectos de sangre - En ambos modos */}
      <ParticleEffect />
      <BloodFloor />
      
      {/* Audiencia - Personajes bailando alrededor */}
      <Audience />
      
      <group position={[0, -1, 0]}>
        {/* Player 1 - Personaje seleccionado */}
        {renderCharacter(selectedPlayer1Character, 1, transforms.player1.position, transforms.player1.rotation)}
        
        {/* Player 2 - Personaje seleccionado (por ahora Tyler por defecto) */}
        {renderCharacter(selectedPlayer2Character, 2, transforms.player2.position, transforms.player2.rotation)}
      </group>
    </>
  );
};

export default Experience;
