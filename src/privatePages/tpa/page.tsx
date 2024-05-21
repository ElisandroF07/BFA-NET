"use client";

import PayList from "@/components/lists/payList";
import useAccountStore from "@/contexts/stores/accountStore";
import { Modal, ModalContent, ModalHeader, ModalBody, Input, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
import "@/styles/payments.css";
import { useState } from "react";
import {z} from "zod"
import {useForm} from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import InfoError from "@/components/others/infoError";
import api from "@/services/api";
import { toast } from "sonner";
import { TailSpin } from "react-loader-spinner";
import ReferenceList from "@/components/lists/referenceList";

const formSchema = z.object({
	description: z.string().min(1, "Adicione a descrição do pagamento!"),
	price: z.string().min(1, "Adicione o preço do serviço/produto a pagar!")
})

type formType = z.infer<typeof formSchema>

export default function TPA() {
	const useAccount = useAccountStore()
	const [payData, setPayData] = useState<{price: number, description: string}>({price: 0, description: ""})
	const [payData2, setPayData2] = useState<{balance: number, description: string, date: string, reference: string, entity: string, state: number}>({description: "", date: "", reference: "", balance: 0, entity: "", state: 0})
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { isOpen: isOpen2, onOpen: onOpen2, onClose: onClose2 } = useDisclosure();
	const [loading, setLoading] = useState(false)
	function formatTimestamp(timestamp: number) {
		const months = [
			"Jan", "Feb", "Mar", "Apr", "May", "Jun",
			"Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
		];
	
		const date = new Date(timestamp);
		const day = date.getDate();
		const month = months[date.getMonth()];
		const year = date.getFullYear();
		const hours = date.getHours();
		const minutes = date.getMinutes().toString().padStart(2, '0');
	
		return `${day} ${month} ${year}`;
	  }

	const {handleSubmit, register, formState: {errors}} = useForm<formType>({resolver: zodResolver(formSchema)})

	function addOneDay(timestamp: number) {
		const data = new Date(timestamp);
		data.setHours(data.getHours() + 24);
	  
		const dia = String(data.getDate()).padStart(2, '0');
		const mes = String(data.getMonth() + 1).padStart(2, '0');
		const ano = data.getFullYear();
		const hora = String(data.getHours()).padStart(2, '0');
		const minutos = String(data.getMinutes()).padStart(2, '0');
	  
		return `${dia}/${mes}/${ano} - ${hora}:${minutos}`;
	  }


	async function submitForm(data: formType) {
		setPayData({price: parseInt(data.price), description: data.description})
		onOpen()
	}

	async function createReference() {
		setLoading(true)
		try {
			const body = {
				balance: payData.price,
				entityId: useAccount.number,
				description: payData.description
			}
			const response = await api.post('/createReference', body)
			if (response.data.success) {
				toast.success("Referência criada com sucesso!")
				setPayData2(response.data.reference)
				onClose()
				onOpen2()
				setLoading(false)
			}
			else {
				toast.error(response.data.message)
				setLoading(false)
			}
		}
		catch{
			toast.error("Sem comunicação com o servidor!")
			setLoading(false)
		}
	}

	return (
		<div className="payments_container">
			<div className="payments_header">
				<div className="top">
					<h1>TPA Virtual</h1>
					<p>Crie referências e receba pagamentos.</p>
				</div>
				<div className="bottom">
					<div>
						<h2>Saldo contabilístico</h2>
						<p>{useAccount.available_balance.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA', maximumFractionDigits: 0 })}</p>
					</div>
					<div>
						<h2>Saldo autorizado</h2>
						<p>{useAccount.authorized_balance.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA', maximumFractionDigits: 0 })}</p>
					</div>
				</div>
			</div>
			<div className="payments_body">
			<div className="pt3_container">
			<div className="top">
				<h1>Referências para pagamentos</h1>
				<div className="separator" />
			</div>
			<form onSubmit={handleSubmit(submitForm)} className="bottom">
				<div className="left">
					<div className="input_field">
						<label htmlFor="email">Conta emissora</label>
						<input
							type="text"
							disabled
							style={{ border: "none", background: "none" }}
							value={useAccount.number}
						/>
					</div>
					<div className="input_field">
						<label htmlFor="email">Descrção do Pagamento</label>
						<input type="text" placeholder="Descreva o pagamento" {...register("description")}/>
						{errors.description && <InfoError message={errors.description.message}/>}
					</div>
					
				</div>
				<div className="right">
					<div className="input_field">
						<label htmlFor="email">Data do pagamento</label>
						<input
							type="text"
							disabled
							style={{ border: "none", background: "none" }}
							value={formatTimestamp(Date.now())}
						/>
					</div>
					<div className="input_field">
						<label htmlFor="email">Preço do produto/serviço</label>
						<div className="input_phone">
							<p>KZ</p>
							<input type="text" placeholder="Preço" {...register("price")} pattern="[0-9]*" onInput={(event)=>{
								event.currentTarget.value = event.currentTarget.value.replace(/[^0-9]/g, '');
							}} maxLength={7}/>
						</div>
						{errors.price && <InfoError message={errors.price.message}/>}
					</div>
				</div>
				<button type="submit">
					Criar referência
				</button>
			</form>
		</div>
			</div>
			<div className="lateral">
				<h1 className="title" style={{margin: "10px 0px 0px 0px"}}>Referências criadas</h1>
				<div className="separator" />
				<div className="requests">
					<ReferenceList accountNumber={useAccount.number}/>
				</div>
			</div>
			{isOpen && (
            <Modal isOpen={isOpen} onClose={onClose} placement="top-center">
                <ModalContent>
                        <ModalHeader className="flex flex-col gap-1">Referência para pagamento</ModalHeader>
                        <ModalBody>
                            <Input
                                label="Entidade emissora"
                                type="text"
                                variant="flat"
                               	value={useAccount.number}
								disabled
                            />
                            <Input
                                label="Preço do produto/serviço"
                                type="text"
                                variant="flat"
                                value={payData.price.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA', maximumFractionDigits: 0 })}
                            />
                        </ModalBody>
                        <ModalFooter>
							<Button color="danger" type="button" disabled={loading} onPress={()=>{
								setPayData({price: 0, description: ""})
								onClose()
							}}>Cancelar</Button>

                            <Button color="success" type="button" disabled={loading} onPress={createReference}>
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
								'Confirmar'
							)}
                            </Button>
                        </ModalFooter>
                </ModalContent>
            </Modal>
       		)}
			{isOpen2 && (
            <Modal isOpen={isOpen2} onClose={onClose2} placement="top-center">
                <ModalContent>
                        <ModalHeader className="flex flex-col gap-1">Referência para pagamento</ModalHeader>
                        <ModalBody>
                            <Input
                                label="Entidade emissora"
                                type="text"
                                variant="flat"
                               	value={useAccount.number}
								disabled
                            />
                            <Input
                                label="Preço do produto/serviço"
                                type="text"
                                variant="flat"
                                value={payData2.balance.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA', maximumFractionDigits: 0 })}
                            />
							<Input
                                label="Data de validade"
                                type="text"
                                variant="flat"
                                value={addOneDay(parseInt(payData2.date))}
                            />
							<Input
                                label="Referência do pagamento"
                                type="text"
                                variant="flat"
                                value={payData2.reference}
                            />
                        </ModalBody>
                        <ModalFooter>
							
                            <Button color="primary" type="button" onPress={onClose2}>
								Fechar
                            </Button>
                        </ModalFooter>
                </ModalContent>
            </Modal>
       		)}
		</div>
		
	);
}
