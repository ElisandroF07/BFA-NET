"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import useUserStore from "@/contexts/stores/userStore";
import useStepsStore from "@/contexts/stores/stepsStore";
import UploadCard from "@/components/cards/uploadCard";
import Uploader from "@/components/cards/uploader";
import "@/styles/upload.css";
import axios from "axios";
import { TailSpin } from 'react-loader-spinner'

const MAX_FILE_SIZE: number = parseInt(process.env.MAX_FILE_SIZE ?? "5242880");
const ACCEPTED_IMAGE_TYPES = [
	"image/jpeg",
	"image/jpg",
	"image/webp",
	"image/png",
];

interface FileState {
	haveFile: boolean;
	type: string;
	name: string;
	size: number;
	file: File | null;
}

export default function Assign() {

	const useStore = useUserStore();
	const router = useRouter();
	const stepsStore = useStepsStore();
	const [loading, setLoading] = useState(false);
	const idCardRef = useRef<HTMLImageElement>(null);

	let email = "";
	if (typeof window !== "undefined") {
		email = localStorage.getItem("email") ?? useStore.email;
	}


	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		stepsStore.setCurrent(2);
		stepsStore.setStep1(true);
		stepsStore.setStep2(true);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const [selfie, setselfie] = useState<FileState>({
		haveFile: false,
		type: "",
		name: "",
		size: 0,
		file: null,
	});


	function validateForm(): boolean {
		if (!selfie.haveFile) {
			toast.warning("Faça upload da sua selfie");
			return false;
		}
		return true;
	}

	useEffect(() => {
		if (!selfie.haveFile) {
			const input = document.getElementById("i1") as HTMLInputElement;
			if (input) {
				input.value = "";
			} else {
				alert("Null");
			}
		} else {
		}
	}, [selfie.haveFile]);


	function uploadSelfie(): Promise<string> {
		setLoading(true);
		const formData = new FormData();
		if (selfie.file) {
			formData.append("image", selfie.file);
		}
		// biome-ignore lint/suspicious/noAsyncPromiseExecutor: <explanation>
		return new Promise(async (resolve, reject) => {
			try {
				const response = await axios.post(`https://bfa-nodejs-api.onrender.com/upload/${email ?? useStore.email}/4`, formData,{ headers: { "Content-Type": "multipart/form-data" } },);
				if (response.status === 200) {
					router.push("/register/credentials")
					resolve(response.data.message);

				}
				reject(response.data.message)
				setLoading(false);
			} 
			catch {
				reject("Sem conexão com o servidor!");
				setLoading(false);
			}
		});
	}

	function submitForm() {
		if (validateForm()) {
			toast.promise(uploadSelfie(), {
				loading: "Armazenando a imagem...",
				success: (data) => {
					return data;
				},
				error: (data) => {
					return data;
				},
			});
		} else {
			toast.warning("A imagem não foi enviada.");
		}
	}

	return (
		<form className="login_form identity_verification">
			<div className="header_form">
				<h1>Validação de assinatura</h1>
				<p>Faça upload de uma fotografia com a sua assinatura em uma folha de cor branca. </p>
			</div>
			<div className="body_form">
				<div className="uploaders_container">
					<div className="upload_container">
						<p className="simple_text">Foto com a assinatura</p>
						{selfie.haveFile ? (
							<Uploader
								fileName={selfie.name}
								fileSize={selfie.size.toString()}
								imageAlt="bi-frente"
								imageType={selfie.type.replace("image/", "").trim()}
								key={"uploader1"}
								imageRef={idCardRef}
								file={selfie.file || new File([], "")}
								handleClick={() =>
									setselfie({
										haveFile: false,
										type: "",
										name: "",
										size: 0,
										file: null,
									})
								}
							/>
						) : (
							<UploadCard
								inputId="i1"
								key={"upload_area2"}
								inputName="identityCardFrontImage"
								acceptedImageTypes={ACCEPTED_IMAGE_TYPES}
								maxFileSize={MAX_FILE_SIZE}
								setState={setselfie}
							/>
						)}
					</div>
				</div>
				<button
					type="button"
					disabled={loading}
					onClick={submitForm}
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
						'Validar'
					)}
				</button>
			</div>
		</form>
	);
}
