import { create } from "zustand";

type State = {
  iban: string,
  nbi: string,
  role: number,
  number: string,
  authorized_balance: number,
  bic: string,
  available_balance: number,
  up_balance: number,
  created_at: string,
  currency: string,
  state: string,
};

type Actions = {
  updateIban: (iban: string) => void;
  updateNbi: (nbi: string) => void;
  updateRole: (role: number) => void;
  updateNumber: (number: string) => void;
  updateBic: (bic: string) => void;
  updateCreatedAt: (created_at: string) => void;
  updateCurrency: (currency: string) => void;
  updateAuthorizedBalance: (authorized_balance: number) => void;
  updateState: (state: string) => void;
  updateAvailableBalance: (available_balance: number) => void;
  updateUpBalance: (up_balance: number) => void;
};


const useAccountStore = create<State & Actions>((set) => ({
  iban: "",
  nbi: "",
  role: 0,
  number: "",
  authorized_balance: 0,
  bic: "",
  available_balance: 0,
  created_at: "",
  currency: "",
  state: "",
  up_balance: 0,
  updateIban: (iban) => set(() => ({ iban: iban })),
  updateNbi: (nbi) => set(() => ({ nbi: nbi })),
  updateRole: (role) => set(() => ({ role: role })),
  updateNumber: (number) => set(() => ({ number: number })),
  updateAuthorizedBalance: (authorized_balance) => set(() => ({ authorized_balance: authorized_balance })),
  updateBic: (bic) => set(() => ({ bic: bic })),
  updateAvailableBalance: (available_balance) => set(() => ({ available_balance: available_balance })),
  updateUpBalance: (up_balance) => set(() => ({ up_balance: up_balance })),
  updateCreatedAt: (created_at) => set(() => ({ created_at: created_at })),
  updateCurrency: (currency) => set(() => ({ currency: currency })),
  updateState: (state) => set(() => ({ state: state })),
}));

export default useAccountStore;
