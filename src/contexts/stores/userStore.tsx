import {create}  from 'zustand'

type State = {
  phone: string,
  bi_number: string,
  validation: boolean,
}
  
type Action = {
  updatePhone: (phone: State['phone']) => void,
  updateBi: (bi_number: State['bi_number']) => void,
  updateValidation: (validation: State['validation']) => void
}

const useUserStore = create<State & Action>((set) => ({
  phone: '',
  bi_number: '',
  validation: false,
  updatePhone: (phone) => set(() => ({ phone: phone })),
  updateBi: (bi_number) => set(() => ({ bi_number: bi_number })),
  updateValidation: (validation) => set(() => ({ validation: validation })),
}))


export default useUserStore