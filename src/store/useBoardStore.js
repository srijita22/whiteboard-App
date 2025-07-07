import { create } from "zustand";

export const useBoardStore = create((set) => ({
  tool: "draw",
  color: "#000000",
  strokeWidth: 3,
  setTool: (tool) => set({ tool }),
  setColor: (color) => set({ color }),
  setStrokeWidth: (w) => set({ strokeWidth: w }),
}));
