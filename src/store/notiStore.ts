import { create } from 'zustand';
interface MyStoreState {
  value: number;
  setValue: (newValue: number) => void;
}
export const useNotiStore = create<MyStoreState>((set) => {
  return {
    value: 0,
    setValue: (newValue: number) => {
      set({ value: newValue });
    },
  };
});