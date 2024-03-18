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

	const {register, formState: { errors }, handleSubmit} = useForm<FormType>({
		resolver: zodResolver(FormSchema),
	});

	function APICall(data: FormType): Promise<string> {
		setLoading(true);
		const { email } = data;
		// biome-ignore lint/suspicious/noAsyncPromiseExecutor: <explanation>
		return new Promise(async (resolve, reject) => {
			try {
				const response = await api.get(`/resetPassword/${email}`);
				if (response.status === 201) {
					useStore.updateEmail(email);
					if (typeof window !== "undefined") {
						localStorage.setItem("email", email);
					}
					resolve(response.data.message);
				} else {
					reject(response.data.message);
				}
			} 
			catch {
				reject("Não foi possivel processar a sua solicitação! Verifique a sua conexão com a interent.");
			} 
			finally {
				setLoading(false);
			}
		});
	}

	async function submitForm(data: FormType) {
		toast.promise(APICall(data), {
			loading: "Enviando...",
			success: (data) => {
				router.push("/forgot-password/email-verification");
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
								<label htmlFor="email">Endereço de email</label>
								<input
									type="text"
									placeholder="Insira o seu endereço de email "
									{...register("email")}
								/>
								{errors.email && <InfoError message={errors.email.message} />}
							</div>
							<button type="submit" disabled={loading} className="button_auth">
								Verificar email
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
