import { useAnimations, useGLTF } from "@react-three/drei";
import React, { useEffect, useRef, useMemo, useState } from "react";
import { SkeletonUtils } from "three-stdlib";
import { useCharacterAnimations } from "../contexts/CharacterAnimations";

function AudienceMember({ position, rotation, modelPath = "./models/pete.glb", initialAnimationIndex, memberId, ...props }) {
  const group = useRef();
  const { scene, animations } = useGLTF(modelPath);
  const [currentAnimationIndex, setCurrentAnimationIndex] = useState(initialAnimationIndex);
  
  // Clone the scene to create independent instances and apply natural materials
  const clonedScene = useMemo(() => {
    const cloned = SkeletonUtils.clone(scene);
    
    // Apply natural, non-shiny materials to all meshes
    cloned.traverse((child) => {
      if (child.isMesh && child.material) {
        // If it's an array of materials
        if (Array.isArray(child.material)) {
          child.material = child.material.map((mat) => {
            const newMaterial = mat.clone();
            newMaterial.roughness = 0.9; // Very rough (non-shiny)
            newMaterial.metalness = 0.05; // Minimal metallic properties
            return newMaterial;
          });
        } else {
          // Single material
          const newMaterial = child.material.clone();
          newMaterial.roughness = 0.9; // Very rough (non-shiny)
          newMaterial.metalness = 0.05; // Minimal metallic properties
          child.material = newMaterial;
        }
      }
    });
    
    return cloned;
  }, [scene]);
  
  const { actions, names } = useAnimations(animations, group);

  // Find and play the "crowd" animation in loop
  useEffect(() => {
    if (actions && names.length > 0) {
      // Find the crowd animation
      const crowdAnimationName = names.find(name => name.toLowerCase().includes('crowd'));
      
      if (crowdAnimationName && actions[crowdAnimationName]) {
        // Stop all other animations first
        Object.values(actions).forEach(action => action.stop());
        
        // Play the crowd animation in loop
        actions[crowdAnimationName].reset().fadeIn(0.5).play();
        actions[crowdAnimationName].setLoop(2201, Infinity); // Loop infinitely
        
        // Proper cleanup function to prevent memory leaks
        return () => {
          if (actions[crowdAnimationName]) {
            actions[crowdAnimationName].fadeOut(0.5).stop();
          }
          // Stop all animations on unmount
          Object.values(actions).forEach(action => {
            if (action.isRunning()) {
              action.fadeOut(0.2).stop();
            }
          });
        };
      } else {
        // Fallback to first available animation if crowd not found
        if (actions[names[0]]) {
          actions[names[0]].reset().fadeIn(0.5).play();
        }
      }
    }
  }, [actions, names]);

  return (
    <group ref={group} position={position} rotation={rotation} {...props} dispose={null}>
      <primitive object={clonedScene} />
    </group>
  );
}

// Chuck audience member with crowd animation - Now using unified component
const ChuckAudience = ({ position, rotation, ...props }) => (
  <AudienceMember 
    position={position} 
    rotation={rotation} 
    modelPath="./models/Chuck.glb"
    {...props} 
  />
);

// Earl audience member with crowd animation - Now using unified component
const EarlAudience = ({ position, rotation, ...props }) => (
  <AudienceMember 
    position={position} 
    rotation={rotation} 
    modelPath="./models/Earl.glb"
    {...props} 
  />
);

// Wayne audience member with crowd animation - Now using unified component
const WayneAudience = ({ position, rotation, ...props }) => (
  <AudienceMember 
    position={position} 
    rotation={rotation} 
    modelPath="./models/Wayne.glb"
    {...props} 
  />
);

// Vince audience member with crowd animation - Now using unified component  
const VinceAudience = ({ position, rotation, ...props }) => (
  <AudienceMember 
    position={position} 
    rotation={rotation} 
    modelPath="./models/Vince.glb"
    {...props} 
  />
);

function Audience() {
  const { animations } = useCharacterAnimations();
  
  // Create a simplified audience circle with original configuration
  const audienceMembers = useMemo(() => {
    const members = [];
    const audienceTypes = [
      { component: 'Chuck', model: 'Chuck.glb', name: 'Chuck' },
      { component: 'Wayne', model: 'Wayne.glb', name: 'Wayne' },
      { component: 'Earl', model: 'Earl.glb', name: 'Earl' },
      { component: 'Vince', model: 'Vince.glb', name: 'Vince' }
    ];
    
    const numMembers = audienceTypes.length; // 4 audience members
    const radius = 2.8; // Closer distance from center where the fighters are
    const centerY = -1.2; // Same level as main characters (adjusted for floor)
    
    audienceTypes.forEach((type, i) => {
      // Distribute evenly around the circle
      const angle = (i / numMembers) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      
      // Rotation to face the center (where main characters are)
      const rotationY = Math.atan2(-x, -z);
      
      // Add some random variation to make it more natural
      const randomOffset = {
        x: (Math.random() - 0.5) * 0.15,
        z: (Math.random() - 0.5) * 0.15,
        y: (Math.random() - 0.5) * 0.1
      };
      
      members.push({
        id: `${type.name.toLowerCase()}-${i}`,
        type: type.component,
        name: type.name,
        position: [x + randomOffset.x, centerY + randomOffset.y, z + randomOffset.z],
        rotation: [0, rotationY + (Math.random() - 0.5) * 0.1, 0],
        scale: 1.0 // Uniform scale for all audience members
      });
    });
    
    return members;
  }, []);

  return (
    <group>
      {audienceMembers.map((member) => {
        // Render the appropriate component based on type
        switch (member.type) {
          case 'Earl':
            return (
              <group key={member.id} scale={member.scale}>
                <EarlAudience
                  position={member.position}
                  rotation={member.rotation}
                />
              </group>
            );
          case 'Vince':
            return (
              <group key={member.id} scale={member.scale}>
                <VinceAudience
                  position={member.position}
                  rotation={member.rotation}
                />
              </group>
            );
          case 'Chuck':
            return (
              <group key={member.id} scale={member.scale}>
                <ChuckAudience
                  position={member.position}
                  rotation={member.rotation}
                />
              </group>
            );
          case 'Wayne':
            return (
              <group key={member.id} scale={member.scale}>
                <WayneAudience
                  position={member.position}
                  rotation={member.rotation}
                />
              </group>
            );
          default:
            return null;
        }
      })}
    </group>
  );
}

// Preload only the models we're actually using for better performance
useGLTF.preload("./models/Chuck.glb");
useGLTF.preload("./models/Earl.glb");
useGLTF.preload("./models/Wayne.glb");
useGLTF.preload("./models/Vince.glb");

export default Audience; 