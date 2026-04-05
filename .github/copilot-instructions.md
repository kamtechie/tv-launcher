# tv-launcher — Copilot Instructions

Electron Forge + Vite + TypeScript + React fullscreen TV launcher app. Target platform is a TV / living-room device.

## Stack

- **Electron** main process: `src/main.ts`
- **Preload** (contextBridge bridge): `src/preload.ts`
- **Renderer** entry: `src/renderer.ts` — mounts React via `createRoot`
- **React** tree: `src/renderer/App.tsx` → `components/` + `hooks/`
- **Build**: Electron Forge with `@electron-forge/plugin-vite`; three separate Vite configs (`vite.main.config.ts`, `vite.preload.config.ts`, `vite.renderer.config.ts`)
- **Font**: Inter via `@fontsource/inter`, imported in `src/index.css`
- **TypeScript**: 4.x, `jsx: react-jsx`, `skipLibCheck: true`

## Architecture Rules

- **No `nodeIntegration`**. All Node/Electron access must go through `contextBridge`. The exposed API lives in `src/preload.ts` as `window.launcher` (typed in `src/global.d.ts`).
- IPC channels: `hide-window`, `show-window`, `launch-app` (returns PID string), `kill-app` (accepts PID string). Handlers live in `src/main.ts` and validate all inputs.
- Child processes are tracked in `childProcesses: Map<string, ChildProcess>` in `src/main.ts`. They are spawned detached + unreffed, deleted from the map on `exit`.
- `window.launcher` is fully typed — do not use `any` to access it.

## Renderer Conventions

- Functional components + hooks only. No class components.
- All layout sizes use `vmin` units so the UI auto-scales with DPI/resolution. Do not use fixed `px` for tile dimensions, icon sizes, or spacing inside tiles.
- Focus state is tracked as an index in `Grid.tsx`. Tile highlight = `scale(1.1)` + `#00aaff` border. Running indicator = small `#00ff88` dot top-right.
- Mouse hover moves focus (same as gamepad). Click launches (same as gamepad confirm).
- `useGamepad.ts` uses a `requestAnimationFrame` polling loop (not just the `gamepadconnected` event) with per-button debounce via a `Set`. Callbacks are stored in a `useRef` to avoid stale closures.
- `useGamepadStatus.ts` detects connection via `gamepadconnected`/`gamepaddisconnected` events + an initial `navigator.getGamepads()` poll.

## Tiles

Tile definitions live as a `TILES` constant array in `src/renderer/components/Grid.tsx`. Each entry is `{ name, icon, command }`. Empty `command` = placeholder tile (no launch action). To add a new app, append to that array.

## Styling

- Global reset + font in `src/index.css` (imported by `src/renderer.ts`).
- No CSS modules or CSS-in-JS libraries — inline `style` objects only.
- Background: `#0a0a0a` app shell, `#1e1e1e` tiles, `#111111` status bar.
- `index.html` contains a minimal reset (`margin:0`, `overflow:hidden`) so no double-reset is needed in JS.

## Build & Run

```bash
npm start          # dev (Electron Forge)
npm run make       # package + create distributable
```

## Key File Map

| File | Purpose |
|------|---------|
| `src/main.ts` | BrowserWindow creation, IPC handlers, child process management |
| `src/preload.ts` | contextBridge — exposes `window.launcher` |
| `src/global.d.ts` | `Window` type extension + `*.css` module declaration |
| `src/vite-env.d.ts` | Vite client type reference (enables CSS side-effect imports) |
| `src/renderer/App.tsx` | Root component — layout shell + StatusBar |
| `src/renderer/components/Grid.tsx` | Focus management, tile grid, gamepad wiring |
| `src/renderer/components/Tile.tsx` | Individual tile — focused/running visual states |
| `src/renderer/components/StatusBar.tsx` | Gamepad connection indicator |
| `src/renderer/hooks/useGamepad.ts` | rAF gamepad polling, directional + action callbacks |
| `src/renderer/hooks/useGamepadStatus.ts` | Live boolean — is any gamepad connected |
