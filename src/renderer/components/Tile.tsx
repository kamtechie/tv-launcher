import React from 'react';

interface TileProps {
  name: string;
  icon: string;
  command: string;
  focused: boolean;
  running: boolean;
  onLaunch: () => void;
  onHover: () => void;
}

const Tile: React.FC<TileProps> = ({ name, icon, command, focused, running, onLaunch, onHover }) => {
  return (
    <div
      onClick={command ? onLaunch : undefined}
      onMouseEnter={onHover}
      style={{
        width: '18vmin',
        height: '18vmin',
        borderRadius: '1.4vmin',
        backgroundColor: '#1e1e1e',
        border: `0.25vmin solid ${focused ? '#00aaff' : 'transparent'}`,
        transform: focused ? 'scale(1.1)' : 'scale(1)',
        transition: 'transform 0.15s ease, border-color 0.15s ease',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: command ? 'pointer' : 'default',
        position: 'relative',
        userSelect: 'none',
      }}
    >
      {running && (
        <div
          style={{
            position: 'absolute',
            top: '0.8vmin',
            right: '0.8vmin',
            width: '0.8vmin',
            height: '0.8vmin',
            borderRadius: '50%',
            backgroundColor: '#00ff88',
          }}
        />
      )}
      <span style={{ fontSize: '6vmin', lineHeight: 1 }}>{icon}</span>
      <span
        style={{
          color: focused ? '#ffffff' : '#aaaaaa',
          fontSize: '1.5vmin',
          marginTop: '1vmin',
          transition: 'color 0.15s ease',
          fontWeight: 600,
        }}
      >
        {name}
      </span>
    </div>
  );
};

export default Tile;
