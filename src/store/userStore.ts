import { create } from 'zustand';
import { Cookies } from "react-cookie";
const cookies = new Cookies();  
const accessToken = cookies.get("accessToken");
import { jwtDecode } from 'jwt-decode';
import type { User } from '../interfaces/user';
interface MyStoreState {
  value: User;
  setValue: (newValue: User) => void;
}

export const useMyStore = create<MyStoreState>((set) => {
  const decoded:User = jwtDecode(accessToken);
  return {
    value: decoded,
    setValue: (newValue: User) => {
      set({ value: newValue });
      //Cookies.set('my-app-value', newValue, { expires: 7 }); // Update cookie when value changes
    },
  };
});