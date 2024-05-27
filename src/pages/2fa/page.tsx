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
import { TailSpin } from 'react-loader-spinner'
import { FaArrowRightLong } from "react-icons/fa6";

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

	
	async function APICall(){
		setLoading(true);
		try {
			const response = await axios.get(`http://localhost:5000/2fa/${membership_number.toLowerCase()}`);
			if (response.status === 201) {
				toast.success(response.data.message);
			}
		} catch {
			toast.error("Sem conexão com o servidor!");
			setLoading(false)
		}
		
	}

	async function resendEmail() {
		APICall()
	}

	async function submitForm(OTP: string) {
		setLoading(true)
		const result = await signIn('credentials', {
      email: email.toLowerCase(),
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
			console.log(response.data)
			if(response.data  === true) {
				router.replace("/set-access")
			}
			else if(response.data === false) {
				router.replace("/dashboard")
			}
			else {
				toast.warning("Um serviço está indisponível!")
			}
		}
		catch{
			toast.error("Sem conexão com o servidor")
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
									maxLength={1}
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
								disabled={loading || currentInput!==6}
								className="button_auth"

							>
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
