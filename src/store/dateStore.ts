import { create } from 'zustand';
interface MyDateState {
  from: string;
  to: string;
  setFrom: (newValue: string) => void;
  setTo: (newValue: string) => void;
}
export const useDateStore = create<MyDateState>((set) => {
  return {
    from: new Date().toISOString(),
    to: new Date().toISOString(),
    setFrom: (newValue: string) => {
      set({ from: newValue });
    },
    setTo: (newValue: string) => {
      set({ to: newValue });
    },
  };
});