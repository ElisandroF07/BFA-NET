import {create}  from 'zustand'

type State = {
  step1: boolean,
  step2: boolean,
  step3: boolean,
  step4: boolean,
  current: number,
}
  
type Action = {
  setStep1: (step1: State['step1']) => void,
  setStep2: (step2: State['step2']) => void,
  setStep3: (step3: State['step3']) => void,
  setStep4: (step4: State['step4']) => void,
  setCurrent: (current: State['current']) => void,
}

const useStepsStore = create<State & Action>((set) => ({
  step1: false,
  step2: false,
  step3: false,
  step4: false,
  current: 0,

  setStep1: (step1) => set(() => ({ step1: step1 })),
  setStep2: (step2) => set(() => ({ step2: step2 })),
  setStep3: (step3) => set(() => ({ step3: step3 })),
  setStep4: (step4) => set(() => ({ step4: step4 })),
  setCurrent: (current) => set(() => ({ current: current }))
}))


export default useStepsStore