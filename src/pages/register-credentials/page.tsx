"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FaArrowRight } from "react-icons/fa6";
import Image from "next/image";
import useStepsStore from "@/contexts/stores/stepsStore";
import useUserStore from "@/contexts/stores/userStore";
import "@/styles/credentials.css";
import picture from "@/assets/images/Certification-bro.svg";
import api from "@/services/api";
import { TailSpin } from 'react-loader-spinner'

export default function RegisterCredentials() {
	const router = useRouter();
	const stepsStore = useStepsStore();
	const useStore = useUserStore();
	const [loading, setLoading] = useState(false);

	let email_address = "";
	if (typeof window !== "undefined") {
		email_address = localStorage.getItem("email") ?? useStore.email
	}

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		stepsStore.setCurrent(3);
		stepsStore.setStep1(true);
		stepsStore.setStep2(true);
		stepsStore.setStep3(true);
	}, []);

	async function APICall(): Promise<string> {
		setLoading(true);
		// biome-ignore lint/suspicious/noAsyncPromiseExecutor: <explanation>
		return new Promise(async (resolve, reject) => {
			try {
				const response = await api.get(`http://localhost:5000/generateCredentials/${email_address}`);
				if (response.status === 201) {
					router.replace("/login")
					resolve(response.data.message);
				} else {
					reject(response.data.message);
				}
			} 
			catch {
				reject("Não foi possivel processar a sua solicitação! Verifique a sua conexão com a internet.");
				setLoading(false);
			}
		});
	}

	function submitForm() {
		toast.promise(APICall(), {
			loading: "Gerando e enviando...",
			success: (data) => {
				return data;
			},
			error: (data) => {
				return data;
			},
		});
	}

	return (
		<form className="login_form">
			<div className="header_form">
				<h1>Credenciais</h1>
				<p>Obrigado por aguardar, estamos finalizando o processo.</p>
			</div>
			<div className="body_form">
				<div className="container_body">
					<Image src={picture} alt="" />
					<h1>Finalizando! </h1>
					<p>
						Estamos gerando as suas credenciais de acesso ao BFA NET. As
						credenciais serão enviadas para o seu email, posteriormente poderá
						alterá-las.
					</p>
				</div>
				<button
					type="button"
					onClick={submitForm}
					disabled={loading}
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
						'Obter credenciais'
					)}
				</button>
			</div>
		</form>
	);
}
