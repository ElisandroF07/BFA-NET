"use client"
import { useRouter } from 'next/navigation'
import '@/styles/open-account.css'
import { useEffect } from "react"
import Button_Next from "@/components/button_next"
import Button_Back from "@/components/button_back"
import Link from "next/link"

export default function Step1() {

    const router = useRouter()

    useEffect(() => {
        let button_next = document.querySelector('#step1_next') as HTMLButtonElement 
        button_next.addEventListener('click', () => {
            router.push('/auth/step2')
        })
    }, [])

    return (
        <form className="section_step1">
            <div className="step1_header">
                <h1 className="page_title">Antes de continuar</h1>
                <Button_Back/>
            </div>
            <div className="step1_body">
                <p className="basic_text">Antes de abrir uma conta bancária online no BFA Net, certifique-se de ter em mãos os documentos necessários, como identificação pessoal e comprovante de atvidades. Recomenda-se verificar a lista específica de documentos exigidos pelo banco. Além disso, é crucial revisar e concordar com os termos e políticas do BFA Net, garantindo uma compreensão completa dos requisitos e responsabilidades associadas à conta bancária online. Certificar-se de seguir essas diretrizes ajudará a facilitar o processo de abertura de conta de maneira eficiente.</p>
                <div className="terms_checkbox">
                    <label className='basic_text' htmlFor="aceeptTerms">Lí e aceito os <Link href="#">Termos e Políticas</Link></label>
                    <input type="checkbox" name="acceptTerms" id="aceeptTerms" />
                </div>
            </div>
            <Link href="/auth/open-account/step2" className='link2' style={{display: 'none'}}/>
            <div className="step1_footer">
                <Button_Next id='step1_next'/>
            </div>
        </form>
    )
}