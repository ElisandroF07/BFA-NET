"use client"

import '@/styles/open-account.css'
import '@/styles/sign-in.css'
import Button_Next from "@/components/button_next"
import Link from "next/link"
import Button_Menu from '@/components/button_menu'
import Image from 'next/image'
import logo from '../../../../../public/assets/images/logo.png'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

const Step2Schema = z.object({
    phone: z.string().min(1, 'O número de telefone é obrigatório!').regex(/^9[0-9]{8}$/, 'Número de telefone inválido!').transform(phone => {
        return phone.trim().toUpperCase()
    })
})

type Step2Form = z.infer<typeof Step2Schema>

export default  function Step2() {

    const { register, formState: { errors }, handleSubmit } = useForm<Step2Form>({
        resolver: zodResolver(Step2Schema)
    })

    function submitForm(data: any) {
        console.log(data)
    }
    
    return (
        <form onSubmit={handleSubmit(submitForm)} className="step2">
			<div className="form_header">
				<Image className='children_logo' src={logo} alt='logo'/>
                    <h1 className="page_title">Criar conta</h1>
                    <Button_Menu/>
                
				<p className="basic_text">Bem vindo ao assistente de criação de contas. Para continuar, introduza o seu número de telefone.</p>
			</div>
            <div className='form_body'>
                <div className="input_field">
                   <label>Número de telefone</label>
                    <div id='phone' className='input_phone'>
                        <p >+244</p>
                        <input
                            {...register('phone')}
                            maxLength={9}
                            placeholder="Número de telefone "
                        />
                    </div>
                    {errors.phone && <span className='input_error'>{errors.phone.message}</span>}
                </div> 
            </div>
            <Link href="/auth/open-account/step3" className='link3'/>
            <div className="step1_footer">
                <Button_Next id='step2_next'/>
            </div>
		</form>
    )
}