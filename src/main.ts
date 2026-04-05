import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import { spawn, ChildProcess } from 'node:child_process';
import started from 'electron-squirrel-startup';

if (started) {
  app.quit();
}

const childProcesses = new Map<string, ChildProcess>();

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    frame: false,
    fullscreen: true,
    backgroundColor: '#000000',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
    );
  }
};

ipcMain.handle('hide-window', () => {
  BrowserWindow.getAllWindows()[0]?.hide();
});

ipcMain.handle('show-window', () => {
  BrowserWindow.getAllWindows()[0]?.show();
});

ipcMain.handle('launch-app', (_event, cmd: string) => {
  if (!cmd || typeof cmd !== 'string' || cmd.trim().length === 0) {
    throw new Error('Invalid command');
  }
  const child = spawn(cmd, { shell: true, detached: true, stdio: 'ignore' });
  child.unref();
  const id = child.pid !== undefined ? String(child.pid) : String(Date.now());
  childProcesses.set(id, child);
  child.on('exit', () => {
    childProcesses.delete(id);
  });
  return id;
});

ipcMain.handle('kill-app', (_event, id: string) => {
  if (!id || typeof id !== 'string') return;
  const child = childProcesses.get(id);
  if (child) {
    child.kill();
    childProcesses.delete(id);
  }
});

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
