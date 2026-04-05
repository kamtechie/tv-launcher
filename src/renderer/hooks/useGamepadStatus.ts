import { useState, useEffect } from 'react';

function isAnyGamepadConnected(): boolean {
  return Array.from(navigator.getGamepads()).some(g => g !== null);
}

function useGamepadStatus(): boolean {
  const [connected, setConnected] = useState<boolean>(isAnyGamepadConnected);

  useEffect(() => {
    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(isAnyGamepadConnected());

    window.addEventListener('gamepadconnected', onConnect);
    window.addEventListener('gamepaddisconnected', onDisconnect);

    // Sync on mount in case the browser already has a gamepad before events fire
    setConnected(isAnyGamepadConnected());

    return () => {
      window.removeEventListener('gamepadconnected', onConnect);
      window.removeEventListener('gamepaddisconnected', onDisconnect);
    };
  }, []);

  return connected;
}

export default useGamepadStatus;
