"use client"

import Button_Back from '@/components/button_back'
import Button_Menu from '@/components/button_menu'
import Button_Next from '@/components/button_next'
import '@/styles/info.css'
import '@/styles/upload.css'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Step4() {

	const router = useRouter()

	useEffect(() => {
		let button_step4 = document.querySelector('#step4_next') as HTMLButtonElement
		button_step4.addEventListener('click', () => {
			router.push('/auth/step5')
		})
	}, [])

    return (
        <div className="container">
        	<div className="container_header">
				<Button_Back/>
				<h1 className="title">Abertura de contas </h1>
				<Button_Menu/>
				<p className="subtitle basic_text">
					Introduza os seus dados
				</p>
			</div>
			<div className="info_body">
				<form action="#">
					<div className="form first">
						<div className="details personal">
				
							<div className="fields">
								<div className="input-field">
									<label>Nome Completo</label>
									<input type="text" placeholder="Digite o nome completo" required/>
								</div>
								<div className="input-field">
									<label>Número do BI</label>
									<input type="text" placeholder="Digite o número do BI" required/>
								</div>
								<div className="input-field">
									<label>Telemóvel Primário</label>
									<input type="number" placeholder="Digite o número primário" required/>
								</div>
								<div className="input-field">
									<label>Endereço de email</label>
									<input type="text" placeholder="Digite o email" required/>
								</div>
								<div className="input-field">
									<label>Data de nascimento</label>
									<input type="date" placeholder="Digite a data de nascimento" required/>
								</div>
				
								<div className="input-field">
									<label>Telemóvel secundário</label>
									<input type="number" placeholder="Digite o número primário" required/>
								</div>
								<div className="input-field">
									<label>Bairro</label>
									<input type="text" placeholder="Digite o bairro" required/>
								</div>
								<div className="input-field">
									<label>Município</label>
									<input type="text" placeholder="Digite o município" required/>
								</div>
								<div className="input-field">
									<label>Província</label>
									<input type="text" placeholder="Digite a província" required/>
								</div>
								<div className="input-field">
									<label>Endereço</label>
									<input type="text" placeholder="Digite o endereço" required/>
								</div>
								<div className="input-field">
									<label>Ocupação</label>
									<select required>
										<option disabled selected>Selecione a ocupação</option>
										<option>Estudante</option>
										<option>Empregado</option>
										<option>Empreendedor</option>
									</select>
								</div>
				
							</div>
						</div>
					</div>
				</form>
				<div className="buttons">
					<Button_Next id={'step4_next'}/>
				</div>
			</div>
    	</div>
    )
}