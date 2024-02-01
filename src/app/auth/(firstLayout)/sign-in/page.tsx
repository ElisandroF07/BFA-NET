import '@/styles/sign-in.css'
import Link from 'next/link';
import Button_Auth from '@/components/button_auth';
export default function SignIn() { 
	return (
		<form className="signIn_form">
			<div className="form_header">
				<h1 className="page_title">Entre na sua conta</h1>
				<button className="button_menu">
					<span className="bar_element"></span>
					<span className="bar_element"></span>
					<span className="bar_element"></span>
				</button>
				<p className="basic_text">Introduza as suas credênciais</p>
			</div>
            <div className='form_body'>
                <div className="input_field">
                    <label htmlFor="membershipNumber">Número de adesão</label>
                    <input
                        name="membershipNumber"
                        placeholder="Insira o seu número de adesão"
                    />
                </div>
                <div className="input_field">
                   <label htmlFor="accessCode">Código de acesso</label>
                    <input
                        name="accessCode"
                        placeholder="Insira o seu código de acesso "
                    />
                </div> 
                <Button_Auth content='Entrar'/>
            </div>
            <div className="form_footer">
                <p className='basic_text'>Ainda não tem uma conta? <Link href='/auth/step1'>Criar conta</Link></p>
            </div>
		</form>
	);
}
