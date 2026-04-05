import React, { useState, useCallback } from 'react';
import Tile from './Tile';
import useGamepad from '../hooks/useGamepad';

interface TileConfig {
  name: string;
  icon: string;
  command: string;
}

const TILES: TileConfig[] = [
  { name: 'Chromium', icon: '🌐', command: 'chromium' },
  { name: 'Settings', icon: '⚙️', command: '' },
];

const COLUMNS = 4;

const Grid: React.FC = () => {
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [runningIds, setRunningIds] = useState<Map<string, number>>(new Map());

  const moveUp = useCallback(() => {
    setFocusedIndex(prev => {
      const next = prev - COLUMNS;
      return next >= 0 ? next : prev;
    });
  }, []);

  const moveDown = useCallback(() => {
    setFocusedIndex(prev => {
      const next = prev + COLUMNS;
      return next < TILES.length ? next : prev;
    });
  }, []);

  const moveLeft = useCallback(() => {
    setFocusedIndex(prev => {
      const col = prev % COLUMNS;
      return col > 0 ? prev - 1 : prev;
    });
  }, []);

  const moveRight = useCallback(() => {
    setFocusedIndex(prev => {
      const col = prev % COLUMNS;
      const next = prev + 1;
      return col < COLUMNS - 1 && next < TILES.length ? next : prev;
    });
  }, []);

  const launchTile = useCallback(async (index: number) => {
    const tile = TILES[index];
    if (!tile?.command) return;
    try {
      const id = await window.launcher.launch(tile.command);
      setRunningIds(prev => new Map(prev).set(id, index));
      await window.launcher.hide();
    } catch (err) {
      console.error('Failed to launch:', err);
    }
  }, []);

  const handleConfirm = useCallback(() => {
    setFocusedIndex(current => {
      const tile = TILES[current];
      if (tile?.command) {
        void launchTile(current);
      }
      return current;
    });
  }, [launchTile]);

  const handleHome = useCallback(() => {
    void window.launcher.show();
  }, []);

  useGamepad({
    onUp: moveUp,
    onDown: moveDown,
    onLeft: moveLeft,
    onRight: moveRight,
    onConfirm: handleConfirm,
    onBack: handleHome,
    onHome: handleHome,
  });

  const isTileRunning = (index: number): boolean => {
    for (const tileIndex of runningIds.values()) {
      if (tileIndex === index) return true;
    }
    return false;
  };

  const gridCols = Math.min(TILES.length, COLUMNS);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${gridCols}, 20vmin)`,
        gap: '2.2vmin',
      }}
    >
      {TILES.map((tile, index) => (
        <Tile
          key={tile.name}
          name={tile.name}
          icon={tile.icon}
          command={tile.command}
          focused={index === focusedIndex}
          running={isTileRunning(index)}
          onLaunch={() => void launchTile(index)}
          onHover={() => setFocusedIndex(index)}
        />
      ))}
    </div>
  );
};

export default Grid;
