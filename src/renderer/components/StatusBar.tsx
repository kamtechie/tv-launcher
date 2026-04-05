import React from 'react';

interface StatusBarProps {
  gamepadConnected: boolean;
}

const StatusBar: React.FC<StatusBarProps> = ({ gamepadConnected }) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 40,
        backgroundColor: '#111111',
        borderBottom: '1px solid #222222',
        display: 'flex',
        alignItems: 'center',
        paddingLeft: 16,
        paddingRight: 16,
        gap: 8,
        zIndex: 100,
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: gamepadConnected ? '#00ff88' : '#555555',
          flexShrink: 0,
          transition: 'background-color 0.3s ease',
        }}
      />
      <span
        style={{
          color: gamepadConnected ? '#cccccc' : '#555555',
          fontSize: 13,
          transition: 'color 0.3s ease',
        }}
      >
        {gamepadConnected ? 'Gamepad connected' : 'No gamepad — mouse mode'}
      </span>
    </div>
  );
};

export default StatusBar;
