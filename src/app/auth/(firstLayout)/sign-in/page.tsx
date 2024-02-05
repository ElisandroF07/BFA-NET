"use client"

import '@/styles/sign-in.css'
import Link from 'next/link';
import Button_Auth from '@/components/button_auth';
import Button_Menu from '@/components/button_menu';
import Image from 'next/image';
import logo from '../../../../../public/assets/images/logo.png'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

const loginSchema = z.object({
    membershipNumber: z.string({
        required_error: 'O campo não pode estar vazio!',
    }).min(1, 'O número de adesão é obrigatório!').regex(/^[0-9]{8}$/, 'Número de adesão inválido!').transform(information => {return information.trim().toUpperCase()}),
    accessCode: z.string({
        required_error: 'O código de acesso é obrigatório!',
    }).min(1, 'O código de acesso é obrigatório!').transform(information => {return information.trim().toUpperCase()})
})

type LoginType = z.infer<typeof loginSchema>;

export default function SignIn() {

    const { register, handleSubmit, formState: {
        errors
    } } = useForm<LoginType>({
        resolver: zodResolver(loginSchema),
    })

    function createUser(data: any) {
        console.log(data)
    }

	return (
		<form onSubmit={handleSubmit(createUser)} className="signIn_form">
            <div className="form_header">
                <Image className='children_logo' src={logo} alt='logo'/>
				<h1 className="page_title">Entre na sua conta</h1>
				<Button_Menu/>
				<p className="basic_text">Introduza as suas credênciais</p>
			</div>
            <div className='form_body'>
                <div className="input_field">
                    <label htmlFor="membershipInformation">Nome ou número de adesão</label>
                    <input
                        placeholder="Nome ou número de adesão"
                        {...register('membershipNumber')}
                    />
                    {errors.membershipNumber && <span className='input_error'>{errors.membershipNumber.message}</span>}
                </div>
                <div className="input_field">
                   <label htmlFor="accessCode">Código de acesso</label>
                    <input
                        type='number'
                        placeholder="Insira o seu código de acesso "
                        {...register('accessCode')}
                    />
                    {errors.accessCode && <span className='input_error'>{errors.accessCode.message}</span>}
                </div> 
                <Button_Auth content='Entrar'/>
            </div>
            <div className="form_footer">
                <p className='basic_text'>Ainda não tem uma conta? <Link href='/auth/step1'>Criar conta</Link></p>
            </div>
		</form>
	);
}
