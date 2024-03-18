"use client";

import axios from "axios";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import useUserStore from "@/contexts/stores/userStore";
import api from "@/services/api";
import "@/styles/globals.css";
import "@/styles/phone_verification.css";
import business from "@/assets/images/Two factor authentication-pana.svg";

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
	const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [currentInput, setCurrentInput] = useState(0);
	const router = useRouter()
	let email = "";
	if (typeof window !== "undefined") {
		email = localStorage.getItem("email") ?? useStore.email;
	}

	let membership_number = "";
	if (typeof window !== "undefined") {
		membership_number = localStorage.getItem("membership_number") ?? useStore.membership_number;
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
				const response = await axios.get(`http://localhost:5000/2fa/${membership_number}`);
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

	async function submitForm(OTP: string) {
		setLoading(true)
		const result = await signIn('credentials', {
      email,
      OTP,
      redirect: false
    })

    if (result?.error) {
      toast.error("Código de autenticação inválido!")
			setLoading(false)
    }
		else {
			try {
				const response = await api.get(`/verifyLogin/${email}`);
				if(response.data) {
					router.replace("/set-access")
				}
				else {
					router.replace("/dashboard")
				}
			}
			catch{
				toast.error("Não foi possivel processar a sua solicitação!", {description: "Verifique a sua conexão com a internet."})
			}
		}
	}

  const focusNextInput = () => {
    const nextInput = inputRefs.current[currentInput + 1];
    if (nextInput) {
      nextInput.focus();
    }
  };

  const focusPreviousInput = () => {
    const previousInput = inputRefs.current[currentInput - 1];
    if (previousInput) {
      previousInput.focus();
    }
  };

  const handleInputChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.value.length > 0) {
			setCurrentInput((prev) => prev + 1);
			focusNextInput();
		} else {
			setCurrentInput((prev) => prev - 1);
			focusPreviousInput();
		}
	
		// Verifica se todos os campos estão preenchidos
		if (currentInput === 5) {
			const values = inputRefs.current.map((ref) => ref?.value || "").join("");
			submitForm(values);
		}
	};

	return (
		<div className="home_main">
			<div className="home_body">
				<div className="left">
					<Image src={business} alt="business" />
					<h1>Autenticação de dois fatores</h1>
					<p>Enviamos um código de verificação para a sua caixa de entrada.</p>
				</div>
				<div className="right">
					<form className="login_form">
						<div className="header_form">
							<h1>Autenticação de dois fatores</h1>
							<p>
								O código de verificação foi enviado para o seu email, introduza-o abaixo para concluir a autenticação. <Link href={"/login"}>Voltar</Link>
							</p>
						</div>
						<div className="body_form">
							<div className="fragments_container">
							{[1, 2, 3, 4, 5, 6].map((index) => (
								<input
									key={index}
									type="text"
									id={`value${index}`}
									className="phone_fragment"
									ref={(el) => {
										if (el) {
											inputRefs.current[index - 1] = el;
										}
									}}
									onChange={(e) => handleInputChange(index - 1, e)}
								/>
							))}
							</div>
							<button
								type="button"
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
