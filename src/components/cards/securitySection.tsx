"use client"

import useUserStore from "@/contexts/stores/userStore";
import api from "@/services/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaAngleLeft } from "react-icons/fa6";
import { IoIosArrowRoundForward } from "react-icons/io";
import { toast } from "sonner";
import { z } from "zod";
import InfoError from "../others/infoError";

const formSchema = z.object({
    code: z.string().min(1, "Introduza o código de acesso atual!"),
    accessCode: z.string().min(1, "Introduza o novo código de acesso!").max(6, "O código de acesso deve conter apenas 6 dígitos").regex(/^[0-9]{6}$/, "São aceites apenas números!"),
    confirmCode: z.string().min(1, "Confirme o novo código de acesso!").max(6, "O código de acesso deve conter apenas 6 dígitos").regex(/^[0-9]{6}$/, "São aceites apenas números!"),
    }).refine(data => data.accessCode === data.confirmCode, {
    message: "Os códigos de acesso não coincidem!",
    path: ["confirmCode"],
});

type formType = z.infer<typeof formSchema>

export default function SecuritySection() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const useStore = useUserStore()
    const [loading, setLoading] = useState(false)
    const {register, handleSubmit, formState: {errors}} = useForm<formType>({
        resolver: zodResolver(formSchema)
    })

    let email = ""
    if (typeof window !== "undefined") {
        email = localStorage.getItem("email") || useStore.email;
    }

    function APICall(data: string): Promise<string> {
		setLoading(true)
		// biome-ignore lint/suspicious/noAsyncPromiseExecutor: <explanation>
		return new Promise(async (resolve, reject) => {
			try {
				const response = await api.post("http://localhost:5000/privateResetAccessCode", data);
				if (response.status === 201) {
					resolve(response.data.message);
				}
				reject(response.data.message);
			} 
			catch {
				reject("Não foi possivel processar a sua solicitação! Verifique a sua conexão com a internet.");
			} 
			finally {
				setLoading(false)
			}
		});
	}

    async function submitForm(data: formType) {
		const { code, accessCode } = data;
		const formatedData = JSON.stringify({
            code,
			accessCode,
			email
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
      <div className="manageInfoContainer">
        <div
          className="top"
          onMouseDown={() => {useStore.updateValidation("options");}}>
          <button type="button">
              <FaAngleLeft />
          </button>
          <p>Segurança</p>
        </div>
        <div className="security bottom">
            <button type="button" onMouseDown={onOpen}>
                Alterar código de acesso <IoIosArrowRoundForward />
            </button>
            <button type="button">
                Alterar endereço de email <IoIosArrowRoundForward />
            </button>
        </div>
        {isOpen && (
            <Modal isOpen={isOpen} onClose={onClose} placement="top-center">
                <ModalContent>
                    <form onSubmit={handleSubmit(submitForm)}>
                        <ModalHeader className="flex flex-col gap-1">Alterar código de acesso</ModalHeader>
                        <ModalBody>

                            <Input
                                autoFocus
                                label="Código de acesso atual"
                                placeholder="Insira seu código de acesso atual"
                                type="password"
                                variant="flat"
                                onKeyDown={(event)=>{ if (event.key === 'e') event.preventDefault()}}
                                {...register("code")}
                            />
                            {errors.code && <InfoError message={errors.code.message}/>}
                            <Input
                                label="Novo código de acesso"
                                placeholder="Insira o novo código de acesso"
                                type="password"
                                variant="flat"
                                onKeyDown={(event)=>{ if (event.key === 'e') event.preventDefault()}}
                                {...register("accessCode")}
                            />
                            {errors.accessCode && <InfoError message={errors.accessCode.message}/>}
                            <Input
                                label="Confirme o novo código de acesso"
                                type="password"
                                variant="flat"
                                placeholder="Insira novamente o código criado"
                                {...register("confirmCode")}
                            />
                            {errors.confirmCode && <InfoError message={errors.confirmCode.message}/>}
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="flat" onPress={onClose} disabled={loading}>
                                Cancelar
                            </Button>
                            <Button color="primary" type="submit" disabled={loading}>
                                Confirmar alteração
                            </Button>
                        </ModalFooter>
                    </form>
                </ModalContent>
            </Modal>
        )}
        {isOpen && (
            <Modal isOpen={isOpen} onClose={onClose} placement="top-center">
                <ModalContent>
                    <form onSubmit={handleSubmit(submitForm)}>
                        <ModalHeader className="flex flex-col gap-1">Alterar código de acesso</ModalHeader>
                        <ModalBody>

                            <Input
                                autoFocus
                                label="Código de acesso atual"
                                placeholder="Insira seu código de acesso atual"
                                type="password"
                                variant="flat"
                                onKeyDown={(event)=>{ if (event.key === 'e') event.preventDefault()}}
                                {...register("code")}
                            />
                            {errors.code && <InfoError message={errors.code.message}/>}
                            <Input
                                label="Novo código de acesso"
                                placeholder="Insira o novo código de acesso"
                                type="password"
                                variant="flat"
                                onKeyDown={(event)=>{ if (event.key === 'e') event.preventDefault()}}
                                {...register("accessCode")}
                            />
                            {errors.accessCode && <InfoError message={errors.accessCode.message}/>}
                            <Input
                                label="Confirme o novo código de acesso"
                                type="password"
                                variant="flat"
                                placeholder="Insira novamente o código criado"
                                {...register("confirmCode")}
                            />
                            {errors.confirmCode && <InfoError message={errors.confirmCode.message}/>}
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="flat" onPress={onClose} disabled={loading}>
                                Cancelar
                            </Button>
                            <Button color="primary" type="submit" disabled={loading}>
                                Confirmar alteração
                            </Button>
                        </ModalFooter>
                    </form>
                </ModalContent>
            </Modal>
        )}

      </div>
    );
}
