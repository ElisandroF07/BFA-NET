import '@/styles/sign-in.css'
import Link from 'next/link';
import Button_Auth from '@/components/button_auth';
import { useEffect } from 'react';
import Button_Menu from '@/components/button_menu';
import Image from 'next/image'
import logo from '../../../../../public/assets/images/logo.png'
export default function Recovery_Step1() { 
    

	return (
		<form className="signIn_form"> {/* Formulário de login */}
            <div className="form_header"> {/* Cabeçalho do formulário */}
                <Image className='children_logo' src={logo} alt='logo'/>
				<h1 className="page_title">Recuperação</h1>
				<Button_Menu/>
				<p className="basic_text">Introduza as informações abaixo</p>
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
                   <label htmlFor="accessCode">Número do DI</label>
                    <input
                        name="accessCode"
                        placeholder="Insira o número do seu DI "
                    />
                </div> 
                <div className="input_field">
                   <label htmlFor="accessCode">Data de nasciemnto</label>
                    <input
                        name="accessCode"
                        type='date'
                    />
                </div> 
                <Button_Auth content='Recuperar'/>
            </div>
            <div className="form_footer"> {/* Rodapé do formulário */}
                <p className='basic_text'>Já recuperou as suas credenciais? <Link href='/auth/sign-in'>Entrar</Link></p>
            </div>
		</form>
	);
}
