"use client"

import "@/styles/transfer-types.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";
import { CiCircleChevRight, CiCircleInfo } from "react-icons/ci";
import InfoError from "../others/infoError";
import { useState } from "react";
import api from "@/services/api";
import { toast } from "sonner";
import { TailSpin } from "react-loader-spinner";
import useAccountStore from "@/contexts/stores/accountStore";
import TwoFAModal from "../modals/2faModal";
import useClientStore from "@/contexts/stores/clientStore";

const formSchema = z.object({
	account_number: z.string().regex(/^[0-9]{14}$/, "O número de conta deve conter 14 dígitos. Sem pontos e espaços.").transform((string)=>{
		return string.replace('10001', '.10.001')
	}),
	balance: z.string().min(1, "Preenchimento obrigatório!"),
	transferDescription: z.string(),
  receiverDescription: z.string(),
})

const form2Schema = z.object({
	accessCode: z.string().regex(/^[0-9]{6}$/, "O código de acesso deve conter 6 dígitos numéricos.")
})


type formType = z.infer<typeof formSchema>
type form2Type = z.infer<typeof form2Schema>


export default function TransferIntrabanc({number, biNumber}: {number: string, biNumber: string}) {

	const [loading, setLoading] = useState(false)
	const [transfer, setTransfer] = useState({accountNumber: "", transferDescription: "", receiverDescription: "", balance: "", receiver: ""})
	const [loading2, setLoading2] = useState(false)
	const { isOpen: isOpen2FA, onOpen: onOpen2FA, onClose: onClose2FA } = useDisclosure();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const useAccount = useAccountStore()
	const useClient = useClientStore()
	
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
			const receiver = await api.get(`/getAccountByNumber/${data.account_number}`)
			if (receiver.data.exists) {
				setTransfer({
					balance: data.balance,
					accountNumber: data.account_number,
          			receiver: receiver.data.client.name.join(" "),
					receiverDescription: data.receiverDescription,
					transferDescription: data.transferDescription,
				})
				setLoading(false)
				onOpen()
			}
			else {
				toast.error("Conta destino inexistente!")
				setLoading(false)
			}
		}
		catch {
			toast.error("Sem conexão com o servidor")
			setLoading(false)
		}
	}

	async function submitForm2FA(data: {otp: string}) {
		setLoading2(true)
		try {
			const response = await api.get(`/check2FA/${data.otp}/${useClient.biNumber}`)
			if (response.data.valid) {
				const body = JSON.stringify({
          			balance: transfer.balance,
					accountTo: transfer.accountNumber,
					accountFrom: number,
					tranfer_description: transfer.transferDescription,
					receptor_description: transfer.receiverDescription,
        		})
        		const response = await api.post("/transferIntrabanc", body)
				if (response.status === 201) {
					useAccount.updateAuthorizedBalance(response.data.authorized_balance)
					useAccount.updateAvailableBalance(response.data.availabe_balance)
					toast.success("Transferência realizada com sucesso!")
					setLoading2(false)
					setLoading(false)
					onClose2FA()
					onClose()
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
			toast.error("Sem conexão com o servidor")
			setLoading2(false)
		}
	}

	return (
		<div className="tt3_container">
			<div className="top">
				<h1>Transferências intrabancárias</h1>
				<div className="separator" />
			</div>
			<form className="bottom"  onSubmit={handleSubmit(submitForm)}>
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
						<label htmlFor="email">Número da conta receptora</label>
						<input type="text" pattern="[0-9]*" onInput={(event)=>{
								event.currentTarget.value = event.currentTarget.value.replace(/[^0-9]/g, '');
							}} placeholder="Número da conta" maxLength={13} {...register("account_number")}/>
						{errors.account_number && <InfoError message={errors.account_number.message} />}
					</div>
					<div className="input_field">
						<label htmlFor="email">Montante</label>
						<div className="input_phone">
							<p>Kz</p>
							<input type="text" pattern="[0-9]*" onInput={(event)=>{
								event.currentTarget.value = event.currentTarget.value.replace(/[^0-9]/g, '');
							}} maxLength={7} max={5000000} min={500} placeholder="Montante" {...register("balance")}/>
						</div>
						{errors.balance && <InfoError message={errors.balance.message} />}
					</div>
					<div className="info" style={{border: "none"}}>
						<p>
							* Mínimo: 500 Kz     
							* Máximo: 5 000 000 000 Kz
						</p>
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
							type="text"
							placeholder="Descreva o motivo da transferência"
							{...register("transferDescription")}
						/>
						{errors.transferDescription && <InfoError message={errors.transferDescription.message} />}
					</div>
					<div className="input_field">
						<label htmlFor="email">Descrição do destinatário</label>
						<input
							type="text"
							placeholder="Descreva o destinatário (nome, parentesco, ...)"
							{...register("receiverDescription")}
						/>
						{errors.receiverDescription && <InfoError message={errors.receiverDescription.message} />}
					</div>
				</div>
				<div className="information">
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
							<>Confirmar transferência</>
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
                                label="Número de conta"
                                type="text"
                                variant="flat"
                               	value={`${transfer.accountNumber.match(/.{1,4}/g)?.join(' ')}`}
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
                            <Button color="danger" variant="flat" onPress={onClose}>
                                Cancelar
                            </Button>
                            <Button color="primary" type="button" disabled={loading2} onPress={async()=>{
								setLoading2(true)
									try {
										const resp = await api.post(`/sendOTP/${useClient.email}/${useClient.biNumber}`)
										if (resp.status === 201) {
											toast.success("Código de autenticação enviado!")
											onOpen2FA()
											setLoading2(false)
										}
										else {
											toast.error(resp.data.message)
											setLoading2(false)
										}

									}
									catch {
										toast.error("Sem conexão com o servidor!")
									}
								}}>
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
										'Confirmar'
									)}
                            </Button>
                        </ModalFooter>
                </ModalContent>
            </Modal>
        )}
		<TwoFAModal isOpen2FA={isOpen2FA} onClose2FA={onClose2FA} onOpen2FA={onOpen2FA} submitForm2FA={submitForm2FA} loading={loading2}/>
		</div>
	);
}
