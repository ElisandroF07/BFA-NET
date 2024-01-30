import '@/styles/sign-in.css'
import Link from 'next/link';
import Button_Auth from '@/components/button_auth';
export default function Recovery_Step1() { 
    
	return (
		<form className="signIn_form"> {/* Formulário de login */}
			<div className="form_header"> {/* Cabeçalho do formulário */}
				<h1 className="page_title">Recuperação</h1>
				<button className="button_menu">
					<span className="bar_element"></span>
					<span className="bar_element"></span>
					<span className="bar_element"></span>
				</button>
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
                <p className='basic_text'>Já tem uma conta? <Link href='/auth/open-account/sign-in'>Entrar</Link></p>
            </div>
		</form>
	);
}
