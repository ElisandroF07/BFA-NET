"use client";

import useUserStore from "@/contexts/stores/userStore";
import "@/styles/globals.css";
import "@/styles/phone_verification.css";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import business from "../../../../../../public/assets/images/Two factor authentication-pana.svg";
import {z} from 'zod'
import {useForm} from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import {useRouter} from "next/navigation";

const FormSchema = z.object({
	value1: z.string().min(1, "O campo é obrigatório!"),
	value2: z.string().min(1, "O campo é obrigatório!"),
	value3: z.string().min(1, "O campo é obrigatório!"),
	value4: z.string().min(1, "O campo é obrigatório!"),
	value5: z.string().min(1, "O campo é obrigatório!"),
	value6: z.string().min(1, "O campo é obrigatório!")
})

type FormType = z.infer<typeof FormSchema>

export default function TwoFactorAuthentication() {

	const [loading, setLoading] = useState(false);
	const useStore = useUserStore();
	const router = useRouter()
	let email = "";
	if (typeof window !== "undefined") {
		email = localStorage.getItem("email") ?? "";
	}

	let membership_number = "";
	if (typeof window !== "undefined") {
		membership_number = localStorage.getItem("membership_number") ?? "";
	}

	const { register, handleSubmit} = useForm<FormType>({
		resolver: zodResolver(FormSchema)
	})

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	function APICall(): Promise<any> {
		setLoading(true);
		// biome-ignore lint/suspicious/noAsyncPromiseExecutor: <explanation>
		return new Promise(async (resolve, reject) => {
			try {
				const response = await axios.get(`http://localhost:5000/2fa/${membership_number || useStore.membership_number}`);
				if (response.status === 201) {
					resolve(response.data.message);
				}
			} catch {
				reject("Erro ao processar a sua solicitação!");
			} finally {
				setLoading(false);
			}
		});
	}

	async function resendEmail() {
		toast.promise(APICall(), {
			loading: "Reenviando email...",
			success: (data) => {
				return data;
			},
			error: (data) => {
				return data;
			},
		});
	}

	async function submitForm(data: FormType) {
		setLoading(true)
		const {value1, value2, value3, value4, value5, value6} = data
		const OTP = value1+value2+value3+value4+value5+value6
		const result = await signIn('credentials', {
      email,
      OTP,
      redirect: false
    })

    if (result?.error) {
      toast.error("Código de autenticação inválido!")
			setLoading(false)
      return
    }

    router.replace('/dashboard')
	}

	return (
		<div className="home_main">
			<div className="home_body">
				<div className="left">
					<Image src={business} alt="business" />
					<h1>Autenticação de dois fatores</h1>
					<p>Enviamos um código de verificação para a sua caixa de entrada.</p>
				</div>
				<div className="right">
					<form className="login_form" onSubmit={handleSubmit(submitForm)}>
						<div className="header_form">
							<h1>Autenticação de dois fatores</h1>
							<p>
								O código de verificação foi enviado para o seu email, introduza-o abaixo para concluir a autenticação. <Link href={"/login"}>Voltar</Link>
							</p>
						</div>
						<div className="body_form">
							<div className="fragments_container">
								<input type="text" id="" className="phone_fragment" {...register("value1")} />
								<input type="text" id="" className="phone_fragment" {...register("value2")} />
								<input type="text" id="" className="phone_fragment" {...register("value3")} />
								<input type="text" id="" className="phone_fragment" {...register("value4")} />
								<input type="text" id="" className="phone_fragment" {...register("value5")} />
								<input type="text" id="" className="phone_fragment" {...register("value6")} />
							</div>
							<button
								type="submit"
								disabled={loading}
								className="button_auth"
							>
								{loading ? <>Validando...</> : <>Continuar</>}
							</button>
							<div className="terms">
								{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
								<p style={{color: "var(--color-focus)", textDecoration: "underline", cursor: "pointer"}} onClick={resendEmail}>Reenviar código</p>
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
