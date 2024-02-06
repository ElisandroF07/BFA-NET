'use client'

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Menu() {


    const router = useRouter()

    function handleCLick(href: string) {
        let button_menu = document.querySelector('.button_menu') as HTMLButtonElement
		let menu = document.querySelector('.menu') as HTMLDivElement
        menu.style.opacity = '0';
        menu.style.width = '0px'
        menu.style.height = '0px'
        button_menu.dataset.opened = 'false'
        router.push(href) 
    }

    return (
        <div className="menu">
            <ul>
                <li className="basic_text"><p onClick={()=>handleCLick('/auth/sign-in')}>Entrar</p></li>
                <li className="basic_text"><p onClick={()=>handleCLick('/auth/step1')}>Criar uma conta</p></li>
                <li className="basic_text"><p onClick={()=>handleCLick('/auth/recovery-step1')}>Recuperar credenciais</p></li>
                <li className="basic_text"><p onClick={()=>handleCLick('/auth/account-state-step1')}>Estado da conta</p></li>
                <li className="basic_text"><p onClick={()=>handleCLick('/auth/privacy-policies')}>Termos e Políticas</p></li>
            </ul>
        </div>
    )
}