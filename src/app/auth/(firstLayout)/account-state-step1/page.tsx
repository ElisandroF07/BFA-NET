import '@/styles/sign-in.css'
import Link from 'next/link';
import Button_Auth from '@/components/button_auth';
import Button_Menu from '@/components/button_menu';
import Image from 'next/image';
import logo from '../../../../../public/assets/images/logo.png'

export default function Account_Step1() { 
    

	return (
		<form className="signIn_form"> {/* Formulário de login */}
            <div className="form_header"> {/* Cabeçalho do formulário */}
                <Image className='children_logo' src={logo} alt='logo'/>
				<h1 className="page_title">Estado da conta</h1>
				<Button_Menu/>
				<p className="basic_text">Introduza as informações abaixo</p>
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
                
                
                <Button_Auth content='Verificar'/>
            </div>
            <div className="form_footer"> {/* Rodapé do formulário */}
                <p className='basic_text'>Ainda não tem uma conta? <Link href='/auth/step1'>Criar conta</Link></p>
            </div>
		</form>
	);
}
