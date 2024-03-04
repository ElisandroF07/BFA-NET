"use client";

import useUserStore from "@/contexts/stores/userStore";
import "@/styles/globals.css";
import "@/styles/phone_verification.css";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import business from "../../../../../../public/assets/images/message.svg";

export default function Verification() {
	const [loading, setLoading] = useState(false);
	const useStore = useUserStore();

	let email = "";
	if (typeof window !== "undefined") {
		email = localStorage.getItem("email") ?? "";
	}

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function  APICall(): Promise<any> {
		setLoading(true);
		// biome-ignore lint/suspicious/noAsyncPromiseExecutor: <explanation>
return  new Promise(async(resolve, reject) => {
			try {
				const response = await axios.get(
					`http://localhost:5000/resendEmail/${email}`,
				);
				if (response.status === 201) {
					resolve(response.data.message);
				}
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
}  catch (error: any) {
				reject(error.response?.data.message);
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

	return (
		<div className="home_main">
			<div className="home_body">
				<div className="left">
					<Image src={business} alt="business" />
					<h1>Verifique a sua caixa de entrada</h1>
					<p>
						Acesse o seu email para verificá-lo ({email ?? useStore.email}).{" "}
					</p>
					<Link href={"/register"}>Clique aqui para corrigir o email</Link>
				</div>
				<div className="right">
					<form className="login_form">
						<div className="header_form">
							<h1>Verifique a sua caixa de entrada</h1>
							<p>
								Foi enviado um email para o seu endereço, acesse e verifique o
								seu email. <Link href={"/email"}>Corrigir email</Link>
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
