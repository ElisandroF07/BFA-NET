import { z } from "zod";
import InfoError from "../others/infoError";
import { useForm } from "react-hook-form";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { TailSpin } from "react-loader-spinner";

const formSchema2FA = z.object({
    otp: z.string().min(1, "Introduza o código de acesso!").max(6, "O código de acesso é constituido por apenas 6 dígitos!"),
})

type formType2FA = z.infer<typeof formSchema2FA>

export default function TwoFAModal({submitForm2FA, isOpen2FA, onOpen2FA, onClose2FA, loading}:{submitForm2FA: (data: {otp: string})=>void, isOpen2FA: boolean, onOpen2FA: ()=>void, onClose2FA: ()=>void, loading: boolean}){


    const {register: register2FA, handleSubmit: handleSubmit2FA, formState: {errors: errors2FA}} = useForm<formType2FA>({
        resolver: zodResolver(formSchema2FA)
    })


    return (
        <>
            {isOpen2FA && (
            <Modal isOpen={isOpen2FA} onClose={onClose2FA} placement="top-center">
                <ModalContent>
                    <form onSubmit={handleSubmit2FA(submitForm2FA)}>
                        <ModalHeader className="flex flex-col gap-1">Autenticação</ModalHeader>
                        <ModalBody>
                            <Input
                                autoFocus
                                label="Insira o código de autenticação enviado para sí"
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
                            <button style={{backgroundColor: "var(--color-focus3)", padding: "10px 20px", borderRadius: "10px", color: "var(--color-focus)", transition: '.3s'}} type="submit" disabled={loading}>
                                {loading ? <TailSpin
                              height="25"
                              width="25"
                              color="#fc6423"
                              ariaLabel="tail-spin-loading"
                              radius="1"
                              visible={true}
                            /> : "Verificar"}
                            </button>
                        </ModalFooter>
                    </form>
                </ModalContent>
            </Modal>
        )}
        </>
    )
}