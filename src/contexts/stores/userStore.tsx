import {create}  from 'zustand'

type State = {
  email: string,
  bi_number: string,
  validation: boolean,
}
  
type Action = {
  updateEmail: (email: State['email']) => void,
  updateBi: (bi_number: State['bi_number']) => void,
  updateValidation: (validation: State['validation']) => void
}

const useUserStore = create<State & Action>((set) => ({
  email: '',
  bi_number: '',
  validation: false,
  updateEmail: (email) => set(() => ({ email: email })),
  updateBi: (bi_number) => set(() => ({ bi_number: bi_number })),
  updateValidation: (validation) => set(() => ({ validation: validation })),
}))


export default useUserStore