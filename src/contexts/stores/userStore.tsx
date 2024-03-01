import {create}  from 'zustand'

type State = {
  email: string,
  bi_number: string,
  validation: boolean,
  membership_number: string
}
  
type Action = {
  updateEmail: (email: State['email']) => void,
  updateBi: (bi_number: State['bi_number']) => void,
  updateValidation: (validation: State['validation']) => void,
  updateMembershipNumber: (membership_number: State['membership_number']) => void
}

const useUserStore = create<State & Action>((set) => ({
  email: '',
  bi_number: '',
  validation: false,
  membership_number: '',
  updateEmail: (email) => set(() => ({ email: email })),
  updateBi: (bi_number) => set(() => ({ bi_number: bi_number })),
  updateValidation: (validation) => set(() => ({ validation: validation })),
  updateMembershipNumber: (membership_number) => set(()=> ({ membership_number: membership_number})),
}))


export default useUserStore