import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';

interface GameMenuProps {
  onStartGame: (name: string, team: 'human' | 'zombie') => void;
}

export const GameMenu = ({ onStartGame }: GameMenuProps) => {
  const [playerName, setPlayerName] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<'human' | 'zombie' | null>(null);

  const handleStart = () => {
    if (playerName.trim() && selectedTeam) {
      onStartGame(playerName.trim(), selectedTeam);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary/20 to-background"></div>
      
      <Card className="relative z-10 p-8 max-w-md w-full border-primary/20 bg-card/95 backdrop-blur-sm">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2 drop-shadow-lg">
            ZOMBIE WARFARE
          </h1>
          <p className="text-muted-foreground">
            Multiplayer FPS Survival Game
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Player Name
            </label>
            <Input
              type="text"
              placeholder="Enter your name..."
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="bg-secondary border-border text-foreground"
              maxLength={20}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-3 block">
              Choose Your Team
            </label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant={selectedTeam === 'human' ? 'default' : 'outline'}
                onClick={() => setSelectedTeam('human')}
                className={`h-16 flex flex-col items-center justify-center ${
                  selectedTeam === 'human' 
                    ? 'bg-human text-primary-foreground shadow-lg' 
                    : 'border-human/50 hover:border-human hover:bg-human/10'
                }`}
              >
                <span className="text-lg font-bold">👥</span>
                <span className="text-xs">HUMAN</span>
              </Button>
              
              <Button
                variant={selectedTeam === 'zombie' ? 'default' : 'outline'}
                onClick={() => setSelectedTeam('zombie')}
                className={`h-16 flex flex-col items-center justify-center ${
                  selectedTeam === 'zombie' 
                    ? 'bg-zombie text-destructive-foreground shadow-lg' 
                    : 'border-zombie/50 hover:border-zombie hover:bg-zombie/10'
                }`}
              >
                <span className="text-lg font-bold">🧟</span>
                <span className="text-xs">ZOMBIE</span>
              </Button>
            </div>
          </div>

          <Button
            onClick={handleStart}
            disabled={!playerName.trim() || !selectedTeam}
            className="w-full h-12 text-lg font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
          >
            START GAME
          </Button>
        </div>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>Controls: WASD to move, Mouse to look, Click to shoot</p>
        </div>
      </Card>
    </div>
  );
};