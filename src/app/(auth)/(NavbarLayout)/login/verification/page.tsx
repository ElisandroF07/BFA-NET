'use client'

import Link from 'next/link'
import Image from 'next/image'
import '@/styles/globals.css'
import '@/styles/phone_verification.css'
import business from '../../../../../../public/assets/images/Two factor authentication-pana.svg'
import axios from 'axios'
import useUserStore from '@/contexts/stores/userStore'
import { toast } from 'sonner'
import { useState } from 'react'



export default function TwoFactorAuthentication() {

  const [loading, setLoading] = useState(false)
  const useStore = useUserStore()
  
  let membership_number = ''
  if (typeof window !== 'undefined') {
    membership_number = localStorage.getItem("membership_number") ?? ''
  }

  function APICall(): Promise<any> {
    setLoading(true)
    return new Promise(async (resolve, reject) => {
        try {
          const response = await axios.get(`http://localhost:5000/2fa/${membership_number || useStore.membership_number}`)
          if (response.status === 201) {
            resolve(response.data.message)
          }
        }
        catch(error: any){
          reject(error.response?.data.message)
        }
        finally{
          setLoading(false)
        }
    })
  }

  async function resendEmail() {
    toast.promise(APICall(), {
      loading: 'Reenviando email...',
      success: (data) => {
        return data;
      },
      error: (data)=> {
        return data},
    });
      
  }

  return (
    <div className='home_main'>
      <div className="home_body">
        <div className="left">
        <Image src={business} alt="business" />
        <h1>Autenticação de dois fatores</h1>
        <p>Enviamos um código de verificação para a sua caixa de entrada.</p>
        </div>
        <div className="right">
          <form className="login_form">
            <div className="header_form">
              <h1>Autenticação de dois fatores</h1>
              <p>Foi enviado um email para o seu endereço, acesse e verifique o seu email. <Link href={'/login'}>Voltar</Link></p>
            </div>
            <div className="body_form">
            
              <button type="button" onClick={resendEmail} disabled={loading} className="button_auth">
                Reenviar
              </button>
              <div className='terms'><p>Verifique o seu correio eletrônico.</p></div>
            </div>
          </form>
            <p className="basic_text not_found_footer">
              © 2024 Banco de Fomento Angola
          </p>
        </div>
      </div>
    </div>
  )
}
