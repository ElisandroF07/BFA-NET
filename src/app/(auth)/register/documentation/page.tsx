"use client";

import UploadCard from "@/components/cards/uploadCard";
import UploadCard2 from "@/components/cards/uploadCard2";
import Uploader from "@/components/cards/uploader";
import useStepsStore from "@/contexts/stores/stepsStore";
import useUserStore from "@/contexts/stores/userStore";
import "@/styles/upload.css";
import axios from "axios";
import * as faceapi from "face-api.js";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import Tesseract from "tesseract.js";
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

export default function Documentation() {
	const useStore = useUserStore();
	const router = useRouter();
	const stepsStore = useStepsStore();
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
	const [loading, setLoading] = useState(false);
	let email = "";

	useEffect(() => {
		stepsStore.setCurrent(1);
		stepsStore.setStep1(true);
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

	useEffect(() => {
		if (success) {
			toast.promise(uploadFront(), {
				loading: "Enviando a imagem do BI...",
				success: (data: any) => {
					return data;
				},
				error: (data: any) => {
					return data;
				},
			});
			toast.promise(uploadBack(), {
				loading: "Enviando a selfie...",
				success: (data: any) => {
					router.push("/register/identity");
					return data;
				},
				error: (data: any) => {
					return data;
				},
			});
		}
	}, [success]);

	if (typeof window !== "undefined") {
		email = localStorage.getItem("email") ?? "";
	}

	function compareBI(bi1: string, bi2: string) {
		console.log(bi1, bi2);
		if (bi1.toLocaleUpperCase() === bi2.toLocaleUpperCase()) return true;
		return false;
	}

	async function getBI() {
		const response = await axios.get(
			`http://localhost:5000/getBI/${email || useStore.email}`,
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
		return new Promise(async (resolve, reject) => {
			const response = await Tesseract.recognize(
				URL.createObjectURL(frontFile.file || new File([], "")),
			);
			const words = response.data.words;

			if (words) {
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
		let idCard;
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
				toast.error("A imagem do BI necessita ser nítida!");
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
				toast.error("Envie uma selfie mais nítida!");
				setLoading(false);
			}
		}

		if (idCard && idSelfie) {
			const distance = faceapi.euclideanDistance(
				idCard.descriptor,
				idSelfie.descriptor,
			);
			console.log(distance);
			if (distance < 0.4) {
				toast.success("Reconhecimento facial!");
				verify();
			} else {
				toast.warning("Envie imagens autênticas.");
				setLoading(false);
			}
		}
	}

	async function verify() {
		toast.promise(testRegex(regexBI), {
			loading: "Analisando BI...",
			success: (data: any) => {
				setSuccess(true);
				return data;
			},
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

	function uploadFront(): Promise<any> {
		setLoading(true);
		const formData = new FormData();
		if (frontFile.file) {
			formData.append("image", frontFile.file);
		}
		return new Promise(async (resolve, reject) => {
			try {
				const response = await axios.post(
					`http://localhost:5000/upload/${email ?? useStore.email}/1`,
					formData,
					{ headers: { "Content-Type": "multipart/form-data" } },
				);
				if (response.status === 200) {
					resolve(response.data.message);
				}
			} catch (error: any) {
				reject(error.response?.data.message);
			} finally {
				setLoading(false);
			}
		});
	}

	function uploadBack(): Promise<any> {
		setLoading(true);
		const formData = new FormData();
		if (backFile.file) {
			formData.append("image", backFile.file);
		}
		return new Promise(async (resolve, reject) => {
			try {
				const response = await axios.post(
					`http://localhost:5000/upload/${email ?? useStore.email}/5`,
					formData,
					{ headers: { "Content-Type": "multipart/form-data" } },
				);
				if (response.status === 200) {
					resolve(response.data.message);
				}
			} catch (error: any) {
				reject(error.response?.data.message);
			} finally {
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
				<h1>Documentação</h1>
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
								file={null}
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
								file={null}
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
					{loading ? <>Validando...</> : <>Avançar</>}
				</button>
			</div>
		</form>
	);
}
