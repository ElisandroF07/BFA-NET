'use client'

import '@/styles/open-account.css'
import { useEffect } from "react"
import posterbg from '../../../../../public/assets/images/poster_background_2.png'
import Button_Next from "@/components/button_next"
import Button_Back from "@/components/button_back"
import Link from "next/link"

export default function Step1() {

    useEffect(() => {
        let auth_poster_card = document.querySelector('.auth_poster_card') as HTMLDivElement
        auth_poster_card.style.backgroundImage = `url(${posterbg.src})`
    }, [])

    return (
        <section className="section_step1">
            <div className="step1_header">
                <h1 className="page_title">Antes de continuar</h1>
                <Button_Back/>
            </div>
            <div className="step1_body">
                <p className="basic_text">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Fuga iure officiis, totam quae sapiente ratione omnis ab enim, quaerat deleniti, possimus itaque cupiditate. Asperiores corporis explicabo expedita ipsam facilis laudantium! Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ipsum, dolore, aperiam assumenda provident aut eius nisi laborum voluptates eaque maiores alias beatae possimus! Laudantium obcaecati amet soluta sapiente maiores odit? Lorem ipsum dolor sit amet consectetur adipisicing elit. </p>
                <div className="terms_checkbox">
                    <label className='basic_text' htmlFor="aceeptTerms">Lí e aceito os <Link href="#">Termos e Políticas</Link></label>
                    <input type="checkbox" name="acceptTerms" id="aceeptTerms" />
                </div>
            </div>
            <div className="step1_footer">
                <Button_Next/>
            </div>
        </section>
    )
}