"use client";

import RegisterInfoModal from "@/components/modals/registerInfo";
import InfoError from "@/components/others/infoError";
import useUserStore from "@/contexts/stores/userStore";
import "@/styles/globals.css";
import "@/styles/phone.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDisclosure } from "@nextui-org/react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import business from "../../../../../public/assets/images/wellcome.svg";

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

export default function Email() {
	const router = useRouter();
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const useStore = useUserStore();
	const [loading, setLoading] = useState(false);

	const {
		register,
		formState: { errors },
		handleSubmit,
	} = useForm<FormType>({
		resolver: zodResolver(FormSchema),
	});

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function  APICall(data: FormType): Promise<any> {
		setLoading(true);
		const { email } = data;
		// biome-ignore lint/suspicious/noAsyncPromiseExecutor: <explanation>
return  new Promise(async (resolve, reject) => {
			try {
				const response = await axios.get(
					`http://localhost:5000/sendEmail/${email}`,
				);
				if (response.status === 201) {
					useStore.updateEmail(email);
					if (typeof window !== "undefined") {
						localStorage.setItem("email", email);
					}
					resolve(response.data.message);
					router.push("/email/verification");
				}
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
}  catch (error: any) {
				reject(error.response?.data.message);
			} finally {
				setLoading(false);
			}
		});
	}

	async function submitForm(data: FormType) {
		toast.promise(APICall(data), {
			loading: "Enviando...",
			success: (data) => {
				return data;
			},
			error: (data) => {
				return data;
			},
		});
	}

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
useEffect(() => onOpen(), []);

	return (
		<div className="home_main">
			<div className="home_body">
				<div className="left">
					<Image src={business} alt="business" />
					<h1>Seja bem-vindo à família</h1>
					<p>Crie uma conta e junte-se à essa maravilhosa comunidade.</p>
				</div>
				<div className="right">
					<form onSubmit={handleSubmit(submitForm)} className="login_form">
						<div className="header_form">
							<h1>Crie uma conta</h1>
							<p>
								Já tem uma conta? <Link href={"/login"}>Fazer login</Link>
							</p>
						</div>
						<div className="body_form">
							<div className="input_field">
								<label htmlFor="email">Endereço de email</label>
								<input
									type="email"
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
									Ao criar uma conta, você estará confirmando que leu e aceitou
									as nossas{" "}
									<Link href="/privacy-policies">
										Políticas de Privacidade e Termos de Uso
									</Link>
									.
								</p>
							</div>
						</div>
					</form>
					<p className="basic_text not_found_footer">
						© 2024 Banco de Fomento Angola
					</p>
				</div>
			</div>
			<RegisterInfoModal isOpen={isOpen} onOpenChange={onOpenChange} />
		</div>
	);
}
