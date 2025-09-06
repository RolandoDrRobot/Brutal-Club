import { useAnimations, useGLTF } from "@react-three/drei";
import React, { useEffect, useRef, useMemo, useState } from "react";
import { SkeletonUtils } from "three-stdlib";
import { useCharacterAnimations } from "../contexts/CharacterAnimations";

function AudienceMember({ position, rotation, modelPath = "./models/pete.glb", initialAnimationIndex, memberId, ...props }) {
  const group = useRef();
  const { scene, animations } = useGLTF(modelPath);
  const [currentAnimationIndex] = useState(initialAnimationIndex);
  
  const clonedScene = useMemo(() => {
    const cloned = SkeletonUtils.clone(scene);
    
    cloned.traverse((child) => {
      if (child.isMesh && child.material) {
        if (Array.isArray(child.material)) {
          child.material = child.material.map((mat) => {
            const newMaterial = mat.clone();
            newMaterial.roughness = 0.9;
            newMaterial.metalness = 0.05;
            return newMaterial;
          });
        } else {
          const newMaterial = child.material.clone();
          newMaterial.roughness = 0.9;
          newMaterial.metalness = 0.05;
          child.material = newMaterial;
        }
      }
    });
    
    return cloned;
  }, [scene]);
  
  const { actions, names } = useAnimations(animations, group);

  useEffect(() => {
    if (actions && names.length > 0) {
      const crowdAnimationName = names.find(name => name.toLowerCase().includes('crowd'));
      
      if (crowdAnimationName && actions[crowdAnimationName]) {
        Object.values(actions).forEach(action => action.stop());
        
        actions[crowdAnimationName].reset().fadeIn(0.5).play();
        actions[crowdAnimationName].setLoop(2201, Infinity);
        
        return () => {
          if (actions[crowdAnimationName]) {
            actions[crowdAnimationName].fadeOut(0.5).stop();
          }
          Object.values(actions).forEach(action => {
            if (action && action.isRunning && action.isRunning()) {
              action.fadeOut(0.2).stop();
            }
          });
        };
      } else {
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

const ChuckAudience = ({ position, rotation, ...props }) => (
  <AudienceMember 
    position={position} 
    rotation={rotation} 
    modelPath="./models/Chuck.glb"
    {...props} 
  />
);

const EarlAudience = ({ position, rotation, ...props }) => (
  <AudienceMember 
    position={position} 
    rotation={rotation} 
    modelPath="./models/Earl.glb"
    {...props} 
  />
);

const WayneAudience = ({ position, rotation, ...props }) => (
  <AudienceMember 
    position={position} 
    rotation={rotation} 
    modelPath="./models/Wayne.glb"
    {...props} 
  />
);

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
  
  const audienceMembers = useMemo(() => {
    const members = [];
    const audienceTypes = [
      { component: 'Chuck', model: 'Chuck.glb', name: 'Chuck' },
      { component: 'Wayne', model: 'Wayne.glb', name: 'Wayne' },
      { component: 'Earl', model: 'Earl.glb', name: 'Earl' },
      { component: 'Vince', model: 'Vince.glb', name: 'Vince' }
    ];
    
    const numMembers = audienceTypes.length;
    const radius = 2.8;
    const centerY = -1.2;
    
    audienceTypes.forEach((type, i) => {
      const angle = (i / numMembers) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      
      const rotationY = Math.atan2(-x, -z);
      
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
        scale: 1.0
      });
    });
    
    return members;
  }, []);

  return (
    <group>
      {audienceMembers.map((member) => {
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

useGLTF.preload("./models/Chuck.glb");
useGLTF.preload("./models/Earl.glb");
useGLTF.preload("./models/Wayne.glb");
useGLTF.preload("./models/Vince.glb");

export default Audience; 