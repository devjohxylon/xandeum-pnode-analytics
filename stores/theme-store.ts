// Optional: Zustand store for theme if needed
// Currently using React Context, but this can be used for more complex state

import { create } from "zustand";

interface ThemeState {
  theme: "dark" | "light";
  setTheme: (theme: "dark" | "light") => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: "dark",
  setTheme: (theme) => set({ theme }),
}));

