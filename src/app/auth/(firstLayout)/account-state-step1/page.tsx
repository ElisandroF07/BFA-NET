"use client"

import '@/styles/sign-in.css'
import Link from 'next/link';
import Button_Auth from '@/components/button_auth';
import Button_Menu from '@/components/button_menu';
import Image from 'next/image';
import logo from '../../../../../public/assets/images/logo.png'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'

const AccountStateSTP1Schema = z.object({
    phone: z.string().min(1, 'O número de telefone é obrigatório!').regex(/^9[0-9]{8}$/, 'Número de telefone inválido!').transform(phone => {
        return phone.trim().toUpperCase()
    })
})

type AccountStateSTP1 = z.infer<typeof AccountStateSTP1Schema>

export default function AccountState_Step1() { 
    
    const { register, formState: { errors }, handleSubmit } = useForm<AccountStateSTP1>({
        resolver: zodResolver(AccountStateSTP1Schema)
    })

    function submitForm(data: any) {
        console.log(data)
    }

	return (
		<form onSubmit={handleSubmit(submitForm)} className="signIn_form"> {/* Formulário de login */}
            <div className="form_header"> {/* Cabeçalho do formulário */}
                <Image className='children_logo' src={logo} alt='logo'/>
				<h1 className="page_title">Estado da conta</h1>
				<Button_Menu/>
				<p className="basic_text">Introduza as informações abaixo</p>
			</div>
            <div className='form_body'> {/* Corpo do formulário */}
                <div className="input_field">
                   <label htmlFor="phone">Número de telefone</label>
                    <div className='input_phone'>
                        <p >+244</p>
                        <input
                            {...register('phone')}
                            maxLength={9}
                            placeholder="Número de telefone "
                        />
                    </div>
                    {errors.phone && <span className='input_error'>{errors.phone.message}</span>}
                </div> 
                
                
                <Button_Auth content='Verificar'/>
            </div>
            <div className="form_footer"> {/* Rodapé do formulário */}
                <p className='basic_text'>Ainda não tem uma conta? <Link href='/auth/step1'>Criar conta</Link></p>
            </div>
		</form>
	);
}
