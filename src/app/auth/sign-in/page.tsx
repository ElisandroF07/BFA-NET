"use client"

import '@/styles/sign-in.css'
import Link from 'next/link';
import posterbg from '../../../../public/assets/images/poster_background.png'
import { useEffect } from 'react';
import Button_Auth from '@/components/button_auth';
export default function SignIn() { {/* Função que retorna o formulário de login */}

    useEffect(() => {
        let auth_poster_card = document.querySelector('.auth_poster_card') as HTMLDivElement
        auth_poster_card.style.backgroundImage = `url(${posterbg.src})`
    }, [])
    
	return (
		<form className="signIn_form"> {/* Formulário de login */}
			<div className="form_header"> {/* Cabeçalho do formulário */}
				<h1 className="page_title">Entre na sua conta</h1>
				<button className="button_menu">
					<span className="bar_element"></span>
					<span className="bar_element"></span>
					<span className="bar_element"></span>
				</button>
				<p className="basic_text">Introduza as suas credênciais</p>
			</div>
            <div className='form_body'> {/* Corpo do formulário */}
                <div className="input_field">
                    <label htmlFor="membershipNumber">Número de adesão</label>
                    <input
                        name="membershipNumber"
                        placeholder="Insira o seu número de adesão"
                    />
                </div>
                <div className="input_field">
                   <label htmlFor="accessCode">Número de adesão</label>
                    <input
                        name="accessCode"
                        placeholder="Insira o seu código de acesso "
                    />
                </div> 
                <Button_Auth content='Entrar'/>
            </div>
            <div className="form_footer"> {/* Rodapé do formulário */}
                <p className='basic_text'>Ainda não tem uma conta? <Link href='/auth/open-account/step1'>Criar conta</Link></p>
            </div>
		</form>
	);
}
