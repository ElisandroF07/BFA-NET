import { create } from "zustand";

interface IAddress {
  country: string,
  full_address: string
}

interface IPersonalData {
  name: [string],
  birthDate: string,
  gender: string
}

type State = {
	personalData: IPersonalData,
	email: string;
	biNumber: string;
	pictureProfile: string,
	address: IAddress
};

type Action = {
	setEmail: (email: State["email"]) => void;
	setBiNumber: (biNumber: State["biNumber"]) => void;
	setPictureProfile: (pictureProfile: State["pictureProfile"]) => void;
	setPersonalData: (personalData: State["personalData"]) => void;
  	setAddress: (address: State["address"]) => void
};

const useClientStore = create<State & Action>((set) => ({
	personalData: {birthDate: "", name: [""], gender: ""},
	biNumber: "",
	email: "",
	pictureProfile: "",
  	address: {country: "", full_address: ""},
	setEmail: (email) => set(() => ({ email: email })),
	setBiNumber: (biNumber) => set(() => ({ biNumber: biNumber })),
	setPictureProfile: (pictureProfile) => set(() => ({ pictureProfile: pictureProfile })),
	setPersonalData: (personalData) =>
		set(() => ({ personalData: personalData })),
  setAddress: (address) => set(() => ({address: address}))
}));

export default useClientStore;
