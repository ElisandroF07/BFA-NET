"use client"

import '@/styles/sign-in.css'
import Link from 'next/link';
import Button_Auth from '@/components/button_auth';
import Button_Menu from '@/components/button_menu';
import Image from 'next/image'
import logo from '../../../../../public/assets/images/logo.png'
import { useForm } from 'react-hook-form';
import { TypeOf, z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod';

const recoverySchema = z.object({
    membershipNumber: z.string({
        required_error: 'O campo não pode estar vazio!',
    }).min(1, 'O número de adesão é obrigatório!').regex(/^[0-9]{8}$/, 'Número de adesão inválido!').transform(information => {return information.trim().toUpperCase()}),
    identityCardNumber: z.string({
        required_error: 'O campo não pode estar vazio!',
    }).min(1, 'O número do BI é obrigatório!').regex(/^[0-9]{8}[A-Z|a-z]{2}[0-9]{3}$/, 'Número do BI inválido!').transform(information => {return information.trim().toUpperCase()})
})

type RecoveryForm = z.infer<typeof recoverySchema>

export default function Recovery_Step1() { 

    const { register, handleSubmit, formState:{errors} } = useForm<RecoveryForm>({
        resolver: zodResolver(recoverySchema),
    })

    function recoveryUser(data: any) {
        console.log(data)
    }

	return (
		<form onSubmit={handleSubmit(recoveryUser)} className="signIn_form">
            <div className="form_header">
                <Image className='children_logo' src={logo} alt='logo'/>
				<h1 className="page_title">Recuperação</h1>
				<Button_Menu/>
				<p className="basic_text">Introduza as informações abaixo</p>
			</div>
            <div className='form_body'>
                <div className="input_field">
                    <label htmlFor="membershipNumber">Nmero de adesão</label>
                    <input
                        placeholder="Insira o número de adesão"
                        {...register('membershipNumber')}
                    />
                    {errors.membershipNumber && <span className='input_error'>{errors.membershipNumber.message}</span>}
                </div>
                <div className="input_field">
                   <label htmlFor="identityCardNumber">Número do BI</label>
                    <input
                        placeholder="Insira o número do seu BI "
                        {...register('identityCardNumber')}
                    />
                    {errors.identityCardNumber && <span className='input_error'>{errors.identityCardNumber.message}</span>}
                </div> 
                <Button_Auth content='Recuperar'/>
            </div>
            <div className="form_footer">
                <p className='basic_text'>Já recuperou as suas credenciais? <Link href='/auth/sign-in'>Entrar</Link></p>
            </div>
		</form>
	);
}
