import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('launcher', {
  hide: (): Promise<void> => ipcRenderer.invoke('hide-window'),
  show: (): Promise<void> => ipcRenderer.invoke('show-window'),
  launch: (cmd: string): Promise<string> => ipcRenderer.invoke('launch-app', cmd),
  kill: (id: string): Promise<void> => ipcRenderer.invoke('kill-app', id),
});
