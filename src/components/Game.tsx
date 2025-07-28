
import { Canvas } from '@react-three/fiber';
import { Suspense, useState, useEffect } from 'react';
import { GameMenu } from './GameMenu';
import { GameWorld } from './GameWorld';
import { GameUI } from './GameUI';
import { useGameStore } from '../hooks/useGameStore';

export const Game = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const { 
    playerName, 
    playerTeam, 
    gameState, 
    initializeGame,
    connectPlayer 
  } = useGameStore();

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const handleStartGame = (name: string, team: 'human' | 'zombie') => {
    connectPlayer(name, team);
    setGameStarted(true);
  };

  if (!gameStarted) {
    return <GameMenu onStartGame={handleStartGame} />;
  }

  return (
    <div className="w-full h-screen bg-background relative overflow-hidden">
      {/* 3D Game World */}
      <Canvas
        camera={{ 
          position: [0, 1.6, 0], 
          fov: 75,
          near: 0.1,
          far: 1000
        }}
        className="absolute inset-0"
        style={{ cursor: 'none' }}
      >
        <Suspense fallback={null}>
          <GameWorld />
        </Suspense>
      </Canvas>

      {/* Game UI Overlay */}
      <GameUI 
        playerName={playerName}
        playerTeam={playerTeam}
        gameState={gameState}
        onExitGame={() => setGameStarted(false)}
      />
    </div>
  );
};
