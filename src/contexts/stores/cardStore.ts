import { create } from "zustand";

type State = {
  cardNumber: string;
  pin: string;
  createdAt: string;
  role: number;
  nickname: string;
  state: string
};

type Action = {
	setPin: (pin: State["pin"]) => void;
	setCardNumber: (cardNumber: State["cardNumber"]) => void;
	setRole: (role: State["role"]) => void;
	setCreatedAt: (createdAt: State["createdAt"]) => void;
  setNickname: (nickname: State["nickname"]) => void;
  setState: (state: State["state"]) => void;
};

const useCardStore = create<State & Action>((set) => ({
	cardNumber: "",
  pin: "",
  createdAt: "",
  role: 0,
  nickname: "",
  state: "",
	setPin: (pin) => set(() => ({ pin: pin })),
	setCardNumber: (cardNumber) => set(() => ({ cardNumber: cardNumber })),
	setRole: (role) => set(() => ({ role: role })),
	setCreatedAt: (createdAt) => set(() => ({ createdAt: createdAt })),
  setNickname: (nickname) => set(() => ({nickname: nickname})),
  setState: (state) => set(() => ({state: state}))
}));

export default useCardStore;
