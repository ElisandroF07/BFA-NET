"use client"

import { useEffect } from "react";
import '@/styles/upload.css'
import { IoCloudUpload } from "react-icons/io5";
import Button_Next from "@/components/button_next";
import Button_Back from "@/components/button_back";
import Button_Menu from "@/components/button_menu";
import { toast } from "sonner";
import { useRouter } from "next/navigation"

const MAX_FILE_SIZE: number = parseInt(process.env.MAX_FILE_SIZE ?? "5242880")
const ACCEPTED_IMAGE_TYPES = process.env.ACCEPTED_IMAGE_TYPES || ['image/jpeg', 'image/jpg', 'image/webp', 'image/png']

export default function Step3() {

	const router = useRouter()

	function validateForm() {
		let i1 = document.getElementById('i1') as HTMLInputElement
		let i2 = document.getElementById('i2') as HTMLInputElement
		if (i1.files?.length === 0 && i2.files?.length === 0) {
			toast.warning('Faça upload das imagens para continuar!')
		}
		else if (i1.files?.length === 0) {
			toast.warning('Faça upload da parte frontal do BI!')
		}
		else if (i2.files?.length === 0) {
			toast.warning('Faça upload da parte frontal do BI!')
		}
		else {
			router.push('/auth/step4')
		}
	}

	function clearInput(input: HTMLInputElement) {
		input.value = '';
	}

	useEffect(() => {
		let button_next = document.querySelector('#step3_next') as HTMLButtonElement
		let button_ocult = document.querySelector('#step3_ocult_button') as HTMLButtonElement
		let upload_cards = document.querySelectorAll('.upload_card') as NodeListOf<HTMLDivElement>
		
		button_next.addEventListener('click', () => button_ocult.click()) 
		
		upload_cards.forEach((card) => {
			let input = card.querySelector('.input_file') as HTMLInputElement

			card.addEventListener('click', ()=> input.click())

			input.addEventListener('change', () => {
				if (input.files && input.files.length > 0) {
					const file = input.files[0]; 
					if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
						toast.error('Formato não suportado!', { description: 'São aceites os formatos: PNG, JPEG, WEBP' })
						clearInput(input)
						return;
					}
					else if (file.size > MAX_FILE_SIZE) {
						toast.error('O tamanho máximo do ficheiro é 5MB!')
						clearInput(input)
						return;
					}
					else {
						toast.success('Upload concluido!')
					}
				}
			})

			card.addEventListener('dragover', (e) => {
				e.preventDefault()
				card.classList.add('ondrag')
			})

			card.addEventListener('dragleave', (e) => {
				e.preventDefault()
				card.classList.remove('ondrag')
			})

			card.addEventListener('drop', async(e: DragEvent) => {
				e.preventDefault()
				card.classList.remove('ondrag')

				if (e.dataTransfer && e.dataTransfer.files.length > 0) {
					const file = e.dataTransfer.files[0];

					if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
						toast.error('Formato não suportado!', { description: 'São aceites os formatos: PNG, JPEG, WEBP' })
						clearInput(input)
						return;
					}
					else if (file.size > MAX_FILE_SIZE) {
						toast.error('O tamanho máximo do ficheiro é 5MB!')
						clearInput(input)
						return;
					}
					else {
						input.files = e.dataTransfer.files;
						toast.success('Upload concluido!')
					}	
				}
			})
		})
		
	}, [])


    return (
        <div className="main_container">
			<div className="container_header">
				<Button_Back/>
				<h1 className="title">Abertura de contas </h1>
				<Button_Menu/>
				<p className="subtitle basic_text">
					Faça upload das fotografias do seu documento de identificação
				</p>
			</div>
			<form onSubmit={(e) => {
				e.preventDefault()
				validateForm()
			}} className="container_body">
				<div className="upload_container">
					<p className="simple_text">Frente</p>
					<div className="upload_card">
						<IoCloudUpload className="iconOutButton" />
						<p className="simple_text">Arraste e solte o seu arquivo ou clique <br /> para fazer upload.</p>
						<p className="simple_text small">Large aqui</p>
						<input
							type="file"
							name='identityCardFrontImage'
							className="input_file"
							id="i1"
						/>
					</div>
				</div>
				<div className="upload_container">
					<p className="simple_text">Verso</p>
					<div className="upload_card">
						<IoCloudUpload className="iconOutButton" />
						<p className="simple_text">Arraste e solte o seu arquivo ou clique <br /> para fazer upload.</p>
						<p className="simple_text small">Largue aqui</p>
						<input
							type="file"
							name='identityCardBackImage'
							className="input_file"
							id="i2"
						/>
					</div>
				</div>
				<button id='step3_ocult_button' type="submit" style={{display: 'none'}}/>
			</form>
			<div className="container_footer">
				<Button_Next id="step3_next"/>
			</div>
		</div>
    )
}