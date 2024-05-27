"use client";

import axios from "axios";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FaArrowRightLong } from "react-icons/fa6";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
import InfoError from "@/components/others/infoError";
import useUserStore from "@/contexts/stores/userStore";
import "@/styles/globals.css";
import "@/styles/login.css";
import business from "@/assets/images/Secure login-pana.png";
import { TailSpin } from 'react-loader-spinner'

const loginSchema = z.object({
	membership_number: z
		.string({
			required_error: "O campo não pode estar vazio!",
		})
		.min(1, "Introduza o seu número de adesão ou o seu email!")
		.transform((information) => {
			return information.trim().toLowerCase();
		}),
	access_code: z
		.string({
			required_error: "O código de acesso é obrigatório!",
		})
		.min(1, "O código de acesso é obrigatório!")
		.transform((information) => {
			return information.trim().toUpperCase();
		}),
});

type FormType = z.infer<typeof loginSchema>;

export default function Login() {

	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const useStore = useUserStore();
	const [email, setEmail] = useState("")
	const [pass, setPass] = useState("")

	const {register, handleSubmit, formState: { errors }, setValue} = useForm<FormType>({
		resolver: zodResolver(loginSchema),
	});
	
	async function APICall(data: FormType): Promise<string> {
		// biome-ignore lint/suspicious/noAsyncPromiseExecutor: <explanation>
		return new Promise(async (resolve, reject) => {
			try {
				setLoading(true);
				const response = await axios.post("http://localhost:5000/login", data, {headers: { "Content-Type": "application/json" }});
				if (response.status === 201) {
					useStore.updateEmail(response.data.email)
					if (typeof window !== "undefined") {
						localStorage.setItem("email", response.data.email);
					}
					useStore.updateMembershipNumber(response.data.membership_number)
					if (typeof window !== "undefined") {
						localStorage.setItem("membership_number", response.data.membership_number);
					}
					resolve("Credenciais autenticadas!");
				} else {
					reject(response.data.message);
					setLoading(false);
				}
			} catch {
				reject("Sem conexão com o servidor!");
				setLoading(false);
			}
		});
	}

	function APICall2(membership_number: string): Promise<string> {
		setLoading(true);
		// biome-ignore lint/suspicious/noAsyncPromiseExecutor: <explanation>
		return new Promise(async (resolve, reject) => {
			try {
				if (membership_number.includes("@")) {
					useStore.updateEmail(membership_number);
					if (typeof window !== "undefined") {
					localStorage.setItem("email", membership_number);
				}
				else {
					useStore.updateMembershipNumber(membership_number);
				if (typeof window !== "undefined") {
					localStorage.setItem("membership_number", membership_number);
				}
				}
				}
				const response = await axios.get(`http://localhost:5000/2fa/${membership_number.toLowerCase()}`,);
				if (response.status === 201) {
					resolve(response.data.message);
				}
				else {
					setLoading(false);
					reject(response.data.message);
				}
      } catch  {
				reject("Sem conexão com o servidor");
				setLoading(false);
			} 
		});
	}

	async function submitForm(data: FormType) {
		const { membership_number } = data;
		toast.promise(APICall(data), {
			loading: "Autenticando...",
			success: (data) => {
				toast.promise(APICall2(membership_number), {
					loading: "Enviando email...",
					success: (data) => {
						router.push("/login/2fa");
						return data;
					},
					error: (data) => {
						setLoading(false)
						return data;
					},
				});
				return data;
			},
			error: (data) => {
				return data;
			},
		});
	}

	return (
		<div className="home_main">
			<div className="home_body">
				<div className="left">
					<Image src={business} alt="business" />
					<h1>Tenha acesso às suas finanças</h1>
					<p>Introduza as sua credenciais para ter acesso ao BFA NET.</p>
				</div>
				<div className="right">
					<form onSubmit={handleSubmit(submitForm)} className="login_form">
						<div className="header_form">
							<h1>Faça login na sua conta</h1>
							<p>
								Ainda não tem uma conta?{" "}
								<Link href={"/register"}>Criar conta</Link>
							</p>
						</div>
						<div className="body_form">
							<div className="input_field">
								<label id="LLMN" htmlFor="membership_number">Nº de Adesão ou Email *</label> 
								<input
									placeholder="Insira o Nº de Adesão ou Email"
									{...register("membership_number")}
									onChange={(event)=>{
										setEmail(event.target.value)
										setValue('membership_number', event.target.value)
									}}
									onFocus={()=>{
                                        const label = document.querySelector('#LLMN') as HTMLLabelElement
										label.style.transition = ".3s"
                                        label.style.color = "var(--color-focus)"
                                    }}
                                    onBlur={()=>{
                                        const label = document.querySelector('#LLMN') as HTMLLabelElement
										label.style.transition = ".3s"
                                        label.style.color = "var(--color-text)"
                                    }}
								/>
								{errors.membership_number && (
									<InfoError message={errors.membership_number.message} />
								)}
							</div>
							<div className="input_field">
								<label id="LLCA" htmlFor="membership_number">Código de acesso *</label>
								<input
									type="password"
									placeholder="Insira o Código de Acesso "
									{...register("access_code")}
									pattern="[0-9]*" onInput={(event)=>{
										event.currentTarget.value = event.currentTarget.value.replace(/[^0-9]/g, '');
									}}
									onChange={(event)=>{
										setPass(event.target.value)
										setValue("access_code", event.target.value)
									}}
									onFocus={()=>{
                                        const label = document.querySelector('#LLCA') as HTMLLabelElement
                                        label.style.color = "var(--color-focus)"
                                    }}
                                    onBlur={()=>{
                                        const label = document.querySelector('#LLCA') as HTMLLabelElement
                                        label.style.color = "var(--color-text)"
                                    }}
								/>
								{errors.access_code && (
									<InfoError message={errors.access_code.message} />
								)}
							</div>
							<button type="submit" disabled={!pass || loading} className="button_auth">
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
								<>Entrar <FaArrowRightLong style={{marginLeft: "10px"}}/></>
							)}
							</button>
							<div className="terms">
								<p>
									{" "}
									<Link href="/privacy-policies">Políticas de Privacidade</Link>{" "}
									são aplicáveis.
								</p>
							</div>
						</div>
					</form>
					<p className="basic_text not_found_footer">
						© 2024 Banco de Fomento Angola
					</p>
				</div>
			</div>
		</div>
	);
}
