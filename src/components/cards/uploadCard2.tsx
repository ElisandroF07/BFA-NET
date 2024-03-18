"use client"

import { ChangeEventHandler, Dispatch, DragEventHandler, SetStateAction } from "react";
import { IoCloudUpload } from "react-icons/io5";
import { toast } from "sonner";

interface IProps {
  inputId: string;
  inputName: string;
  maxFileSize: number;
  acceptedImageTypes: string[];
  setState: Dispatch<SetStateAction<{
    haveFile: boolean;
    type: string;
    name: string;
    size: number;
    file: File | null;
  }>>;
}

export default function UploadCard2({
  inputId,
  inputName,
  maxFileSize,
  acceptedImageTypes,
  setState,
}: IProps) {
  const handleFileUpload = (file: File) => {
    if (!acceptedImageTypes.includes(file.type)) {
      toast.error("Formato não suportado!", {
        description: "São aceites os formatos: PNG, JPEG, JPEG e WEBP",
      });
      return;
    }
    if (file.size > maxFileSize) {
      toast.error("O tamanho máximo do ficheiro é 5MB!");
      return;
    }
    setState({
      haveFile: true,
      name: file.name,
      size: file.size,
      type: file.type,
      file: file,
    });
    toast.success("Upload concluído!");
  };

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const input = event.currentTarget as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      handleFileUpload(input.files[0]);
    }
  };

  const handleDrop: DragEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
    const uploadArea = event.currentTarget as HTMLDivElement;
    const input = uploadArea.querySelector(".input_file") as HTMLInputElement;
    uploadArea.classList.remove("ondrag");
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      handleFileUpload(event.dataTransfer.files[0]);
      input.files = event.dataTransfer.files;
    }
  };

  return (
    <div
      className="upload_card"
      onMouseDown={(event) => {
        const uploadArea = event.currentTarget as HTMLDivElement;
        const input = uploadArea.querySelector(".input_file") as HTMLInputElement;
        input.click();
      }}
      onDragOver={(event) => {
        event.preventDefault();
        const uploadArea = event.currentTarget as HTMLDivElement;
        uploadArea.classList.add("ondrag");
      }}
      onDragLeave={(event) => {
        event.preventDefault();
        const uploadArea = event.currentTarget as HTMLDivElement;
        uploadArea.classList.remove("ondrag");
      }}
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
