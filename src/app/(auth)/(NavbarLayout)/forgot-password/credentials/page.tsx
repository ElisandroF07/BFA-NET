"use client";

import { log } from "console";
import InfoError from "@/components/others/infoError";
import useUserStore from "@/contexts/stores/userStore";
import "@/styles/globals.css";
import "@/styles/phone.css";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import business from "../../../../../../public/assets/images/Upvote-pana.svg";

const FormSchema = z
	.object({
		accessCode: z
			.string()
			.min(1, "O campo não pode estar vazio!")
			.regex(
				/^[0-9]{6}$/,
				"O código de acesso deve ser composto por 6 digitos!",
			),
		confirmAccessCode: z
			.string()
			.min(1, "O campo não pode estar vazio!")
			.regex(
				/^[0-9]{6}$/,
				"O código de acesso deve ser composto por 6 digitos!",
			),
	})
	.refine((data) => data.accessCode === data.confirmAccessCode, {
		message: "Os campos deves ser iguais",
		path: ["confirmAccessCode"],
	});

type FormType = z.infer<typeof FormSchema>;

export default function ForgotPassword() {
	const useStore = useUserStore();

	let email_local = "";
	if (typeof window !== "undefined") {
		email_local = localStorage.getItem("email") ?? "";
	}

	const {
		register,
		formState: { errors },
		handleSubmit,
	} = useForm<FormType>({
		resolver: zodResolver(FormSchema),
	});

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	function APICall(data: any): Promise<any> {
		// biome-ignore lint/suspicious/noAsyncPromiseExecutor: <explanation>
		return new Promise(async (resolve, reject) => {
			try {
				const response = await axios.post(
					"http://localhost:5000/setAccessCode",
					data,
					{ headers: { "Content-Type": "application/json" } },
				);
				if (response.status === 201) {
					resolve(response.data.message);
				} else {
					reject(response.data.message);
				}
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			} catch (error: any) {
				reject(error.response?.data.message);
			} finally {
			}
		});
	}

	async function submitForm(data: FormType) {
		const { accessCode, confirmAccessCode } = data;
		const email = email_local || useStore.email;
		const formatedData = JSON.stringify({
			accessCode,
			confirmAccessCode,
			email,
		});
		console.log(email);

		toast.promise(APICall(formatedData), {
			loading: "Enviando...",
			success: (data) => {
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
							<button type="submit" className="button_auth">
								Validar
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
