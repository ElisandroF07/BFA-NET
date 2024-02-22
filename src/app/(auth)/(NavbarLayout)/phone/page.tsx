'use client'

import Link from 'next/link'
import Image from 'next/image'
import '@/styles/globals.css'
import '@/styles/phone.css'
import business from '../../../../../public/assets/images/wellcome.svg'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import InfoError from '@/components/others/infoError'
import useUserStore from '@/contexts/stores/userStore'
import { toast } from 'sonner'
import RegisterInfoModal from '@/components/modals/registerInfo'
import { useDisclosure } from '@nextui-org/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const FormSchema = z.object({
  phone: z
    .string()
    .min(1, 'O número de telefone é obrigatório!')
    .regex(/^9[0-9]{8}$/, 'Número de telefone inválido!')
    .transform((phone) => {
      return phone.trim().toUpperCase()
    }),
})

type FormType = z.infer<typeof FormSchema>

export default function Phone() {

  const router = useRouter()
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const useStore = useUserStore()
  const [loading, setLoading] = useState(false)

  const {register, formState: { errors }, handleSubmit} = useForm<FormType>({
    resolver: zodResolver(FormSchema),
  })

  function APICall(data: any): Promise<any> {
    setLoading(true)
    return new Promise(async (resolve, reject) => {
      try {
        const response = await axios.post("http://localhost:5000/verify-phone",data,{headers: {'Content-Type': 'application/json'}})
        if (response.status === 201) {
          const {phone} = data
          useStore.updatePhone(phone)
          resolve(response.data.message)
          router.push('/phone/verification')
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
        return data;
      },
      error: (data)=> {
        return data},
      });
  }

  useEffect(()=>(
    onOpen()
  ), [])

  return (
    <div className='home_main'>
      <div className="home_body">
        <div className="left">
        <Image src={business} alt="business" />
        <h1>Seja bem-vindo à família</h1>
        <p>Crie uma conta e junte-se à essa maravilhosa comunidade.</p>
        </div>
        <div className="right">
          <form onSubmit={handleSubmit(submitForm)} className="login_form">
            <div className="header_form">
              <h1>Crie uma conta</h1>
              <p>Já tem uma conta? <Link href={'/login'}>Fazer login</Link></p>
            </div>
            <div className="body_form">
              <div className="input_field">
              <label htmlFor="phone">Número de telefone</label>
                <div id="phone" className="input_phone">
                  <p>+244</p>
                  <input
                    {...register('phone')}
                    maxLength={9}
                    type='text'
                    placeholder="Número de telefone "/>
                </div>
                {errors.phone && (
                  <InfoError message={errors.phone.message} />
                )}
              </div>
              <button type="submit" disabled={loading} className="button_auth">
                Enviar código
              </button>
              <div className='terms'><p>Ao criar uma conta, você estará confirmando que leu e aceitou as nossas <Link href="/privacy-policies">Políticas de Privacidade e Termos de Uso</Link>.</p></div>
            </div>
          </form>
            <p className="basic_text not_found_footer">
              © 2024 Banco de Fomento Angola
          </p>
        </div>
      </div>
      <RegisterInfoModal isOpen={isOpen} onOpenChange={onOpenChange}/>
    </div>
  )
}
