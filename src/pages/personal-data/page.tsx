/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InfoError from "@/components/others/infoError";
import useUserStore from "@/contexts/stores/userStore";
import { TailSpin } from 'react-loader-spinner'
import useStepsStore from "@/contexts/stores/stepsStore";
import api from "@/services/api";

const FormSchema = z.object({
	name: z.string({required_error: "O campo não pode estar vazio!"})
		.min(1, "O campo não pode estar vazio!")
		.transform((name) => {
			return name
				.trim()
				.split(" ")
				.map((word) => {return word[0].toLocaleUpperCase().concat(word.substring(1));});
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

const FormSchema2 = z.object({
	name: z.string({required_error: "O campo não pode estar vazio!"})
		.min(1, "O campo não pode estar vazio!")
		.transform((name) => {
			return name
				.trim()
				.split(" ")
				.map((word) => {return word[0].toLocaleUpperCase().concat(word.substring(1));});
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
	local: z.string({required_error: "O campo é obrigatório!"})
		.min(1, "O campo é obrigatório!"),
	area: z.string({required_error: "O campo é obrigatório!"})
		.min(1, "O campo é obrigatório!")
});

type FormType = z.infer<typeof FormSchema>;
type FormType2 = z.infer<typeof FormSchema2>;

export default function PersonalData() {

	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const useStore = useUserStore();
	const useSteps = useStepsStore()
	let email_address = "";
	let account_type = "";
	if (typeof window !== "undefined") {
		email_address = localStorage.getItem("email")  || ""
		account_type = localStorage.getItem("accountType") || ""
	}

	useEffect(()=>{
		useSteps.setCurrent(1)
		useSteps.setStep1(true)
	}, [])

	const {register, handleSubmit, formState: { errors }} = useForm<FormType>({
		resolver: zodResolver(FormSchema),
	});

	const {register: register2, handleSubmit: handleSubmit2, formState: { errors: errors2 }} = useForm<FormType2>({
		resolver: zodResolver(FormSchema2),
	});

	async function APICall(data: any) {
		setLoading(true);
			try {
				const response = await api.post("/personal-data", data);
				if (response.status === 201) {
					router.push("/register/identity-validation");
					toast.success(response.data.message);
				} 
				else {
					toast.error(response.data.message);
					setLoading(false);
				}
			} catch {
				toast.error("Sem conexão com o servidor!");
				setLoading(false);
			} 
	}

	async function submitForm(data: FormType) {
		const parsedBirthDate = new Date(data.birthDate);
		const email = email_address ?? useStore.email;
		const formatedData = JSON.stringify({
			name: data.name,
			biNumber: data.biNumber,
			email,
			birthDate: parsedBirthDate,
		});

		APICall(formatedData)
	}

	async function submitForm2(data: FormType2) {
		const parsedBirthDate = new Date(data.birthDate);
		const email = email_address ?? useStore.email;
		const formatedData = JSON.stringify({
			name: data.name,
			biNumber: data.biNumber,
			email,
			birthDate: parsedBirthDate,
		});
		if (typeof window !== "undefined") {
			localStorage.setItem("local", data.local)
			localStorage.setItem("area", data.area)
		}
		APICall(formatedData)
	}

	return account_type === "c1" ? 
		(<form onSubmit={handleSubmit(submitForm)} className="login_form">
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
						'Enviar dados'
					)}
				</button>
			</div>
		</form> )
		: 
		(<form onSubmit={handleSubmit2(submitForm2)} className="login_form">
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
						{...register2("name")}
					/>
					{errors2.name && <InfoError message={errors2.name.message} />}
				</div>
				<div className="input_field">
					<label htmlFor="email">Data de nascimento</label>
					<input
						type="date"
						placeholder="Insira a sua data de nascimento "
						{...register2("birthDate")}
					/>
					{errors2.birthDate && <InfoError message={errors2.birthDate.message} />}
				</div>
				<div className="input_field">
					<label htmlFor="bi_number">Número do BI</label>
					<input
						type="text"
						placeholder="Insira o número do BI"
						{...register2("biNumber")}
					/>
					{errors2.biNumber && <InfoError message={errors2.biNumber.message} />}
				</div>
				<div className="input_field">
					<label htmlFor="bi_number">Área de atividade</label>
					<input
						type="text"
						placeholder="Insira a área de atividade do seu negócio"
						{...register2("area")}
					/>
					{errors2.area && <InfoError message={errors2.area.message} />}
				</div>
				<div className="input_field">
					<label htmlFor="bi_number">Local do estabelecimento</label>
					<input
						type="text"
						placeholder="Insira o local do seu estabelecimento"
						{...register2("local")}
					/>
					{errors2.local && <InfoError message={errors2.local.message} />}
				</div>
				<button type="submit" disabled={loading} className="button_auth">
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
						'Enviar dados'
					)}
				</button>
			</div>
		</form>)

}
