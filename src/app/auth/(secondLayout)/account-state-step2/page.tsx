import Button_Back from '@/components/button_back'
import Button_Menu from '@/components/button_menu'
import Button_Next from '@/components/button_next'
import '@/styles/info.css'
import '@/styles/upload.css'
import '@/styles/finalize.css'
import Image from 'next/image'
import Link from 'next/link'
import qr_code from '../../../../../public/assets/images/qr_code.svg'

export default function Account_Step2() {
    return (
        <div className="container">
        	<div className="container_header">
				<Button_Back/>
				<h1 className="title">Estado da conta</h1>
				<Button_Menu/>
				<p className="subtitle basic_text">
					Finalize o processo no BFA App.
				</p>
			</div>
			<div className="info_body">
				<div className="step5_container">
					<div className='step5_left'>
						<ul>
						<li className='basic_text'>Titular: <p className="answer">John Dalton Smith Doe</p></li>
						<li className='basic_text'>Telefone: <p className="answer">+244 948 951 028</p></li>
						<li className='basic_text'>Estado da conta: <p className="answer">Inativa</p></li>
						<li className='basic_text'>Documento de Identificação: <p className="answer">020239365LA055</p></li>
						</ul>
					</div>
					<div className='step5_right'>
						<div className="qr_container">
							<h1>QR CODE</h1>
							<p className="basic_text">
								Utilize o BFA App para confirmar a sua conta.
							</p>
							<div className="download_links">
								<Link href='#' className='google_play'/>
								<Link href='#' className='apple_store'/>
							</div>
							<p className="basic_text">
								Aceda à opção Confirmar conta e escaneie o código qr abaixo.
							</p>
							<Image src={qr_code} alt='qr_code'/>
						</div>
					</div>
				</div>
				<div className="buttons">
					<Link href='/auth/sign-in' className="button_home" id='not_found'><p>Voltar ao inicio</p></Link>
				</div>
			</div>
    	</div>
    )
}