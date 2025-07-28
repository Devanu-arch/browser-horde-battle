import { Button } from './ui/button';
import { Card } from './ui/card';
import { GameState } from '../hooks/useGameStore';

interface GameUIProps {
  playerName: string;
  playerTeam: 'human' | 'zombie';
  gameState: GameState;
  onExitGame: () => void;
}

export const GameUI = ({ playerName, playerTeam, gameState, onExitGame }: GameUIProps) => {
  const playerCount = Object.keys(gameState.players).length;
  const zombieCount = gameState.zombies.length;
  const humanCount = Object.values(gameState.players).filter(p => p.team === 'human').length;

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Top HUD */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-auto">
        <Card className="bg-card/90 border-primary/20 p-4 backdrop-blur-sm">
          <div className="text-sm space-y-1">
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${playerTeam === 'human' ? 'bg-human' : 'bg-zombie'}`} />
              <span className="font-bold text-foreground">{playerName}</span>
            </div>
            <div className="text-muted-foreground">
              Team: <span className={playerTeam === 'human' ? 'text-human' : 'text-zombie'}>
                {playerTeam.toUpperCase()}
              </span>
            </div>
          </div>
        </Card>

        <Card className="bg-card/90 border-primary/20 p-4 backdrop-blur-sm">
          <div className="text-sm space-y-1 text-center">
            <div className="text-foreground font-bold">Round {gameState.round}</div>
            <div className="text-muted-foreground">
              👥 {humanCount} vs 🧟 {zombieCount}
            </div>
          </div>
        </Card>

        <Button
          onClick={onExitGame}
          variant="destructive"
          size="sm"
          className="bg-destructive/90 hover:bg-destructive"
        >
          Exit Game
        </Button>
      </div>

      {/* Crosshair */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-6 h-6 flex items-center justify-center">
          <div className="w-0.5 h-4 bg-primary/80 absolute"></div>
          <div className="w-4 h-0.5 bg-primary/80 absolute"></div>
          <div className="w-1 h-1 bg-primary/80 rounded-full"></div>
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 pointer-events-auto">
        <Card className="bg-card/80 border-border/50 p-3 backdrop-blur-sm">
          <div className="text-xs text-muted-foreground space-y-1">
            <div><strong>WASD</strong> - Move</div>
            <div><strong>Mouse</strong> - Look Around</div>
            <div><strong>Click</strong> - Shoot</div>
            <div><strong>ESC</strong> - Release Mouse</div>
          </div>
        </Card>
      </div>

      {/* Player List */}
      <div className="absolute top-20 right-4 pointer-events-auto">
        <Card className="bg-card/80 border-border/50 p-3 backdrop-blur-sm max-w-xs">
          <h4 className="text-sm font-bold text-foreground mb-2">Players Online</h4>
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {Object.values(gameState.players).map(player => (
              <div key={player.id} className="flex items-center gap-2 text-xs">
                <span className={`w-2 h-2 rounded-full ${player.team === 'human' ? 'bg-human' : 'bg-zombie'}`} />
                <span className={`flex-1 ${!player.alive ? 'line-through opacity-50' : ''}`}>
                  {player.name}
                </span>
                <span className="text-muted-foreground">
                  {player.health}hp
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};