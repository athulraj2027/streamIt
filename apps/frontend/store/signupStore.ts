import { create } from "zustand";

interface SignupData {
  username: string;
  email: string;
  password: string;
  setSignupData: (data: Partial<SignupData>) => void;
  clearSignupData: () => void;
}

export const useSignupStore = create<SignupData>((set) => ({
  username: "",
  email: "",
  password: "",
  setSignupData: (data) => set((state) => ({ ...state, ...data })),
  clearSignupData: () => set({ username: "", email: "", password: "" }),
}));
