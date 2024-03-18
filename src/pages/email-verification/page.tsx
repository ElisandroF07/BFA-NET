"use client";

import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import useUserStore from "@/contexts/stores/userStore";
import "@/styles/globals.css";
import "@/styles/phone_verification.css";
import business from "@/assets/images/message.svg";
import { useRouter } from "next/navigation";

export default function EmailVerification() {
	const [loading, setLoading] = useState(false);
	const useStore = useUserStore();
	const router = useRouter()

	let email = "";
	if (typeof window !== "undefined") {
		email = localStorage.getItem("email") ?? useStore.email
	}

	function APICall(): Promise<string> {
		setLoading(true);
		// biome-ignore lint/suspicious/noAsyncPromiseExecutor: <explanation>
		return new Promise(async (resolve, reject) => {
			try {
				const response = await axios.get(`http://localhost:5000/resendEmail/${email}`,);
				if (response.status === 201) {
					resolve(response.data.message);
				}
				reject(response.data.message)
			} 
			catch {
				reject("Não foi possivel processar a sua solicitação! Vertifique a sua coenxão com a internet.");
			} 
			finally {
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

	return (
		<div className="home_main">
			<div className="home_body">
				<div className="left">
					<Image src={business} alt="business" />
					<h1>Verifique a sua caixa de entrada</h1>
					<p>
						Acesse o seu email para verificá-lo ({email ?? useStore.email}).{" "}
					</p>
					<Link onMouseDown={(event)=>{
									event.preventDefault()
									router.back()
								}} href={""}>Corrigir email</Link>
				</div>
				<div className="right">
					<form className="login_form">
						<div className="header_form">
							<h1>Verifique a sua caixa de entrada</h1>
							<p>
								Foi enviado um email para o seu endereço, acesse e verifique o
								seu email. <Link onMouseDown={(event)=>{
									event.preventDefault()
									router.back()
								}} href={""}>Corrigir email</Link>
							</p>
						</div>
						<div className="body_form">
							<button
								type="button"
								onClick={resendEmail}
								disabled={loading}
								className="button_auth"
							>
								Reenviar
							</button>
							<div className="terms">
								<p>Verifique o seu correio eletrônico.</p>
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