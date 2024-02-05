"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import '@/styles/upload.css'
import { IoCloudUpload } from "react-icons/io5";
import Button_Next from "@/components/button_next";
import Button_Back from "@/components/button_back";
import Button_Menu from "@/components/button_menu";
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod";

const MAX_FILE_SIZE = 5
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/webp', 'image/png']

const FormSchema = z.object({
	identityCardFrontImage: z
        .custom<FileList>()
        .refine((fileList) => fileList.length === 1, 'Faça upload')
		.transform((file) => file[0] as File)
		.refine(
            (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
            'Somente esses tipos são permitidos .jpg, .jpeg, .png e .webp',
        )
        .refine((file) => {
            return file.size >= MAX_FILE_SIZE;
        }, `O tamanho do arquivo deve ser inferior a 5 MB.`),
	identityCardBackImage: z
        .custom<FileList>()
        .refine((fileList) => fileList.length === 1, 'Faça upload')
		.transform((file) => file[0] as File)
		.refine(
            (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
            'Somente esses tipos são permitidos .jpg, .jpeg, .png e .webp',
        )
        .refine((file) => {
            return file.size >= 5;
        }, `O tamanho do arquivo deve ser inferior a 5 MB.`),
        
})

type FormType = z.infer<typeof FormSchema>

export default function Step3() {

	const { register, formState: { errors }, handleSubmit } = useForm<FormType>({
		resolver: zodResolver(FormSchema)
	})

	function submitForm(data: any) {
		console.log(data)
	}



	useEffect(() => {
		let button_next = document.querySelector('#step3_next') as HTMLButtonElement
		let button_ocult = document.querySelector('#step3_ocult_button') as HTMLButtonElement
		button_next.addEventListener('click', () => button_ocult.click()) 
		
		let upload_cards = document.querySelectorAll('.upload_card') as NodeListOf<HTMLDivElement>
		upload_cards.forEach((card) => {
			let input = card.querySelector('.input_file') as HTMLInputElement
			card.addEventListener('click', ()=>input.click())
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
			<form onSubmit={handleSubmit(submitForm)} className="container_body">
				<div className="upload_container">
					<p className="simple_text">Frente</p>
					<div className="upload_card">
						<IoCloudUpload className="iconOutButton" />
						<p className="simple_text">
							
								Arraste e solte o seu arquivo ou clique <br /> para fazer
								upload.
							
						</p>
						<p className="simple_text small">PNG, JPG, JPEG, maximo 10MB</p>
						<input
							type="file"
							{...register('identityCardFrontImage')}
							className="input_file"
						/>
					</div>
					{errors.identityCardFrontImage && <span className='input_error'>{errors.identityCardFrontImage.message}</span>}
				</div>
				<div className="upload_container">
					<p className="simple_text">Verso</p>
					<div className="upload_card">
						<IoCloudUpload className="iconOutButton" />
						<p className="simple_text">
							
								Arraste e solte o seu arquivo ou clique <br /> para fazer
								upload.
							
						</p>
						<p className="simple_text small">PNG, JPG, JPEG, maximo 10MB</p>
						<input
							type="file"
							{...register('identityCardBackImage')}
							className="input_file"
						/>
					</div>
					{errors.identityCardBackImage && <span className='input_error'>{errors.identityCardBackImage.message}</span>}
				</div>
				<button id='step3_ocult_button' type="submit" style={{display: 'none'}}/>
			</form>
			<div className="container_footer">
				<Button_Next id="step3_next"/>
			</div>
		</div>
    )
}