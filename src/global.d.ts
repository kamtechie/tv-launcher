export {};

declare module '*.css' {
  const content: Record<string, string>;
  export default content;
}

declare global {
  interface Window {
    launcher: {
      hide: () => Promise<void>;
      show: () => Promise<void>;
      launch: (cmd: string) => Promise<string>;
      kill: (id: string) => Promise<void>;
    };
  }
}
