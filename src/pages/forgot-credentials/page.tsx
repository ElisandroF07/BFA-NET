"use client";

import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import InfoError from "@/components/others/infoError";
import useUserStore from "@/contexts/stores/userStore";
import "@/styles/globals.css";
import "@/styles/phone.css";
import business from "@/assets/images/Upvote-pana.svg";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { TailSpin } from "react-loader-spinner";

const FormSchema = z.object({
	accessCode: z.string()
		.min(1, "O campo não pode estar vazio!")
		.regex(/^[0-9]{6}$/, "O código de acesso deve ser composto por 6 digitos!"),
	confirmAccessCode: z.string()
		.min(1, "O campo não pode estar vazio!")
		.regex(/^[0-9]{6}$/, "O código de acesso deve ser composto por 6 digitos!"),
	})
	.refine((data) => data.accessCode === data.confirmAccessCode, {
		message: "Os campos deves ser iguais",
		path: ["confirmAccessCode"],
	});

type FormType = z.infer<typeof FormSchema>;

export default function SetCredentials() {

	const useStore = useUserStore();
	const router = useRouter()
	const [loading, setLoading] = useState(false)

	let email_local = "";
	if (typeof window !== "undefined") {
		email_local = localStorage.getItem("email") ?? useStore.email
	}

	const {register, formState: { errors }, handleSubmit} = useForm<FormType>({
		resolver: zodResolver(FormSchema),
	});


	async function APICall(data: any){
		setLoading(true)
			try {
				const response = await axios.post("https://environmental-kristina-franco07-98c1a6b0.koyeb.app//setAccessCode", data, { headers: { "Content-Type": "application/json" } });
				if (response.status === 201) {
					router.push("/login")
					toast.success(response.data.message);
				}
				else {
					toast.error(response.data.message);
				}
			} 
			catch {
				toast.error("Sem conexão com o servidor!");
				setLoading(false)
			}
		
	}

	async function submitForm(data: FormType) {
		const { accessCode } = data;
		const email = email_local || useStore.email;
		const formatedData = JSON.stringify({
			accessCode,
			email
		});

		APICall(formatedData)
	}

	return (
		<div className="home_main">
			<div className="home_body">
				<div className="left">
					<Image src={business} alt="business" />
					<h1>Defina um novo código de acesso</h1>
					<p>
						O código de acesso de ve ser constituido por uma combinação de 6
						digitos.
					</p>
				</div>
				<div className="right">
					<form onSubmit={handleSubmit(submitForm)} className="login_form">
						<div className="header_form">
							<h1>Recuperação</h1>
							<p>Crie e confirme o seu novo código de acesso</p>
						</div>
						<div className="body_form">
							<div className="input_field">
								<label htmlFor="membershipNumber">Novo código de acesso</label>
								<input
									type="password"
									placeholder="Insira o seu novo código de acesso "
									{...register("accessCode")}
								/>
								{errors.accessCode && (
									<InfoError message={errors.accessCode.message} />
								)}
							</div>
							<div className="input_field">
								<label htmlFor="membershipNumber">
									Confirme o novo código de acesso
								</label>
								<input
									type="password"
									placeholder="Insira novamente o seu novo código de acesso "
									{...register("confirmAccessCode")}
								/>
								{errors.confirmAccessCode && (
									<InfoError message={errors.confirmAccessCode.message} />
								)}
							</div>
							<button type="submit" className="button_auth" disabled={loading}>
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
								'Salvar'
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
