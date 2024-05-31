/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import * as faceapi from "face-api.js";
import Tesseract from "tesseract.js";
import useUserStore from "@/contexts/stores/userStore";
import useStepsStore from "@/contexts/stores/stepsStore";
import UploadCard from "@/components/cards/uploadCard";
import UploadCard2 from "@/components/cards/uploadCard2";
import Uploader from "@/components/cards/uploader";
import "@/styles/upload.css";
import { TailSpin } from 'react-loader-spinner'

const MAX_FILE_SIZE: number = parseInt(process.env.MAX_FILE_SIZE ?? "5242880");
const regexBI = /^[0-9]{9}[A-Z]{2}[0-9]{3}$/;
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
	const stepsStore = useStepsStore();
	const [loading, setLoading] = useState(false);
	const idCardRef = useRef<HTMLImageElement>(null);
	const selfieRef = useRef<HTMLImageElement>(null);
	const [success, setSuccess] = useState(false);
	const [frontFile, setFrontFile] = useState<FileState>({
		haveFile: false,
		type: "",
		name: "",
		size: 0,
		file: null,
	});
	const [backFile, setBackFile] = useState<FileState>({
		haveFile: false,
		type: "",
		name: "",
		size: 0,
		file: null,
	});

	let email = "";
	if (typeof window !== "undefined") {
		email = localStorage.getItem("email") ?? useStore.email
	}

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		stepsStore.setCurrent(2);
		stepsStore.setStep1(true);
		stepsStore.setStep2(true);
	}, []);

	useEffect(() => {
		if (!backFile.haveFile) {
			const input = document.getElementById("i2") as HTMLInputElement;
			if (input) {
				input.value = "";
			} else {
				alert("Null");
			}
		} else {
		}
	}, [backFile.haveFile]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const filePath = URL.createObjectURL(frontFile.file || new File([], ""));

		if (!frontFile.haveFile) {
			const input = document.getElementById("i1") as HTMLInputElement;
			if (input) {
				input.value = "";
			} else {
				alert("Null");
			}
		} else {
		}
	}, [frontFile.haveFile]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (success) {
			toast.promise(uploadFront(), {
				loading: "Armazenando a imagem do BI...",
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				success: (data: any) => {
					return data;
				},
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				error: (data: any) => {
					return data;
				},
			});
			toast.promise(uploadBack(), {
				loading: "Armazenando a selfie...",
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				success: (data: any) => {
					router.push("/register/credentials");
					return data;
				},
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				error: (data: any) => {
					return data;
				},
			});
		}
	}, [success]);

	function compareBI(bi1: string, bi2: string) {
		if (bi1.toLocaleUpperCase() === bi2.toLocaleUpperCase()) {
			return true;
		}
		return false;
	}

	async function getBI() {
		const response = await axios.get(
			`https://maximum-janith-franco07-5ccaf5a9.koyeb.app/getBI/${email || useStore.email}`,
		);
		if (response.data.biNumber) {
			return response.data.biNumber;
		}
		return null;
	}

	function testRegex(regex: RegExp) {
		setLoading(true);
		let biNumber = "";
		let scanned = false;
		// biome-ignore lint/suspicious/noAsyncPromiseExecutor: <explanation>
		return new Promise(async (resolve, reject) => {
			const response = await Tesseract.recognize(
				URL.createObjectURL(frontFile.file || new File([], "")),
			);
			const words = response.data.words;

			if (words) {
				// biome-ignore lint/complexity/noForEach: <explanation>
				words.forEach(async (word) => {
					if (regexBI.test(word.text)) {
						biNumber = word.text;
						scanned = true;
					}
				});
			} else {
				toast.error("Envie uma imagem do seu BI");
				setLoading(false);
			}

			if (scanned) {
				const response = await getBI();
				if (response) {
					const isSame = compareBI(response, biNumber);
					if (isSame) {
						resolve("BI validado com sucesso!");
					} else {
						reject("BI Diferente!");
					}
				} else {
					reject("Não foi possível verificar o seu BI!");
				}
			} else {
				reject("Não foi possível validar o seu BI!");
			}
			setLoading(false);
		});
	}

	async function validateFaces() {
		setLoading(true);
		await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
		await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
		await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
		await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
		await faceapi.nets.faceExpressionNet.loadFromUri("/models");
		// biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
		let idCard;
		// biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
		let idSelfie;

		if (idCardRef.current) {
			const idCardFacedetection = await faceapi
				.detectSingleFace(
					idCardRef.current,
					new faceapi.TinyFaceDetectorOptions(),
				)
				.withFaceLandmarks()
				.withFaceDescriptor();
			idCard = idCardFacedetection;
			if (!idCardFacedetection) {
				toast.error("Não foi possivel validar a imagem do BI enviada!", {description: "Tente enviar outra com melhor visibilidade."});
				setLoading(false);
			}
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
			if (!idSelfie) {
				toast.error("Não foi possivel validar a selfie enviada!", {description: "Tente enviar outra com melhor visibilidade."});
				setLoading(false);
			}
		}

		if (idCard && idSelfie) {
			const distance = faceapi.euclideanDistance(
				idCard.descriptor,
				idSelfie.descriptor,
			);
			if (distance < 0.5) {
				toast.success("Validação facial concluida!");
				verify();
			} else {
				toast.warning("Não foi possivel validar as imagens enviadas.");
				setLoading(false);
			}
		}
	}

	async function verify() {
		toast.promise(testRegex(regexBI), {
			loading: "Analisando o Bilhete de Identidade...",
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			success: (data: any) => {
				setSuccess(true);
				return data;
			},
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			error: (data: any) => {
				return data;
			},
		});
	}

	function validateForm(): boolean {
		if (!frontFile.haveFile && !backFile.haveFile) {
			toast.error("Faça upload das imagens para continuar!");
			return false;
		}
		if (!frontFile.haveFile) {
			toast.error("Faça upload da parte frontal do BI!");
			return false;
		}
		if (!backFile.haveFile) {
			toast.error("Faça upload da sua selfie pessoal!");
			return false;
		}
		return true;
	}

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	function uploadFront(): Promise<any> {
		setLoading(true);
		const formData = new FormData();
		if (frontFile.file) {
			formData.append("image", frontFile.file);
		}
		// biome-ignore lint/suspicious/noAsyncPromiseExecutor: <explanation>
		return new Promise(async (resolve, reject) => {
			try {
				const response = await axios.post(
					`https://maximum-janith-franco07-5ccaf5a9.koyeb.app/upload/${email ?? useStore.email}/1`,
					formData,
					{ headers: { "Content-Type": "multipart/form-data" } },
				);
				if (response.status === 200) {
					resolve(response.data.message);
				}
				else {
					reject(response.data.message)
					setLoading(false);
				}
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			} catch (error: any) {
				reject(error.response?.data.message);
				setLoading(false);
			} 
		});
	}

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	function uploadBack(): Promise<any> {
		setLoading(true);
		const formData = new FormData();
		if (backFile.file) {
			formData.append("image", backFile.file);
		}
		// biome-ignore lint/suspicious/noAsyncPromiseExecutor: <explanation>
		return new Promise(async (resolve, reject) => {
			try {
				const response = await axios.post(
					`https://maximum-janith-franco07-5ccaf5a9.koyeb.app/upload/${email ?? useStore.email}/5`,
					formData,
					{ headers: { "Content-Type": "multipart/form-data" } },
				);
				if (response.status === 200) {
					resolve(response.data.message);
				}
				else {
					reject(response.data.message);
					setLoading(false);
				}
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			} catch (error: any) {
				reject(error.response?.data.message);
				setLoading(false);
			}
		});
	}

	async function formSubmit() {
		if (validateForm()) {
			await validateFaces();
		} else {
		}
	}

	return (
		<form className="login_form identity_verification">
			<div className="header_form">
				<h1>Validação de identidade</h1>
				<p>Faça upload das imagens abaixo. </p>
			</div>
			<div className="body_form">
				<div className="uploaders_container">
					<div className="upload_container">
						<p className="simple_text">Bilhete de Identidade</p>
						{frontFile.haveFile ? (
							<Uploader
								fileName={frontFile.name}
								fileSize={frontFile.size.toString()}
								imageAlt="bi-frente"
								imageType={frontFile.type.replace("image/", "").trim()}
								key={"1"}
								file={frontFile.file || new File([], "")}
								imageRef={idCardRef}
								handleClick={() =>
									setFrontFile({
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
								key={"upload_area1"}
								inputName="image"
								acceptedImageTypes={ACCEPTED_IMAGE_TYPES}
								maxFileSize={MAX_FILE_SIZE}
								setState={setFrontFile}
							/>
						)}
					</div>
					<div className="upload_container">
						<p className="simple_text">Selfie pessoal</p>
						{backFile.haveFile ? (
							<Uploader
								fileName={backFile.name}
								fileSize={backFile.size.toString()}
								imageAlt="bi-verso"
								imageType={backFile.type.replace("image/", "").trim()}
								key={2}
								file={backFile.file || new File([], "")}
								imageRef={selfieRef}
								handleClick={() =>
									setBackFile({
										haveFile: false,
										type: "",
										name: "",
										size: 0,
										file: null,
									})
								}
							/>
						) : (
							<UploadCard2
								inputId="i2"
								key={"upload_area2"}
								inputName="image"
								acceptedImageTypes={ACCEPTED_IMAGE_TYPES}
								maxFileSize={MAX_FILE_SIZE}
								setState={setBackFile}
							/>
						)}
					</div>
				</div>
				<button
					type="button"
					disabled={loading}
					onClick={formSubmit}
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
