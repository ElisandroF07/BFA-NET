"use client";

import UploadCard from "@/components/cards/uploadCard";
import Uploader from "@/components/cards/uploader";
import useStepsStore from "@/contexts/stores/stepsStore";
import useUserStore from "@/contexts/stores/userStore";
import "@/styles/upload.css";
import axios from "axios";
import * as faceapi from "face-api.js";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

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

export default function IdentityValidation() {
	const useStore = useUserStore();
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const idCardRef = useRef<HTMLImageElement>(null);
	const selfieRef = useRef<HTMLImageElement>(null);
	let email = "";
	if (typeof window !== "undefined") {
		email = localStorage.getItem("email") ?? "";
	}
	const stepsStore = useStepsStore();

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
useEffect(() => {
		stepsStore.setCurrent(2);
		stepsStore.setStep1(true);
		stepsStore.setStep2(true);

		(async () => {
			await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
			await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
			await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
			await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
			await faceapi.nets.faceExpressionNet.loadFromUri("/models");
			// biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
let  idCard;
			// biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
let  idSelfie;
			if (idCardRef.current) {
				const idCardFacedetection = await faceapi
					.detectSingleFace(
						idCardRef.current,
						new faceapi.TinyFaceDetectorOptions(),
					)
					.withFaceLandmarks()
					.withFaceDescriptor();
				idCard = idCardFacedetection;
			}

			if (selfieRef.current) {
				const selfieFacedetection = await faceapi
					.detectSingleFace(
						selfieRef.current,
						new faceapi.TinyFaceDetectorOptions(),
					)
					.withFaceLandmarks()
					.withFaceDescriptor();
				idSelfie = selfieFacedetection;
			}

			if (idCard && idSelfie) {
				const distance = faceapi.euclideanDistance(
					idCard.descriptor,
					idSelfie.descriptor,
				);
				console.log(distance);
			}
		})();
	}, []);

	const [selfie, setselfie] = useState<FileState>({
		haveFile: false,
		type: "",
		name: "",
		size: 0,
		file: null,
	});
	const [selfieWithBI, setselfieWithBI] = useState<FileState>({
		haveFile: false,
		type: "",
		name: "",
		size: 0,
		file: null,
	});

	function validateForm(): boolean {
		if (!selfie.haveFile && !selfieWithBI.haveFile) {
			toast.warning("Faça upload das imagens para continuar!");
			return false;
		}
		if (!selfie.haveFile) {
			toast.warning("Faça upload da sua selfie");
			return false;
		}
		if (!selfieWithBI.haveFile) {
			toast.warning("Faça upload da sua selfie segurando o BI!");
			return false;
		}
		return true;
	}

	useEffect(() => {
		if (!selfieWithBI.haveFile) {
			const input = document.getElementById("i2") as HTMLInputElement;
			if (input) {
				input.value = "";
			} else {
				alert("Null");
			}
		} else {
		}
	}, [selfieWithBI.haveFile]);

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

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function  uploadSelfie(): Promise<any> {
		setLoading(true);
		const formData = new FormData();
		if (selfie.file) {
			formData.append("image", selfie.file);
		}
		// biome-ignore lint/suspicious/noAsyncPromiseExecutor: <explanation>
return  new Promise(async (resolve, reject) => {
			try {
				const response = await axios.post(
					`http://localhost:5000/upload/${email ?? useStore.email}/4`,
					formData,
					{ headers: { "Content-Type": "multipart/form-data" } },
				);
				if (response.status === 200) {
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

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function  uploadSelfieBI(): Promise<any> {
		setLoading(true);
		const formData = new FormData();
		if (selfieWithBI.file) {
			formData.append("image", selfieWithBI.file);
		}
		// biome-ignore lint/suspicious/noAsyncPromiseExecutor: <explanation>
return  new Promise(async (resolve, reject) => {
			try {
				const response = await axios.post(
					`http://localhost:5000/upload/${email ?? useStore.email}/2`,
					formData,
					{ headers: { "Content-Type": "multipart/form-data" } },
				);
				if (response.status === 200) {
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

	function submitForm() {
		if (validateForm()) {
			toast.promise(uploadSelfie(), {
				loading: "Enviando...",
				success: (data) => {
					return data;
				},
				error: (data) => {
					return data;
				},
			});
			toast.promise(uploadSelfieBI(), {
				loading: "Enviando...",
				success: (data) => {
					router.push("/register/credentials");
					return data;
				},
				error: (data) => {
					return data;
				},
			});
		} else {
			toast.warning("As imagens não foram enviadas.");
		}
	}

	return (
		<form className="login_form identity_verification">
			<div className="header_form">
				<h1>Validação de identidade</h1>
				<p>Faça upload das fotografias solicitadas abaixo. </p>
			</div>
			<div className="body_form">
				<div className="uploaders_container">
					<div className="upload_container">
						<p className="simple_text">Selfie com BI</p>
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
								file={null}
							/>
						)}
					</div>
					<div className="upload_container">
						<p className="simple_text">Verso do BI</p>
						{selfieWithBI.haveFile ? (
							<Uploader
								fileName={selfieWithBI.name}
								fileSize={selfieWithBI.size.toString()}
								imageAlt="bi-verso"
								imageType={selfieWithBI.type.replace("image/", "").trim()}
								key={2}
								imageRef={selfieRef}
								file={selfieWithBI.file || new File([], "")}
								handleClick={() =>
									setselfieWithBI({
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
								inputId="i2"
								key={"upload_area2"}
								inputName="identityCardBackImage"
								acceptedImageTypes={ACCEPTED_IMAGE_TYPES}
								maxFileSize={MAX_FILE_SIZE}
								setState={setselfieWithBI}
								file={null}
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
					Avançar
				</button>
			</div>
		</form>
	);
}
