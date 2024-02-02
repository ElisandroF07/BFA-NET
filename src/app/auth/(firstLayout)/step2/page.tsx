"use client"

import '@/styles/open-account.css'
import '@/styles/sign-in.css'
import Button_Next from "@/components/button_next"
import Link from "next/link"
import Button_Menu from '@/components/button_menu'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ChildrenLogo from '@/components/children_logo'
import Image from 'next/image'
import logo from '../../../../../public/assets/images/logo.png'

export default  function Step2() {

    const router = useRouter()

    useEffect(() => {
        let button_auth = document.querySelector('#step2_next') as HTMLButtonElement
        button_auth.addEventListener('click', () => {
            router.push('/auth/step3')
        })

        let menu = document.querySelector('.menu') as HTMLDivElement
        let button_menu = document.querySelector('.button_menu') as HTMLButtonElement	
        menu.style.opacity = '0';
        menu.style.width = '0px'
        menu.style.height = '0px'
        button_menu.dataset.opened = 'false'						


    }, [])

    return (
        <form className="step2">
			<div className="form_header">
				<Image className='children_logo' src={logo} alt='logo'/>
                    <h1 className="page_title">Criar conta</h1>
                    <Button_Menu/>
                
				<p className="basic_text">Bem vindo ao assistente de criação de contas. Para continuar, introduza o seu número de telefone.</p>
			</div>
            <div className='form_body'>
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
            <div className="step1_footer">
                <Button_Next id='step2_next'/>
            </div>
		</form>
    )
}