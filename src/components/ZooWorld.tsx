import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Stage, Layer, Rect, Image, Group, Text } from 'react-konva';
import { useGameStore } from '../store/gameStore';
import useImage from 'use-image';
import { Point } from '../store/types';

interface ZooWorldProps {
  onPlayGame: (gameType: string, animalId: number) => void;
}

interface TerrainTile {
  x: number;
  y: number;
  type: 'grass' | 'water' | 'sand' | 'forest';
}

const TILE_SIZE = 48;
const ANIMAL_SIZE = TILE_SIZE * 2;
const REPULSION_FORCE = 0.05;
const MOVEMENT_SPEED = 0.03;
const MAX_SPEED = 0.4;
const TERRAIN_COLORS = {
  grass: '#90EE90',
  water: '#87CEEB',
  sand: '#F4D03F',
  forest: '#228B22'
};

// Animal image component to handle image loading separately
const AnimalImage = ({ imageUrl }: { imageUrl: string }) => {
  const [image] = useImage(imageUrl);
  return <Image image={image} width={ANIMAL_SIZE} height={ANIMAL_SIZE} cornerRadius={10} />;
};

export const ZooWorld: React.FC<ZooWorldProps> = ({ onPlayGame }) => {
  const { animals } = useGameStore();
  const [stageSize, setStageSize] = useState({ width: window.innerWidth, height: window.innerHeight - 64 });
  const [hoveredAnimal, setHoveredAnimal] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState<Point>({ x: 0, y: 0 });
  const [animalPositions, setAnimalPositions] = useState<Point[]>([]);
  const [animalDirections, setAnimalDirections] = useState<Point[]>([]);
  const [terrain, setTerrain] = useState<TerrainTile[]>([]);
  const animationFrameRef = useRef<number>();
  const stageRef = useRef<any>(null);
  const lastUpdateRef = useRef<number>(0);
  const unlockedAnimals = animals.filter(a => a.unlocked);

  useEffect(() => {
    const handleResize = () => {
      setStageSize({
        width: window.innerWidth,
        height: window.innerHeight - 64
      });
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const generateTerrain = () => {
      const tiles: TerrainTile[] = [];
      const cols = Math.ceil(stageSize.width / TILE_SIZE);
      const rows = Math.ceil(stageSize.height / TILE_SIZE);

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const rand = Math.random();
          let type: TerrainTile['type'] = 'grass';
          
          if (rand < 0.1) type = 'water';
          else if (rand < 0.2) type = 'sand';
          else if (rand < 0.3) type = 'forest';

          tiles.push({ x: x * TILE_SIZE, y: y * TILE_SIZE, type });
        }
      }
      
      setTerrain(tiles);
    };

    generateTerrain();
  }, [stageSize]);

  // Funktion zur Erzeugung einer zufälligen Position mit Mindestabstand zu anderen Tieren
  /**
   * Generate a random position for an animal with a minimum distance from others
   */
  const generateSafePosition = (existingPositions: Point[]): Point => {
    const margin = ANIMAL_SIZE * 2;
    const maxAttempts = 50;
    let attempts = 0;
    
    while (attempts < maxAttempts) {
      const position = {
        x: margin + Math.random() * (stageSize.width - margin * 2),
        y: margin + Math.random() * (stageSize.height - margin * 2)
      };

      // Prüfe Mindestabstand zu anderen Tieren
      const isSafe = existingPositions.every(existing => {
        const dx = position.x - existing.x;
        const dy = position.y - existing.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance > ANIMAL_SIZE * 3;
      });

      if (isSafe || existingPositions.length === 0) {
        return position;
      }

      attempts++;
    }

    // Fallback, falls keine sichere Position gefunden wurde
    return {
      x: margin + Math.random() * (stageSize.width - margin * 2),
      y: margin + Math.random() * (stageSize.height - margin * 2)
    };
  };

  useEffect(() => {
    const initialPositions: Point[] = [];
    const initialDirections: Point[] = [];

    unlockedAnimals.forEach(() => {
      const position = generateSafePosition(initialPositions);
      initialPositions.push(position);

      const angle = Math.random() * Math.PI * 2;
      initialDirections.push({
        x: Math.cos(angle) * MOVEMENT_SPEED,
        y: Math.sin(angle) * MOVEMENT_SPEED
      });
    });
    
    setAnimalPositions(initialPositions);
    setAnimalDirections(initialDirections);
  }, [unlockedAnimals.length, stageSize]);

  const limitSpeed = useCallback((velocity: Point): Point => {
    const speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
    if (speed > MAX_SPEED) {
      const scale = MAX_SPEED / speed;
      return {
        x: velocity.x * scale,
        y: velocity.y * scale
      };
    }
    return velocity;
  }, []);

  useEffect(() => {
    const updatePositions = (timestamp: number) => {
      if (!animalPositions.length || !animalDirections.length) return;

      const deltaTime = timestamp - lastUpdateRef.current;
      lastUpdateRef.current = timestamp;

      setAnimalPositions(prevPositions => {
        if (!prevPositions.length) return prevPositions;

        const newPositions = [...prevPositions];
        const newDirections = [...animalDirections];

        for (let i = 0; i < unlockedAnimals.length; i++) {
          if (!newPositions[i] || !newDirections[i]) continue;

          // Apply repulsion forces
          let totalForceX = 0;
          let totalForceY = 0;

          for (let j = 0; j < unlockedAnimals.length; j++) {
            if (i !== j && newPositions[j]) {
              const dx = newPositions[i].x - newPositions[j].x;
              const dy = newPositions[i].y - newPositions[j].y;
              const distance = Math.sqrt(dx * dx + dy * dy);

              if (distance < ANIMAL_SIZE * 3) {
                const force = (ANIMAL_SIZE * 3 - distance) * REPULSION_FORCE;
                totalForceX += (dx / distance) * force;
                totalForceY += (dy / distance) * force;
              }
            }
          }

          // Leichte Zufallsbewegung hinzufügen
          const randomAngle = Math.random() * Math.PI * 2;
          totalForceX += Math.cos(randomAngle) * MOVEMENT_SPEED * 0.1;
          totalForceY += Math.sin(randomAngle) * MOVEMENT_SPEED * 0.1;

          // Update direction with repulsion
          newDirections[i].x += totalForceX;
          newDirections[i].y += totalForceY;

          // Limit speed
          newDirections[i] = limitSpeed(newDirections[i]);

          // Update position
          let newX = newPositions[i].x + newDirections[i].x * MOVEMENT_SPEED * deltaTime;
          let newY = newPositions[i].y + newDirections[i].y * MOVEMENT_SPEED * deltaTime;

          // Sanftes Umkehren an den Rändern
          const margin = ANIMAL_SIZE / 2;
          if (newX <= margin || newX >= stageSize.width - ANIMAL_SIZE - margin) {
            newDirections[i].x *= -0.8;
            newX = Math.max(margin, Math.min(stageSize.width - ANIMAL_SIZE - margin, newX));
          }
          if (newY <= margin || newY >= stageSize.height - ANIMAL_SIZE - margin) {
            newDirections[i].y *= -0.8;
            newY = Math.max(margin, Math.min(stageSize.height - ANIMAL_SIZE - margin, newY));
          }

          newPositions[i] = { x: newX, y: newY };
        }

        setAnimalDirections(newDirections);
        return newPositions;
      });

      animationFrameRef.current = requestAnimationFrame(updatePositions);
    };

    animationFrameRef.current = requestAnimationFrame(updatePositions);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [animalPositions.length, unlockedAnimals.length, stageSize, limitSpeed]);

  const handleAnimalClick = (animalId: number, gameType: string) => {
    onPlayGame(gameType, animalId);
  };

  const handleMouseMove = (e: any) => {
    const stage = e.target.getStage();
    if (stage) {
      const pos = stage.getPointerPosition();
      if (pos) {
        setTooltipPos({ x: pos.x, y: pos.y });
      }
    }
  };

  return (
    <Stage
      width={stageSize.width}
      height={stageSize.height}
      ref={stageRef}
      onMouseMove={handleMouseMove}
    >
      <Layer>
        {terrain.map((tile, index) => (
          <Rect
            key={index}
            x={tile.x}
            y={tile.y}
            width={TILE_SIZE}
            height={TILE_SIZE}
            fill={TERRAIN_COLORS[tile.type]}
          />
        ))}
      </Layer>

      <Layer>
        {unlockedAnimals.map((animal, index) => {
          const position = animalPositions[index];
          
          if (!position) return null;

          return (
            <Group
              key={animal.itemid}
              x={position.x}
              y={position.y}
              width={ANIMAL_SIZE}
              height={ANIMAL_SIZE}
              onClick={() => handleAnimalClick(animal.itemid, animal.game)}
              onMouseEnter={() => setHoveredAnimal(animal.itemid)}
              onMouseLeave={() => setHoveredAnimal(null)}
              cursor="pointer"
            >
              <AnimalImage imageUrl={animal.image} />
            </Group>
          );
        })}

        {hoveredAnimal !== null && (
          <Group x={tooltipPos.x + 10} y={tooltipPos.y + 10}>
            <Rect
              width={200}
              height={80}
              fill="white"
              opacity={0.9}
              cornerRadius={8}
              shadowColor="black"
              shadowBlur={10}
              shadowOpacity={0.2}
            />
            <Text
              text={animals.find(a => a.itemid === hoveredAnimal)?.name || ''}
              fontSize={16}
              fontFamily="Arial"
              fill="#333"
              padding={10}
            />
            <Text
              text="Klicken zum Spielen"
              fontSize={14}
              fontFamily="Arial"
              fill="#666"
              padding={10}
              y={20}
            />
          </Group>
        )}
      </Layer>
    </Stage>
  );
};
