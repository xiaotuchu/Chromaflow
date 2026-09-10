/// <reference types="vite/client" />

declare module "colorthief/dist/color-thief.mjs" {
  export default class ColorThief {
    getPalette(image: HTMLImageElement, colorCount?: number, quality?: number): number[][];
  }
}

declare module "*.md?raw" {
  const content: string;
  export default content;
}
