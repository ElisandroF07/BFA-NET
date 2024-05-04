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

interface IProps {
    biNumber: string
}

const formSchema = z.object({
    code: z.string().min(1, "Introduza o código de acesso atual!"),
    accessCode: z.string().min(1, "Introduza o novo código de acesso!").max(6, "O código de acesso deve conter apenas 6 dígitos").regex(/^[0-9]{6}$/, "São aceites apenas números!"),
    confirmCode: z.string().min(1, "Confirme o novo código de acesso!").max(6, "O código de acesso deve conter apenas 6 dígitos").regex(/^[0-9]{6}$/, "São aceites apenas números!"),
    }).refine(data => data.accessCode === data.confirmCode, {
    message: "Os códigos de acesso não coincidem!",
    path: ["confirmCode"],
});

const formSchemaEmail = z.object({
    accessCode: z.string().min(1, "Introduza o código de acesso!"),
    emailAddress: z.string().email("Introduza um endereço de email válido!"),
    confirmEmail: z.string().email("Introduza um endereço de email válido!"),
    }).refine(email => email.emailAddress === email.confirmEmail, {
    message: "Os endreços não coincidem!",
    path: ["confirmEmail"],
});

const formSchema2FA = z.object({
    otp: z.string().min(1, "Introduza o código de acesso!").max(6, "O código de acesso é constituido por apenas 6 dígitos!"),
})

type formType = z.infer<typeof formSchema>
type formTypeEmail = z.infer<typeof formSchemaEmail>
type formType2FA = z.infer<typeof formSchema2FA>

export default function SecuritySection({biNumber}: IProps) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isOpen2FA, onOpen: onOpen2FA, onClose: onClose2FA } = useDisclosure();
    const { isOpen: isEmailModalOpen, onOpen: onEmailModalOpen, onClose: onEmailModalClose } = useDisclosure();
    const [newEmail, setNewEmail] = useState("")
    const useStore = useUserStore()
    const [loading, setLoading] = useState(false)
    let email = ""
    if (typeof window !== "undefined") {
        email = localStorage.getItem("email") || useStore.email;
    }
    const {register, handleSubmit, formState: {errors}} = useForm<formType>({
        resolver: zodResolver(formSchema)
    })

    const {register: registerEmail, handleSubmit: handleSubmitEmail, formState: {errors: errorsEmail}} = useForm<formTypeEmail>({
        resolver: zodResolver(formSchemaEmail)
    })

    const {register: register2FA, handleSubmit: handleSubmit2FA, formState: {errors: errors2FA}} = useForm<formType2FA>({
        resolver: zodResolver(formSchema2FA)
    })

    async function APICall(data: string){
		setLoading(true)
			try {
				const response = await api.post("https://bfa-nodejs-api.onrender.com/privateResetAccessCode", data);
				if (response.status === 201) {
					toast.success(response.data.message);
				}
				else {
                    toast.error(response.data.message);
                }
			} 
			catch {
				toast.error("Sem conexão com o servidor!");
			} 
			finally {
				setLoading(false)
			}
		
	}

    async function submitForm(data: formType) {
		const { code, accessCode } = data;
		const formatedData = JSON.stringify({
            code,
			accessCode,
			email
		});
        APICall(formatedData)
	}

    async  function submitForm2FA(data: formType2FA) {
        const response = await api.get(`/check2FA/${data.otp}/${biNumber}`)
        if (response.data.valid) {
            const resp = await api.get(`/setEmail/${newEmail}/${biNumber}`)
            if (resp.status === 201) {
                toast.success("Endereço de email alterado com sucesso!")
                onEmailModalClose()
                onClose2FA()
            }
            else {
                toast.error("Occorreu um erro ao processar a sua solicitação! Tente novamente mais tarde.")
                onEmailModalClose()
                onClose2FA()
            }
        }
        else {
            toast.error("Código de verificação inválido!")
        }
    }

    async function submitFormEmail(data: formTypeEmail) {
        const body = JSON.stringify({
            accessCode: data.accessCode,
            biNumber
        })
       const response = await api.post("/checkAccessCode", body)
       if (response.data.valid) {
            const resp = await api.get(`/private2fa/${data.emailAddress}/${biNumber}`)
            if (resp.status === 201) {
                toast.success("Código de verificação enviado para o novo endereço de email")
                setNewEmail(data.emailAddress)
                onOpen2FA()
            }
            else {
                toast.error(resp.data.message)
            }
       }
       else {
        toast.error("Código de acesso incorreto!")
       }
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
            <button type="button" onMouseDown={onEmailModalOpen}>
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
                                type="password"
                                variant="flat"
                                onKeyDown={(event)=>{ if (event.key === 'e') event.preventDefault()}}
                                {...register("code")}
                            />
                            {errors.code && <InfoError message={errors.code.message}/>}
                            <Input
                                label="Novo código de acesso"
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
        {isEmailModalOpen && (
            <Modal isOpen={isEmailModalOpen} onClose={onEmailModalClose} placement="top-center">
                <ModalContent>
                    <form onSubmit={handleSubmitEmail(submitFormEmail)}>
                        <ModalHeader className="flex flex-col gap-1">Alterar endereço de email</ModalHeader>
                        <ModalBody>
                            <Input
                                autoFocus
                                label="Insira o novo endereço de email"
                                type="text"
                                variant="flat"
                                {...registerEmail("emailAddress")}
                            />
                            {errorsEmail.emailAddress && <InfoError message={errorsEmail.emailAddress.message}/>}
                            <Input
                                label="Confirme o novo email"
                                type="text"
                                variant="flat"
                                {...registerEmail("confirmEmail")}
                            />
                            {errorsEmail.confirmEmail && <InfoError message={errorsEmail.confirmEmail.message}/>}
                            <Input
                                label="Código de acesso"
                                type="number"
                                variant="flat"
                                onKeyDown={(event)=>{ if (event.key === 'e') event.preventDefault()}}
                                {...registerEmail("accessCode")}
                            />
                            {errorsEmail.accessCode && <InfoError message={errorsEmail.accessCode.message}/>}
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="flat" onPress={onEmailModalClose} disabled={loading}>
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
        {isOpen2FA && (
            <Modal isOpen={isOpen2FA} onClose={onClose2FA} placement="top-center">
                <ModalContent>
                    <form onSubmit={handleSubmit2FA(submitForm2FA)}>
                        <ModalHeader className="flex flex-col gap-1">Verificação de email</ModalHeader>
                        <ModalBody>
                            <Input
                                autoFocus
                                label="Insira o código enviado para o seu email"
                                type="number"
                                onKeyDown={(event)=>{ if (event.key === 'e') event.preventDefault()}}
                                variant="flat"
                                {...register2FA("otp")}
                            />
                            {errors2FA.otp && <InfoError message={errors2FA.otp.message}/>}
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="flat" onPress={onClose2FA} disabled={loading}>
                                Cancelar
                            </Button>
                            <Button color="primary" type="submit" disabled={loading}>
                                Verificar
                            </Button>
                        </ModalFooter>
                    </form>
                </ModalContent>
            </Modal>
        )}

      </div>
    );
}
