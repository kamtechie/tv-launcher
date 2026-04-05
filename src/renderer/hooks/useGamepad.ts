import { useEffect, useRef } from 'react';

export interface GamepadCallbacks {
  onUp: () => void;
  onDown: () => void;
  onLeft: () => void;
  onRight: () => void;
  onConfirm: () => void;
  onBack: () => void;
  onHome: () => void;
}

const STICK_THRESHOLD = 0.5;

type StickDirection = 'up' | 'down' | 'left' | 'right' | null;

const BUTTON_MAP: [number, keyof GamepadCallbacks][] = [
  [12, 'onUp'],
  [13, 'onDown'],
  [14, 'onLeft'],
  [15, 'onRight'],
  [0, 'onConfirm'],
  [1, 'onBack'],
  [8, 'onHome'],
  [9, 'onHome'],
];

function getStickDirection(axes: readonly number[]): StickDirection {
  const x = axes[0] ?? 0;
  const y = axes[1] ?? 0;
  if (Math.abs(y) > Math.abs(x)) {
    if (y < -STICK_THRESHOLD) return 'up';
    if (y > STICK_THRESHOLD) return 'down';
  } else {
    if (x < -STICK_THRESHOLD) return 'left';
    if (x > STICK_THRESHOLD) return 'right';
  }
  return null;
}

const STICK_DIR_TO_CALLBACK: Record<NonNullable<StickDirection>, keyof GamepadCallbacks> = {
  up: 'onUp',
  down: 'onDown',
  left: 'onLeft',
  right: 'onRight',
};

function useGamepad(callbacks: GamepadCallbacks): void {
  const callbacksRef = useRef<GamepadCallbacks>(callbacks);
  callbacksRef.current = callbacks;

  useEffect(() => {
    let rafId: number;
    const pressedButtons = new Set<number>();
    let prevStickDir: StickDirection = null;

    const poll = () => {
      const gamepads = navigator.getGamepads();
      const gamepad = Array.from(gamepads).find(g => g !== null) ?? null;

      if (gamepad) {
        for (const [btnIndex, callbackKey] of BUTTON_MAP) {
          const btn = gamepad.buttons[btnIndex];
          if (btn?.pressed) {
            if (!pressedButtons.has(btnIndex)) {
              pressedButtons.add(btnIndex);
              callbacksRef.current[callbackKey]();
            }
          } else {
            pressedButtons.delete(btnIndex);
          }
        }

        const stickDir = getStickDirection(gamepad.axes);
        if (stickDir !== prevStickDir) {
          prevStickDir = stickDir;
          if (stickDir !== null) {
            callbacksRef.current[STICK_DIR_TO_CALLBACK[stickDir]]();
          }
        }
      }

      rafId = requestAnimationFrame(poll);
    };

    rafId = requestAnimationFrame(poll);
    return () => cancelAnimationFrame(rafId);
  }, []);
}

export default useGamepad;
