import React from 'react';
import Grid from './components/Grid';
import StatusBar from './components/StatusBar';
import useGamepadStatus from './hooks/useGamepadStatus';

const App: React.FC = () => {
  const gamepadConnected = useGamepadStatus();

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        backgroundColor: '#0a0a0a',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <StatusBar gamepadConnected={gamepadConnected} />
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: 40,
        }}
      >
        <Grid />
      </div>
    </div>
  );
};

export default App;
