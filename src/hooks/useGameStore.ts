import { useState, useCallback, useEffect } from 'react';

export interface Player {
  id: string;
  name: string;
  team: 'human' | 'zombie';
  x: number;
  z: number;
  health: number;
  rotation: number;
  alive: boolean;
}

export interface Zombie {
  id: string;
  x: number;
  z: number;
  health: number;
  target?: string;
  rotation: number;
}

export interface Bullet {
  id: string;
  x: number;
  y: number;
  z: number;
  velocityX: number;
  velocityY: number;
  velocityZ: number;
  team: 'human' | 'zombie';
  shooter: string;
}

export interface GameState {
  players: Record<string, Player>;
  zombies: Zombie[];
  bullets: Bullet[];
  gameStarted: boolean;
  round: number;
}

const STORAGE_KEY = 'zombie-fps-game-state';
const PLAYER_KEY = 'zombie-fps-player';

export const useGameStore = () => {
  const [gameState, setGameState] = useState<GameState>({
    players: {},
    zombies: [],
    bullets: [],
    gameStarted: false,
    round: 1
  });

  const [playerName, setPlayerName] = useState('');
  const [playerTeam, setPlayerTeam] = useState<'human' | 'zombie'>('human');
  const [playerId, setPlayerId] = useState('');

  // Load game state from localStorage
  const loadGameState = useCallback(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsedState = JSON.parse(saved);
        setGameState(parsedState);
      }
    } catch (error) {
      console.error('Failed to load game state:', error);
    }
  }, []);

  // Save game state to localStorage
  const saveGameState = useCallback((state: GameState) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save game state:', error);
    }
  }, []);

  // Initialize game
  const initializeGame = useCallback(() => {
    loadGameState();
    
    // Load player info
    try {
      const playerInfo = localStorage.getItem(PLAYER_KEY);
      if (playerInfo) {
        const { name, team, id } = JSON.parse(playerInfo);
        setPlayerName(name);
        setPlayerTeam(team);
        setPlayerId(id);
      }
    } catch (error) {
      console.error('Failed to load player info:', error);
    }

    // Spawn initial zombies if this is a new game
    const currentState = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    if (!currentState.zombies || currentState.zombies.length === 0) {
      spawnZombies(5);
    }
  }, [loadGameState]);

  // Connect player to game
  const connectPlayer = useCallback((name: string, team: 'human' | 'zombie') => {
    const id = Math.random().toString(36).substr(2, 9);
    setPlayerName(name);
    setPlayerTeam(team);
    setPlayerId(id);

    // Save player info
    localStorage.setItem(PLAYER_KEY, JSON.stringify({ name, team, id }));

    // Add player to game state
    const newPlayer: Player = {
      id,
      name,
      team,
      x: Math.random() * 20 - 10,
      z: Math.random() * 20 - 10,
      health: 100,
      rotation: 0,
      alive: true
    };

    setGameState(prevState => {
      const newState = {
        ...prevState,
        players: {
          ...prevState.players,
          [id]: newPlayer
        },
        gameStarted: true
      };
      saveGameState(newState);
      return newState;
    });
  }, [saveGameState]);

  // Spawn zombies
  const spawnZombies = useCallback((count: number) => {
    const newZombies: Zombie[] = [];
    for (let i = 0; i < count; i++) {
      newZombies.push({
        id: Math.random().toString(36).substr(2, 9),
        x: Math.random() * 40 - 20,
        z: Math.random() * 40 - 20,
        health: 50,
        rotation: Math.random() * Math.PI * 2
      });
    }

    setGameState(prevState => {
      const newState = {
        ...prevState,
        zombies: [...prevState.zombies, ...newZombies]
      };
      saveGameState(newState);
      return newState;
    });
  }, [saveGameState]);

  // Move player
  const movePlayer = useCallback((x: number, z: number) => {
    if (!playerId) return;

    setGameState(prevState => {
      const newState = {
        ...prevState,
        players: {
          ...prevState.players,
          [playerId]: {
            ...prevState.players[playerId],
            x,
            z
          }
        }
      };
      saveGameState(newState);
      return newState;
    });
  }, [playerId, saveGameState]);

  // Update player rotation
  const updatePlayerRotation = useCallback((rotation: number) => {
    if (!playerId) return;

    setGameState(prevState => {
      const newState = {
        ...prevState,
        players: {
          ...prevState.players,
          [playerId]: {
            ...prevState.players[playerId],
            rotation
          }
        }
      };
      saveGameState(newState);
      return newState;
    });
  }, [playerId, saveGameState]);

  // Shoot bullet
  const shootBullet = useCallback(() => {
    if (!playerId || !gameState.players[playerId]) return;

    const player = gameState.players[playerId];
    const bullet: Bullet = {
      id: Math.random().toString(36).substr(2, 9),
      x: player.x,
      y: 1.6,
      z: player.z,
      velocityX: Math.sin(player.rotation) * 20,
      velocityY: 0,
      velocityZ: Math.cos(player.rotation) * 20,
      team: player.team,
      shooter: playerId
    };

    setGameState(prevState => {
      const newState = {
        ...prevState,
        bullets: [...prevState.bullets, bullet]
      };
      saveGameState(newState);
      return newState;
    });
  }, [playerId, gameState.players, saveGameState]);

  // Auto-sync with localStorage changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const newState = JSON.parse(e.newValue);
          setGameState(newState);
        } catch (error) {
          console.error('Failed to parse updated game state:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Update bullets and zombie AI
  useEffect(() => {
    const interval = setInterval(() => {
      setGameState(prevState => {
        let newState = { ...prevState };
        let hasChanges = false;

        // Update bullets
        newState.bullets = newState.bullets.filter(bullet => {
          const newX = bullet.x + bullet.velocityX * 0.016;
          const newZ = bullet.z + bullet.velocityZ * 0.016;
          
          // Remove bullets that are too far
          if (Math.abs(newX) > 50 || Math.abs(newZ) > 50) {
            hasChanges = true;
            return false;
          }

          bullet.x = newX;
          bullet.z = newZ;
          
          // Check collision with zombies
          if (bullet.team === 'human') {
            const hitZombie = newState.zombies.find(zombie => {
              const distance = Math.sqrt((zombie.x - bullet.x) ** 2 + (zombie.z - bullet.z) ** 2);
              return distance < 1;
            });

            if (hitZombie) {
              hitZombie.health -= 25;
              hasChanges = true;
              return false; // Remove bullet
            }
          }

          return true;
        });

        // Remove dead zombies
        newState.zombies = newState.zombies.filter(zombie => zombie.health > 0);

        // Simple zombie AI - move towards nearest human player
        newState.zombies.forEach(zombie => {
          const humanPlayers = Object.values(newState.players).filter(p => p.team === 'human' && p.alive);
          if (humanPlayers.length > 0) {
            const nearest = humanPlayers.reduce((closest, player) => {
              const dist1 = Math.sqrt((zombie.x - player.x) ** 2 + (zombie.z - player.z) ** 2);
              const dist2 = Math.sqrt((zombie.x - closest.x) ** 2 + (zombie.z - closest.z) ** 2);
              return dist1 < dist2 ? player : closest;
            });

            const dx = nearest.x - zombie.x;
            const dz = nearest.z - zombie.z;
            const distance = Math.sqrt(dx ** 2 + dz ** 2);
            
            if (distance > 0) {
              zombie.rotation = Math.atan2(dx, dz);
              zombie.x += (dx / distance) * 2 * 0.016;
              zombie.z += (dz / distance) * 2 * 0.016;
              hasChanges = true;
            }
          }
        });

        if (hasChanges) {
          saveGameState(newState);
        }

        return newState;
      });
    }, 16); // ~60 FPS

    return () => clearInterval(interval);
  }, [saveGameState]);

  return {
    gameState,
    playerName,
    playerTeam,
    playerId,
    initializeGame,
    connectPlayer,
    movePlayer,
    updatePlayerRotation,
    shootBullet,
    spawnZombies
  };
};