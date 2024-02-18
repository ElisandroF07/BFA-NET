"use client"

import '@/styles/credentials.css'
import picture from '../../../../../public/assets/images/Certification-bro.svg'
import Image from 'next/image'



export default function PersonalData(){
    return (
        <form className="login_form">
            <div className="header_form">
              <h1>Credenciais</h1>
              <p>Obrigado por aguardar, estamos finalizando o processo.</p>
            </div>
            <div className="body_form">
              <div className="container_body">
                <Image src={picture} alt="" />
                <h1>As suas informações estão sendo verificadas</h1>
                <p>Brevemente enviaremos para o seu telemóvel verificado as suas credenciais de acesso ao BFA NET. Posteriormente poderá alterá-las.</p>
              </div>
              <button type="submit"  className="button_auth">
                Finalizar
              </button>
            </div>
          </form>
    )
}