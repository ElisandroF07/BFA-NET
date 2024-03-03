"use client";

import useStepsStore from "@/contexts/stores/stepsStore";
import useUserStore from "@/contexts/stores/userStore";
import "@/styles/credentials.css";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa6";
import { toast } from "sonner";
import picture from "../../../../../public/assets/images/Certification-bro.svg";

export default function PersonalData() {
	const router = useRouter();
	const stepsStore = useStepsStore();
	const useStore = useUserStore();
	const [loading, setLoading] = useState(false);
	let email_address = "";
	if (typeof window !== "undefined") {
		email_address = localStorage.getItem("email") ?? "";
	}

	async function APICall(): Promise<any> {
		setLoading(true);
		return new Promise(async (resolve, reject) => {
			try {
				const response = await axios.get(
					`http://localhost:5000/generateCredentials/${
						email_address || useStore.email
					}`,
				);
				if (response.status === 201) {
					resolve(response.data.message);
				} else {
					reject(response.data.message);
				}
			} catch {
				reject("Erro interno! Tente novamente mais tarde.");
				setLoading(false);
			}
		});
	}

	useEffect(() => {
		stepsStore.setCurrent(3);
		stepsStore.setStep1(true);
		stepsStore.setStep2(true);
		stepsStore.setStep3(true);
	}, []);

	function submitForm() {
		toast.promise(APICall(), {
			loading: "Gerando e enviando...",
			success: (data) => {
				router.replace("/login");
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
					{!loading ? (
						<>
							Obter credenciais{" "}
							<FaArrowRight
								style={{
									width: "20px",
									height: "20px",
									color: "var(--color-cards)",
									marginLeft: "10px",
								}}
							/>
						</>
					) : (
						<>Validando</>
					)}
				</button>
			</div>
		</form>
	);
}
