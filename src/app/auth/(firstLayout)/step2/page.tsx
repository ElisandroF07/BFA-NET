"use client"

import '@/styles/open-account.css'
import '@/styles/sign-in.css'
import Button_Next from "@/components/button_next"
import Link from "next/link"
import Button_Menu from '@/components/button_menu'

export default  function Step2() {

    return (
        <form className="step2"> {/* Formulário de login */}
			<div className="form_header"> {/* Cabeçalho do formulário */}
				
                    <h1 className="page_title">Criar conta</h1>
                    <Button_Menu/>
                
				<p className="basic_text">Bem vindo ao assistente de criação de contas. Para continuar, introduza o seu número de telefone.</p>
			</div>
            <div className='form_body'> {/* Corpo do formulário */}
                <div className="input_field">
                   <label htmlFor="phoneNumber">Número de telefone</label>
                    <div className='input_phone'>
                        <p >+244</p>
                        <input
                            name="phoneNumber"
                            maxLength={9}
                            placeholder="Insira o seu número de telefone "
                        />
                    </div>
                </div> 
            </div>
            <Link href="/auth/open-account/step3" className='link3'/>
            <div className="step1_footer"> {/* Rodapé do formulário */}
                <Button_Next id='step2_next'/>
            </div>
		</form>
    )
}