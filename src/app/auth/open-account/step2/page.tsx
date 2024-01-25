'use client'

import '@/styles/open-account.css'
import '@/styles/sign-in.css'
import { useEffect } from "react"
import posterbg from '../../../../../public/assets/images/poster_background_2.png'
import Button_Next from "@/components/button_next"
import Button_Back from "@/components/button_back"
import Link from "next/link"
import Button_Menu from '@/components/button_menu'

export default function Step2() {

    useEffect(() => {
        let auth_poster_card = document.querySelector('.auth_poster_card') as HTMLDivElement
        auth_poster_card.style.backgroundImage = `url(${posterbg.src})`
    }, [])

    return (
        <form className="step2"> {/* Formulário de login */}
			<div className="form_header"> {/* Cabeçalho do formulário */}
				
                    <h1 className="page_title">Criar conta</h1>
                    <Button_Menu/>
                
				<p className="basic_text">Bem vindo ao assistente de criação de contas. Para continuar, introduza o seu número de telefone.</p>
			</div>
            <div className='form_body'> {/* Corpo do formulário */}
                <div className="input_field">
                   <label htmlFor="accessCode">Número de telefone</label>
                    <div className='input_phone'>
                        <p >+244</p>
                        <input
                            name="accessCode"
                            placeholder="Insira o seu número de telefone "
                        />
                    </div>
                </div> 
            </div>
            <div className="step1_footer"> {/* Rodapé do formulário */}
                <Button_Next/>
            </div>
		</form>
    )
}