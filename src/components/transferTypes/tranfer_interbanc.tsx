"use client"

import "@/styles/transfer-types.css";
import { CiCircleChevRight, CiCircleInfo } from "react-icons/ci";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";
import {z} from "zod"
import {useForm} from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import InfoError from "../others/infoError";
import { useState } from "react";
import api from "@/services/api";
import { toast } from "sonner";
import { TailSpin } from 'react-loader-spinner'

const formSchema = z.object({
	iban: z.string().regex(/^[0-9]{21}$/, "O IBAN deve conter 21 dígitos. Sem pontos e espaços."),
	balance: z.string().min(1, "Preenchimento obrigatório!"),
	transferDescription: z.string(),
  receiverDescription: z.string(),
})

const form2Schema = z.object({
	accessCode: z.string().regex(/^[0-9]{6}$/, "O código de acesso deve conter 6 dígitos numéricos.")
})


type formType = z.infer<typeof formSchema>
type form2Type = z.infer<typeof form2Schema>

export default function TransferInterbanc({number, biNumber}: {number: string, biNumber: string}) {

	const [loading, setLoading] = useState(false)
	const [transfer, setTransfer] = useState({iban: "", transferDescription: "", receiverDescription: "", balance: "", receiver: ""})
	const [loading2, setLoading2] = useState(false)
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { isOpen: isOpenCheck, onOpen: onOpenCheck, onClose: onCloseCheck } = useDisclosure();

	const {handleSubmit, formState: {errors}, register} = useForm<formType>({resolver: zodResolver(formSchema)})
	const {handleSubmit: handleSubmit2, formState: {errors: errors2}, register: register2} = useForm<form2Type>({resolver: zodResolver(form2Schema)})

	function getDataAtual() {
		const data = new Date();
		const dia = String(data.getDate()).padStart(2, '0');
		const mes = String(data.getMonth() + 1).padStart(2, '0');
		const ano = data.getFullYear();
		return `${dia}/${mes}/${ano}`;
	}

	async function submitForm(data: formType) {
		try {
			setLoading(true)
			const receiver = await api.get(`/getAccountByIban/AO06${data.iban}`)
			if (receiver.data.exists) {
				setTransfer({
					balance: data.balance,
					iban: data.iban,
          receiver: receiver.data.client.name.join(" "),
					receiverDescription: data.receiverDescription,
					transferDescription: data.transferDescription,
				})
				onOpen()
			}
			else {
				toast.error("IBAN inexistente!")
				setLoading(false)
			}
		}
		catch {
			toast.error("Não foi possivel processar a sua solicitação!")
			setLoading(false)
		}
	}

	function closeModal2() {
		setLoading2(false)
		setLoading(false)
		onCloseCheck()
	}

	function closeModal1() {
		setLoading2(false)
		setLoading(false)
		onClose()
	}

	async function submitForm2(data: form2Type) {
		setLoading2(true)
		try {
			const bodyCheck = JSON.stringify({
				accessCode: data.accessCode,
        biNumber
			})
			const response = await api.post("/checkAccessCode", bodyCheck)
			if (response.data.valid) {
				const body = JSON.stringify({
          balance: transfer.balance.toString(),
					accountTo: transfer.iban.toString(),
					accountFrom: number,
					tranfer_description: transfer.transferDescription.toString(),
					receptor_description: transfer.receiverDescription.toString(),
        })
        const response = await api.post("/transferInterbanc", body)
				if (response.status === 201) {
					toast.success("Transferência realizada com sucesso!")
          closeModal2()
					closeModal1()
					setLoading2(false)
				} 
				else {
					toast.error(response.data.message)
					setLoading2(false)
				}
			}
			else {
				toast.error("Código de acesso incorreto!")
				setLoading2(false)
			}
    }
    catch{
      toast.error("Não foi possivel processar a sua solicitação!")
      setLoading2(false)
    }
	}

	return (
		<div className="tt3_container">
			<div className="top">
				<h1>Transferências interbancárias</h1>
				<div className="separator" />
			</div>
			<form className="bottom" onSubmit={handleSubmit(submitForm)}>
				<div className="left">
					<div className="input_field">
						<label htmlFor="email">Conta emissora</label>
						<input
							type="text"
							disabled
							style={{ border: "none", background: "none" }}
							value={number}
						/>
					</div>
					<div className="input_field">
						<label htmlFor="email">IBAN da conta receptora</label>
						<div className="input_phone">
							<p>AO06</p>
							<input type="text" placeholder="Número do IBAN" {...register("iban")} />
						</div>
						{errors.iban && <InfoError message={errors.iban.message} />}
					</div>
					<div className="input_field">
						<label htmlFor="email">Montante</label>
						<div className="input_phone">
							<p>Kz</p>
							<input type="text" placeholder="Montante" {...register("balance")}/>
						</div>
						{errors.balance && <InfoError message={errors.balance.message} />}
					</div>
				</div>
				<div className="right">
					<div className="input_field">
						<label htmlFor="email">Data da transferência</label>
						<input
							type="text"
							disabled
							style={{ border: "none", background: "none" }}
							value={getDataAtual()}
						/>
					</div>
					<div className="input_field">
						<label htmlFor="email">Descrição da transferência</label>
						<input
							type="text" placeholder="Descreva o motivo da transferência" {...register("transferDescription")} />
					</div>
					<div className="input_field">
						<label htmlFor="email">Descrição do destinatário</label>
						<input type="text" placeholder="Descreva o destinatário" {...register("receiverDescription")}/>
					</div>
				</div>
				<div className="information">
					<CiCircleInfo className="icone" />
					<p>
						Estimando cliente, informamos que para transferências interbancárias
						a conta beneficiária poderá ser creditada no próximo dia útil em
						função dos procedimentos do banco destino.
					</p>
					<button type="submit" disabled={loading}>
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
							<>Confirmar transferência <CiCircleChevRight /></>
						)}
						
					</button>
				</div>
			</form>
			{isOpen && (
            <Modal isOpen={isOpen} onClose={onClose} placement="top-center">
                <ModalContent>
                        <ModalHeader className="flex flex-col gap-1">Confirmar transferência</ModalHeader>
                        <ModalBody>
                            <Input
                                autoFocus
                                label="Destinatário"
                                type="text"
                                variant="flat"
                                value={transfer.receiver}
																disabled
                            />
                            <Input
                                label="IBAN"
                                type="text"
                                variant="flat"
                               	value={`AO06 ${transfer.iban.match(/.{1,4}/g)?.join(' ')}`}
																disabled
                            />
                            <Input
                                label="Montante a transferir"
                                type="text"
                                variant="flat"
                                value={`${parseInt(transfer.balance).toLocaleString('pt-AO', { style: 'currency', currency: 'AOA', maximumFractionDigits: 0 })}`}
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="flat" onPress={closeModal1}>
                                Cancelar
                            </Button>
                            <Button color="primary" type="button" onPress={onOpenCheck}>
														Confirmar
                            </Button>
                        </ModalFooter>
                </ModalContent>
            </Modal>
        )}
			{isOpenCheck && (
            <Modal isOpen={isOpenCheck} onClose={onCloseCheck} placement="top-center">
                <ModalContent>
                    <form onSubmit={handleSubmit2(submitForm2)}>
                        <ModalHeader className="flex flex-col gap-1">Finalizar transferência</ModalHeader>
                        <ModalBody>
                            <Input
                                autoFocus
                                label="Código de acesso"
                                type="text"
                                variant="flat"
																{...register2("accessCode")}
                            />
														{errors2.accessCode && <InfoError message={errors2.accessCode.message} />}
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="flat" onPress={closeModal2} disabled={loading2}>
                                Cancelar
                            </Button>
                            <Button color="primary" type="submit" disabled={loading2}>
														{loading2 ? (
															<TailSpin
																height="25"
																width="25"
																color="#fff"
																ariaLabel="tail-spin-loading"
																radius="1"
																visible={true}
															/>
														) : (
															'Finalizar'
														)}
                            </Button>
                        </ModalFooter>
                    </form>
                </ModalContent>
            </Modal>
        )}
		</div>
	);
}
