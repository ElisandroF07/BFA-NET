"use client";

import {
	ChangeEventHandler,
	Dispatch,
	DragEventHandler,
	SetStateAction,
} from "react";
import { IoCloudUpload } from "react-icons/io5";
import { toast } from "sonner";

interface IProps {
	inputId: string;
	inputName: string;
	maxFileSize: number;
	file: File | null;
	acceptedImageTypes: string[];
	setState: Dispatch<
		SetStateAction<{
			haveFile: boolean;
			type: string;
			name: string;
			size: number;
			file: File | null;
		}>
	>;
}

export default function UploadCard2({
	inputId,
	inputName,
	maxFileSize,
	acceptedImageTypes,
	setState,
}: IProps) {
	function handleClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
		const uploadArea = event.currentTarget as HTMLDivElement;
		const input = uploadArea.querySelector(".input_file") as HTMLInputElement;
		input.click();
	}

	function handleDragOver(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
		event.preventDefault();
		const uploadArea = event.currentTarget as HTMLDivElement;
		uploadArea.classList.add("ondrag");
	}

	function handleDragLeave(
		event: React.MouseEvent<HTMLDivElement, MouseEvent>,
	) {
		event.preventDefault();
		const uploadArea = event.currentTarget as HTMLDivElement;
		uploadArea.classList.remove("ondrag");
	}

	const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
		const input = event.currentTarget as HTMLInputElement;
		if (input.files && input.files.length > 0) {
			const file = input.files[0];
			if (!acceptedImageTypes.includes(file.type)) {
				toast.error("Formato não suportado!", {
					description: "São aceites os formatos: PNG, JPEG, JPEG e WEBP",
				});
				input.value = "";
			} else if (file.size > maxFileSize) {
				toast.error("O tamanho máximo do ficheiro é 5MB!");
				input.value = "";
			} else {
				setState({
					haveFile: true,
					name: file.name,
					size: file.size,
					type: file.type,
					file: input.files[0],
				});
				toast.success("Upload concluido!");
			}
		}
	};

	const handleDrop: DragEventHandler<HTMLDivElement> = (event) => {
		event.preventDefault();
		const uploadArea = event.currentTarget as HTMLDivElement;
		const input = uploadArea.querySelector(".input_file") as HTMLInputElement;
		uploadArea.classList.remove("ondrag");
		if (event.dataTransfer && event.dataTransfer.files.length > 0) {
			const file = event.dataTransfer.files[0];
			if (!acceptedImageTypes.includes(file.type)) {
				toast.error("Formato não suportado!", {
					description: "São aceites os formatos: PNG, JPEG, JPEG e WEBP",
				});
				input.value = "";
			} else if (file.size > maxFileSize) {
				toast.error("O tamanho máximo do ficheiro é 5MB!");
				input.value = "";
			} else {
				if (input.id === "i1") {
					console.log("i1 passou!");
				} else {console.log("i2 passou!")};
				input.files = event.dataTransfer.files;
				setState({
					haveFile: true,
					name: file.name,
					size: file.size,
					type: file.type,
					file: input.files[0],
				});
				toast.success("Upload concluido!");
			}
		}
	};

	return (
		// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
<div
			className="upload_card"
			onClick={handleClick}
			onDragOver={handleDragOver}
			onDragLeave={handleDragLeave}
			onDrop={handleDrop}
		>
			<IoCloudUpload className="iconOutButton" />
			<p className="simple_text">
				Arraste e solte o seu arquivo ou clique <br /> para fazer upload.
			</p>
			<p className="simple_text small">Large aqui</p>
			<input
				type="file"
				name={inputName}
				className="input_file"
				id={inputId}
				onChange={handleChange}
				accept="image/*"
				capture="user"
			/>
		</div>
	);
}
