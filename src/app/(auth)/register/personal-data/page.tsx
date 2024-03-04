"use client";

import InfoError from "@/components/others/infoError";
import useUserStore from "@/contexts/stores/userStore";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const FormSchema = z.object({
	name: z
		.string({
			required_error: "O campo não pode estar vazio!",
		})
		.min(1, "O campo não pode estar vazio!")
		.transform((name) => {
			return name
				.trim()
				.split(" ")
				.map((word) => {
					return word[0].toLocaleUpperCase().concat(word.substring(1));
				});
		}),
	birthDate: z
		.string()
		.refine(
			(value) => {
				const date = new Date(value);
				return !Number.isNaN(date.getTime());
			},
			{
				message:
					"A data de nascimento deve estar no formato válido (DD/MM/AAAA)",
				path: ["birthDate"],
			},
		)
		.transform((value) => {
			return new Date(value);
		}),

	biNumber: z
		.string({
			required_error: "O número do BI é obrigatório!",
		})
		.min(1, "O número do BI é obrigatório!")
		.regex(/^[0-9]{9}[A-Z|a-z]{2}[0-9]{3}$/, "Número do BI inválido!")
		.transform((phone) => {
			return phone.trim().toUpperCase();
		}),
});

type FormType = z.infer<typeof FormSchema>;

export default function PersonalData() {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const useStore = useUserStore();
	let email_address = "";
	if (typeof window !== "undefined") {
		email_address = localStorage.getItem("email") ?? "";
	}

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormType>({
		resolver: zodResolver(FormSchema),
	});

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
async  function APICall(data: any): Promise<any> {
		setLoading(true);
		// biome-ignore lint/suspicious/noAsyncPromiseExecutor: <explanation>
return  new Promise(async (resolve, reject) => {
			try {
				const response = await axios.post(
					"http://localhost:5000/personal-data",
					data,
					{ headers: { "Content-Type": "application/json" } },
				);
				if (response.status === 201) {
					resolve(response.data.message);
					router.push("/register/documentation");
				} else {
					reject(response.data.message);
				}
			} catch {
				reject("Erro interno! Tente novamente mais tarde.");
			} finally {
				setLoading(false);
			}
		});
	}

	async function submitForm(data: FormType) {
		const { name, birthDate, biNumber } = data;

		const parsedBirthDate = new Date(birthDate);

		const email = email_address ?? useStore.email;
		const formatedData = JSON.stringify({
			name,
			biNumber,
			email,
			birthDate: parsedBirthDate,
		});

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
		<form onSubmit={handleSubmit(submitForm)} className="login_form">
			<div className="header_form">
				<h1>Dados pessoais</h1>
				<p>
					Introduza os seus dados pessoais abaixo. Certifique-se de digitar as
					informações corretamente.
				</p>
			</div>
			<div className="body_form">
				<div className="input_field">
					<label htmlFor="name">Nome completo</label>
					<input
						type="text"
						placeholder="Insira o seu nome completo"
						{...register("name")}
					/>
					{errors.name && <InfoError message={errors.name.message} />}
				</div>
				<div className="input_field">
					<label htmlFor="email">Data de nascimento</label>
					<input
						type="date"
						placeholder="Insira a sua data de nascimento "
						{...register("birthDate")}
					/>
					{errors.birthDate && <InfoError message={errors.birthDate.message} />}
				</div>
				<div className="input_field">
					<label htmlFor="bi_number">Número do BI</label>
					<input
						type="text"
						placeholder="Insira o número do BI"
						{...register("biNumber")}
					/>
					{errors.biNumber && <InfoError message={errors.biNumber.message} />}
				</div>
				<button type="submit" disabled={loading} className="button_auth">
					Avançar
				</button>
			</div>
		</form>
	);
}
