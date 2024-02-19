'use client'

import Link from 'next/link'
import Image from 'next/image'
import '@/styles/globals.css'
import '@/styles/login.css'
import business from '../../../../../public/assets/images/Secure login-pana.png'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import InfoError from '@/components/others/infoError'

const loginSchema = z.object({
  membershipNumber: z
    .string({
      required_error: 'O campo não pode estar vazio!',
    })
    .min(1, 'O número de adesão é obrigatório!')
    .regex(/^[0-9]{8}$/, 'Número de adesão inválido!')
    .transform((information) => {
      return information.trim().toUpperCase()
    }),
  accessCode: z
    .string({
      required_error: 'O código de acesso é obrigatório!',
    })
    .min(1, 'O código de acesso é obrigatório!')
    .transform((information) => {
      return information.trim().toUpperCase()
    }),
})

type LoginType = z.infer<typeof loginSchema>

export default function Login() {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginType>({
    resolver: zodResolver(loginSchema),
  })

  async function createUser(data: unknown) {
    console.log(data)
  }

  return (
    <div className='home_main'>
      <div className="home_body">
        <div className="left">
        <Image src={business} alt="business" />
        <h1>Tenha acesso às suas finanças</h1>
        <p>Introduza as sua credenciais para ter acesso ao BFA NET.</p>
        </div>
        <div className="right">
          <form onSubmit={handleSubmit(createUser)} className="login_form">
            <div className="header_form">
              <h1>Faça login na sua conta</h1>
              <p>Ainda não tem uma conta? <Link href={'/register'}>Criar conta</Link></p>
            </div>
            <div className="body_form">
              <div className="input_field">
              <label htmlFor="membershipNumber">Número de adesão</label>
                <input
                  placeholder="Nome ou número de adesão"
                  {...register('membershipNumber')}
                />
                {errors.membershipNumber && (
                  <InfoError message={errors.membershipNumber.message} />
                )}
              </div>
              <div className="input_field">
              <label htmlFor="membershipNumber">Código de acesso</label>
                <input
                  type="password"
                  placeholder="Insira o seu código de acesso "
                  {...register('accessCode')}
                />
                {errors.accessCode && (
                  <InfoError message={errors.accessCode.message} />
                )}
              </div>
              <button type="submit" className="button_auth">
                Entrar
              </button>
              <div className='terms'><p>Esta plataforma é protegida pelo Google ReCaptcha e as <Link href="/forgot-password">Políticas de Privacidade</Link> são aplicáveis.</p></div>
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
