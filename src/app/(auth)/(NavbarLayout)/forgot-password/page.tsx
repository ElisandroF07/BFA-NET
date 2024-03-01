'use client'

import Link from 'next/link'
import Image from 'next/image'
import '@/styles/globals.css'
import '@/styles/phone.css'
import business from '../../../../../public/assets/images/Forgot password-pana.svg'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import InfoError from '@/components/others/infoError'
import useUserStore from '@/contexts/stores/userStore'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const FormSchema = z.object({
  email: z
    .string()
    .min(1, 'O email é obrigatório!')
    .email('Email inválido! Corrija o email')
    .transform((email) => {
      return email.trim().toLowerCase()
    }),
})

type FormType = z.infer<typeof FormSchema>

export default function ForgotPassword() {

  const router = useRouter()
  const useStore = useUserStore()
  const [loading, setLoading] = useState(false)

  const {register, formState: { errors }, handleSubmit} = useForm<FormType>({
    resolver: zodResolver(FormSchema),
  })

  function APICall(data: FormType): Promise<any> {
    setLoading(true)
    let {email} = data
    return new Promise(async (resolve, reject) => {
      try {
        const response = await axios.get(`http://localhost:5000/resetPassword/${email}`)
        if (response.status === 201) {
          useStore.updateEmail(email)
          if (typeof window !== 'undefined') {
            localStorage.setItem("email", email)
          }
          resolve(response.data.message)
        }
        else {
          reject(response.data.message)
        }
      } 
      catch (error: any) {
        reject(error.response?.data.message)
      }
      finally{
        setLoading(false)
      }
    })
  }

  async function submitForm(data: FormType) {
    toast.promise(APICall(data), {
      loading: 'Enviando...',
      success: (data) => {
        router.push('/forgot-password/verification')
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
        <h1>Esqueceu o seu código de acesso?</h1>
        <p>Não faça pranto! Recupere em simples passos.</p>
        </div>
        <div className="right">
          <form onSubmit={handleSubmit(submitForm)} className="login_form">
            <div className="header_form">
              <h1>Recuperação</h1>
              <p>Já lembrou o seu código de acesso? <Link href={'/login'}>Fazer login</Link></p>
            </div>
            <div className="body_form">
            <div className="input_field">
              <label htmlFor="email">Endereço de email</label>
              <input
                type="text"
                placeholder="Insira o seu endereço de email "
                {...register("email")}
              />
              {errors.email && (
                  <InfoError message={errors.email.message} />
                )}
              </div>
              <button type="submit" disabled={loading} className="button_auth">
                Verificar email
              </button>
              <div className='terms'><p>Ao utilizar a plataforma, você estará confirmando que leu e aceitou as nossas <Link href="/privacy-policies">Políticas de Privacidade e Termos de Uso</Link>.</p></div>
            </div>
          </form>
            <p className="basic_text            not_found_footer">
              © 2024 Banco de Fomento Angola
          </p>
        </div>
      </div>
    </div>
  )
}
