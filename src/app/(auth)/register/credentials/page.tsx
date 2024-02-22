"use client"

import '@/styles/credentials.css'
import picture from '../../../../../public/assets/images/Certification-bro.svg'
import Image from 'next/image'
import {useRouter} from 'next/navigation'
import useStepsStore from '@/contexts/stores/stepsStore'
import { useEffect } from 'react'


export default function PersonalData(){

  const router = useRouter()
  const stepsStore = useStepsStore()

  useEffect(()=>{
    stepsStore.setCurrent(3)
    stepsStore.setStep1(true)
    stepsStore.setStep2(true)
    stepsStore.setStep3(true)
  }, [])

  function submitForm(){
    router.replace('/')
  }

    return (
        <form className="login_form">
            <div className="header_form">
              <h1>Credenciais</h1>
              <p>Obrigado por aguardar, estamos finalizando o processo.</p>
            </div>
            <div className="body_form">
              <div className="container_body">
                <Image src={picture} alt="" />
                <h1>As suas informações estão sendo verificadas</h1>
                <p>Brevemente enviaremos para o seu telemóvel verificado as suas credenciais de acesso ao BFA NET. Posteriormente poderá alterá-las.</p>
              </div>
              <button type="button" onClick={submitForm} className="button_auth">
                Finalizar
              </button>
            </div>
          </form>
    )
}