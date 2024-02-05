"use client"

import Button_Back from '@/components/button_back'
import Button_Menu from '@/components/button_menu'
import Button_Next from '@/components/button_next'
import '@/styles/info.css'
import '@/styles/upload.css'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {useForm} from 'react-hook-form'

const FormSchema = z.object({
	name: z.string().min(1, 'O nome é obrigatório!').transform((name) => {
		return name
			.trim()
			.split(' ')
			.map((word) => {
				return word[0].toLocaleUpperCase().concat(word.substring(1))
			})
	}),
	identityCardNumber: z.string({
        required_error: 'O campo não pode estar vazio!',
	}).min(1, 'O número do BI é obrigatório!').regex(/^[0-9]{8}[A-Z|a-z]{2}[0-9]{3}$/, 'Número do BI inválido!').transform(information => { return information.trim().toUpperCase() }),
	email: z.string().min(1, 'O email é obrigatório').email('Email inválido!').transform(email => {
		return email.toLocaleLowerCase()
	}),
	phonePrimary: z.string().min(1, 'O número de telefone é obrigatório!').regex(/^9[0-9]{8}$/, 'Número de telefone inválido!').transform(phone => {
        return phone.trim().toUpperCase()
    }),
	phoneSecondary: z.string(),
	birthDay: z.string({required_error: 'A data de nascimento é obrigatória'}).min(1, 'A data de nascimento é obrigatória!'),
	neighborhood: z.string().min(1, 'O bairro é obrigatório!').transform(option => {return option.toLowerCase()}),
	county: z.string().min(1, 'O município é obrigatório!').transform(option => {return option.toLowerCase()}),
	province: z.string().min(1, 'A provincia é obrigatória!').transform(option => {return option.toLowerCase()}),
	adress: z.string().min(1, 'O endereço é obrigatório!').transform(option => {return option.toLowerCase()}),
	ocupation: z.enum(['Estudante', 'Empregado', 'Empreendedor', 'Desempregado'], {
		errorMap: () => ({ message: 'Selecione uma ocupação' })
	}).transform(option => {return option.trim().toLowerCase()})
})

type FormType = z.infer<typeof FormSchema>

export default function Step4() {

	const {register, formState: {errors}, handleSubmit} = useForm<FormType>({
		resolver: zodResolver(FormSchema)
	})

	function submitForm(data: any) {
		console.log(data)
	}

	useEffect(() => {
		let button_next = document.querySelector('#step4_next') as HTMLButtonElement
		let button_ocult = document.querySelector('#step4_ocult_button') as HTMLButtonElement
		button_next.addEventListener('click', ()=>  button_ocult.click()) 
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
				<form onSubmit={handleSubmit(submitForm)} action="#">
					<div className="form first">
						<div className="details personal">
				
							<div className="fields">
								<div className="input-field">
									<label>Nome Completo</label>
									<input type="text" placeholder="Digite o nome completo" {...register('name')} />
									{errors.name && <span className='input_error'>{errors.name.message}</span>}
								</div>
								<div className="input-field">
									<label>Número do BI</label>
									<input type="text" placeholder="Digite o número do BI" maxLength={13} {...register('identityCardNumber')}/>
									{errors.identityCardNumber && <span className='input_error'>{errors.identityCardNumber.message}</span>}
								</div>
								<div className="input-field">
									<label>Telemóvel Primário</label>
									<input type="number" placeholder="Digite o número primário" maxLength={9} {...register('phonePrimary')} />
									{errors.phonePrimary && <span className='input_error'>{errors.phonePrimary.message}</span>}
								</div>
								<div className="input-field">
									<label>Endereço de email</label>
									<input type="text" placeholder="Digite o email" {...register('email')} />
									{errors.email && <span className='input_error'>{errors.email.message}</span>}
								</div>
								<div className="input-field">
									<label>Data de nascimento</label>
									<input type="date" placeholder="Digite a data de nascimento" {...register('birthDay')} />
									{errors.birthDay && <span className='input_error'>{errors.birthDay.message}</span>}
								</div>
				
								<div className="input-field">
									<label>Telemóvel secundário</label>
									<input type="number" placeholder="Digite o número primário" maxLength={9} {...register('phoneSecondary')}/>
									{errors.phoneSecondary && <span className='input_error'>{errors.phoneSecondary.message}</span>}
								</div>
								<div className="input-field">
									<label>Bairro</label>
									<input type="text" placeholder="Digite o bairro" {...register('neighborhood')} />
									{errors.neighborhood && <span className='input_error'>{errors.neighborhood.message}</span>}
								</div>
								<div className="input-field">
									<label>Município</label>
									<input type="text" placeholder="Digite o município" {...register('county')} />
									{errors.county && <span className='input_error'>{errors.county.message}</span>}
								</div>
								<div className="input-field">
									<label>Província</label>
									<input type="text" placeholder="Digite a província" {...register('province')} />
									{errors.province && <span className='input_error'>{errors.province.message}</span>}
								</div>
								<div className="input-field">
									<label>Endereço</label>
									<input type="text" placeholder="Digite o endereço" {...register('adress')}/>
									{errors.adress && <span className='input_error'>{errors.adress.message}</span>}
								</div>
								<div className="input-field">
									<label>Ocupação</label>
									<select {...register('ocupation')}>
										<option disabled selected>Selecione a ocupação</option>
										<option>Estudante</option>
										<option>Empregado</option>
										<option>Empreendedor</option>
										<option>Desempregado</option>
									</select>
									{errors.ocupation && <span className='input_error'>{errors.ocupation.message}</span>}
								</div>
				
							</div>
						</div>
					</div>
					<button id='step4_ocult_button' type="submit" style={{display: 'none'}}/>
				</form>
				<div className="buttons">
					<Button_Next id={'step4_next'}/>
				</div>
			</div>
    	</div>
    )
}