"use client"

import '@/styles/open-account.css'
import Button_Next from "@/components/button_next"
import Button_Back from "@/components/button_back"
import Link from "next/link"
import Image from 'next/image'
import logo from '../../../../../public/assets/images/logo.png'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

const step1Schema = z.object({
    terms: z.literal(true, {
        errorMap: () => ({ message: 'Aceite os termos para continuar' }),
    })
})

type Step1Form = z.infer<typeof step1Schema>

export default function Step1() {

    const { register, formState: { errors }, handleSubmit } = useForm<Step1Form>({
        resolver: zodResolver(step1Schema)
    })

    function submitForm(data: any) {
        console.log(data)
    }

    return (
        <form onSubmit={handleSubmit(submitForm)} className="section_step1">
            <div className="step1_header">
                <Image className='children_logo' src={logo} alt='logo'/>
                <h1 className="page_title">Antes de continuar</h1>
                <Button_Back/>
            </div>
            <div className="step1_body">
                <p className="basic_text">Antes de abrir uma conta bancária online no BFA Net, certifique-se de ter em mãos os documentos necessários, como identificação pessoal e comprovante de atvidades. Recomenda-se verificar a lista específica de documentos exigidos pelo banco. Além disso, é crucial revisar e concordar com os termos e políticas do BFA Net, garantindo uma compreensão completa dos requisitos e responsabilidades associadas à conta bancária online. Certificar-se de seguir essas diretrizes ajudará a facilitar o processo de abertura de conta de maneira eficiente.</p>
                <div className="terms_checkbox">
                    <label className='basic_text' htmlFor="terms">Lí e aceito os <Link href="#">Termos e Políticas</Link></label>
                    <input type="checkbox" id="terms" {...register('terms')} />
                    
                </div>
                {errors.terms && <span className='input_error'>{errors.terms.message}</span>}
            </div>
            <Link href="/auth/open-account/step2" className='link2' style={{display: 'none'}}/>
            <div className="step1_footer">
                <Button_Next id='step1_next'/>
            </div>
        </form>
    )
}