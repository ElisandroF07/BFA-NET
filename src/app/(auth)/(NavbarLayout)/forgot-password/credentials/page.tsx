'use client'

import Link from 'next/link'
import Image from 'next/image'
import '@/styles/globals.css'
import '@/styles/phone.css'
import business from '../../../../../../public/assets/images/Upvote-pana.svg'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import InfoError from '@/components/others/infoError'
import useUserStore from '@/contexts/stores/userStore'
import { toast } from 'sonner'

const FormSchema = z.object({
  accessCode: z
  .string({
    required_error: 'O código de acesso é obrigatório!',
  })
  .min(1, 'O código de acesso é obrigatório!')
  .regex(/^[0-9]{6}$/, 'O código de acesso deve ter 6 digitos!')
  .transform((information) => {
    return information.trim().toUpperCase()
  }),
  confirmAcessCode: z
  .string({
    required_error: 'O código de acesso é obrigatório!',
  })
  .min(1, 'O código de acesso é obrigatório!')
  .regex(/^[0-9]{6}$/, 'O código de acesso deve ter 6 digitos!')
  .transform((information) => {
    return information.trim().toUpperCase()
  }),
})

type FormType = z.infer<typeof FormSchema>

export default function ForgotPassword() {

  const useStore = useUserStore()

  const {register, formState: { errors }, handleSubmit} = useForm<FormType>({
    resolver: zodResolver(FormSchema),
  })

  function APICall(data: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await axios.post("https://bfa-nodejs-api.onrender.com/verify-phone",data,{headers: {'Content-Type': 'application/json'}})
        if (response.status === 201) {
          const {phone} = data
          useStore.updatePhone(phone)
          resolve(response.data.message)
        }
      } 
      catch (error: any) {
        reject(error.response?.data.message)
      }
      finally{
      }
    })
  }

  async function submitForm(data: FormType) {
    const verificationContainer = document.querySelector('.verification_container') as HTMLDivElement
    toast.promise(APICall(data), {
      loading: 'Enviando...',
      success: (data) => {
        verificationContainer.style.display = 'flex'
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
        <h1>Defina um novo código de acesso</h1>
        <p>O código de acesso de ve ser constituido por uma combinação de 6 digitos.</p>
        </div>
        <div className="right">
          <form onSubmit={handleSubmit(submitForm)} className="login_form">
            <div className="header_form">
              <h1>Recuperação</h1>
              <p>Crie e confirme o seu novo código de acesso</p>
            </div>
            <div className="body_form">
            <div className="input_field">
              <label htmlFor="membershipNumber">Novo código de acesso</label>
                <input
                  type="password"
                  placeholder="Insira o seu novo código de acesso "
                  {...register('accessCode')}
                />
                {errors.accessCode && (
                  <InfoError message={errors.accessCode.message} />
                )}
              </div>
              <div className="input_field">
              <label htmlFor="membershipNumber">Confirme o novo código de acesso</label>
                <input
                  type="password"
                  placeholder="Insira novamente o seu novo código de acesso "
                  {...register('confirmAcessCode')}
                />
                {errors.confirmAcessCode && (
                  <InfoError message={errors.confirmAcessCode.message} />
                )}
              </div>
              <button type="submit" className="button_auth">
                Validar
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