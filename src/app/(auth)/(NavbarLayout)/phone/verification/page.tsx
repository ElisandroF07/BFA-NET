'use client'

import Link from 'next/link'
import Image from 'next/image'
import '@/styles/globals.css'
import '@/styles/phone_verification.css'
import business from '../../../../../../public/assets/images/message.svg'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import axios from 'axios'

import useUserStore from '@/contexts/stores/userStore'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const FormSchema = z.object({
  field1: z
    .string()
    .min(1, 'O campo não pode estar vazio!')
    .max(1, 'Apenas é aceite 1 dígito'),
  field2: z
    .string()
    .min(1, 'O campo não pode estar vazio!')
    .max(1, 'Apenas é aceite 1 dígito'),
  field3: z
    .string()
    .min(1, 'O campo não pode estar vazio!')
    .max(1, 'Apenas é aceite 1 dígito'),
  field4: z
    .string()
    .min(1, 'O campo não pode estar vazio!')
    .max(1, 'Apenas é aceite 1 dígito'),
  field5: z
    .string()
    .min(1, 'O campo não pode estar vazio!')
    .max(1, 'Apenas é aceite 1 dígito'),
  field6: z
    .string()
    .min(1, 'O campo não pode estar vazio!')
    .max(1, 'Apenas é aceite 1 dígito'),
})

type FormType = z.infer<typeof FormSchema>

export default function Register() {

  const [loading, setLoading] = useState(false)
  const useStore = useUserStore()
  const router = useRouter()
  let phone = ''
  if (typeof window !== 'undefined') {
    phone = localStorage.getItem("phone") ?? ''
  }

  const { handleSubmit, register } = useForm<FormType>({
    resolver: zodResolver(FormSchema),
  })


  function APICall(data: any): Promise<any> {
    setLoading(true)
    return new Promise(async (resolve, reject) => {
        try {
          const response = await axios.post("https://bfa-nodejs-api.onrender.com/verify-otp", data,{ headers: { 'Content-Type': 'application/json' } })
          if (response.status === 201) {
            resolve(response.data.message)
            router.push('/register/personal-data')
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

  async function submitForm(data: FormType) {
    console.log(data)
    const { field1, field2, field3, field4, field5, field6 } = data;
    const formatedData = field1 + field2 + field3 + field4 + field5 + field6;
    const body = JSON.stringify({phone: parseInt(phone ?? useStore.phone), otp_code: formatedData});
    toast.promise(APICall(body), {
      loading: 'Verificando...',
      success: (data) => {
        return data;
      },
      error: (data)=> {
        return data},
    });
      
  }

  function reSend(){
    
  }

  useEffect(() => {
    const phoneFragments = document.querySelectorAll(
      '.phone_fragment',
    ) as NodeListOf<HTMLInputElement>

    function focusNext() {
      const phone = document.querySelector(
        'input[data-checked="false"]',
      ) as HTMLInputElement
      if (phone) {
        phone.focus()
      }
    }

    phoneFragments.forEach((phone) => {
      phone.addEventListener('keyup', () => {
        if (phone.value) {
          phone.dataset.checked = 'true'
          focusNext()
        } else {
          phone.dataset.checked = 'false'
        }
      })
    })
  
  }, [])

  return (
    <div className='home_main'>
      <div className="home_body">
        <div className="left">
        <Image src={business} alt="business" />
        <h1>Verifique a sua caixa de mensagens</h1>
        <p>Enviamos um código de verificação para o seu número ({phone ?? useStore.phone}). </p>
        <Link href={'/register'}>Clique aqui para corrigir o número</Link>
        </div>
        <div className="right">
          <form onSubmit={handleSubmit(submitForm)} className="login_form">
            <div className="header_form">
              <h1>Verifique o seu número</h1>
              <p>Introduza o código enviado para o seu telemóvel. <Link href={'/'}>Quer sair?</Link></p>
            </div>
            <div className="body_form">
            <div className="fragments_container">
              <input
                type="text"
                data-checked="false"
                className="phone_fragment"
                maxLength={1}
                {...register('field1')}
              />
              <input
                type="text"
                data-checked="false"
                className="phone_fragment"
                maxLength={1}
                {...register('field2')}
              />
              <input
                type="text"
                data-checked="false"
                className="phone_fragment"
                maxLength={1}
                {...register('field3')}
              />
              <input
                type="text"
                data-checked="false"
                className="phone_fragment"
                maxLength={1}
                {...register('field4')}
              />
              <input
                type="text"
                data-checked="false"
                className="phone_fragment"
                maxLength={1}
                {...register('field5')}
              />
              <input
                type="text"
                data-checked="false"
                className="phone_fragment"
                maxLength={1}
                {...register('field6')}
              />
            </div>
              <button type="submit" disabled={loading} className="button_auth">
                Verificar
              </button>
              <div className='terms'><p>Não recebeu o código?</p> <button onClick={reSend}>Renviar</button></div>
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