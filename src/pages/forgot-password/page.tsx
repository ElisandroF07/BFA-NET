"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import InfoError from "@/components/others/infoError";
import useUserStore from "@/contexts/stores/userStore";
import business from "@/assets/images/Forgot password-pana.svg";
import "@/styles/globals.css";
import "@/styles/phone.css";
import api from "@/services/api";
import { TailSpin } from 'react-loader-spinner'
import { FaArrowRightLong } from "react-icons/fa6";

const FormSchema = z.object({
	email: z
		.string()
		.min(1, "O email é obrigatório!")
		.email("Email inválido! Corrija o email")
		.transform((email) => {
			return email.trim().toLowerCase();
		}),
});

type FormType = z.infer<typeof FormSchema>;

export default function ForgotPassword() {
	const router = useRouter();
	const useStore = useUserStore();
	const [loading, setLoading] = useState(false);
	const [place, setPlace] = useState("")
	const {register, formState: { errors }, handleSubmit, setValue} = useForm<FormType>({
		resolver: zodResolver(FormSchema),
	});

	async function APICall(data: FormType){
		setLoading(true);
		const { email } = data;
			try {
				const response = await api.get(`/resetPassword/${email}`);
				if (response.status === 201) {
					useStore.updateEmail(email);
					if (typeof window !== "undefined") {
						localStorage.setItem("email", email);
					}
					toast.success(response.data.message);
					router.push('/email-verification')
				} else {
					toast.error(response.data.message);
					setLoading(false);
				}
			} 
			catch {
				toast.error("Sem conexão com o servidor");
				setLoading(false);
			} 

	}

	async function submitForm(data: FormType) {
		APICall(data)
	}

	return (
		<div className="home_main">
			<div className="home_body">
				<div className="left">
					<Image src={business} alt="business" />
					<h1>Esqueceu o seu código de acesso?</h1>
					<p>Não faça pranto! Recupere em simples passos.</p>
				</div>
				<div className="right">
					<form onSubmit={handleSubmit(submitForm)} className="login_form">
						<div className="header_form">
							<h1>Recuperação</h1>
							<p>
								Já lembrou o seu código de acesso?{" "}
								<Link href={"/login"}>Fazer login</Link>
							</p>
						</div>
						<div className="body_form">
							<div className="input_field">
								<label id="LFPE" htmlFor="email">Endereço de email *</label>
								<input
									type="text"
									placeholder="Insira o seu endereço de email "
									{...register("email")}
									onChange={(event)=>{
										setPlace(event.target.value)
										setValue("email", event.target.value)
									}}
									onFocus={()=>{
                                        const label = document.querySelector('#LFPE') as HTMLLabelElement
                                        label.style.transition = ".3s"
                                        label.style.color = "var(--color-focus)"
                                    }}
                                    onBlur={()=>{
                                        const label = document.querySelector('#LFPE') as HTMLLabelElement
                                        label.style.transition = ".3s"
                                        label.style.color = "var(--color-text)"
                                    }}
								/>
								{errors.email && <InfoError message={errors.email.message} />}
							</div>
							<button type="submit" disabled={loading || !place} className="button_auth">
							{loading ? (
								<TailSpin
									height="25"
									width="25"
									color="#fff"
									ariaLabel="tail-spin-loading"
									radius="1"
									visible={true}
								/>
							) : (
								<>Verificar email <FaArrowRightLong style={{marginLeft: "10px"}}/></>
							)}
							</button>
							<div className="terms">
								<p>
									Ao utilizar a plataforma, você estará confirmando que leu e
									aceitou as nossas{" "}
									<Link href="/privacy-policies">
										Políticas de Privacidade e Termos de Uso
									</Link>
									.
								</p>
							</div>
						</div>
					</form>
					<p className="basic_text            not_found_footer">
						© 2024 Banco de Fomento Angola
					</p>
				</div>
			</div>
		</div>
	);
}
