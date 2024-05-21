import "@/styles/pay-types.css";
import { CiCircleChevRight } from "react-icons/ci";
import {z} from "zod"
import {useForm} from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/services/api";
import { toast } from "sonner";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useDisclosure, Modal, ModalContent, ModalHeader, ModalBody, Input, ModalFooter, Button } from "@nextui-org/react";
import TwoFAModal from "../modals/2faModal";
import useClientStore from "@/contexts/stores/clientStore";
import useAccountStore from "@/contexts/stores/accountStore";
import { TailSpin } from "react-loader-spinner";


const formSchema = z.object({
	reference: z.string().min(1, "A referêrencia é obrigatória!")
})

type formType = z.infer<typeof formSchema>

interface IReferences {
    id: number,
    reference: string,
    description: string,
    balance: number,
    date: string,
    state: number,
    entity: string,
    payer_description: string,
    payer_nbi: string,
    emissor_description: string
  }

export default function PayReference({number}: {number: string}) {

	const [referenceData, setReferenceData] = useState<IReferences>({balance: 0, date: "", payer_description: "", payer_nbi: "", emissor_description: "", description: "", entity: "", id: 0, reference: "", state: 0})
	const {handleSubmit, formState: {errors}, register} = useForm<formType>({resolver: zodResolver(formSchema)})
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [reference, setReference] = useState("")
	const [loading, setLoading] = useState(false)
	const [loading2, setLoading2] = useState(false)
	const useClient = useClientStore()
	const useAccount = useAccountStore()
	const { isOpen: isOpen2FA, onOpen: onOpen2FA, onClose: onClose2FA } = useDisclosure();

	async function submitForm2FA(data: {otp: string}) {
		setLoading(true)
        const response = await api.get(`/check2FA/${data.otp}/${useClient.biNumber}`)
		if (response.data.valid) {
			try {
				let body = {
					reference: reference,
					accountNumber: useAccount.number
				}
				const ref = await api.post(`/payByReference`, body) 
				if (ref.data.success){
					toast.success(ref.data.message)
					setLoading(false)
					onClose2FA()
					onClose()
				}
				else {
					toast.error(ref.data.message)
					setLoading(false)
				}		
			}	
			catch(err) {
				console.log(err)
				setLoading(false)
			}					
		}
		else {
			toast.error("Código de autenticação inválido!")
			setLoading(false)
		}
	}

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

	  async function submitForm(data: formType) {
		setLoading(true)
		const response = await api.get(`/getReference2/${data.reference}`)
		if (response.data.success) {
			setReferenceData(response.data.reference)
			setReference(data.reference)
			onOpen()
		}
		else {
			toast.error("Referência inválida!")
		}
		setLoading(false)
	  }

	return (
		<div className="pt3_container">
			<div className="top">
				<h1>Pagamentos por referencia</h1>
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
						<label htmlFor="email">Referência</label>
						<input type="text" pattern="[0-9]*" onInput={(event)=>{
								event.currentTarget.value = event.currentTarget.value.replace(/[^0-9]/g, '');
							}} maxLength={6} placeholder="Introduza o número de referência" {...register("reference")} />
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
				</div>
				<button type="submit" style={{backgroundColor: "var(--color-focus3)", padding: "10px 20px", borderRadius: "10px", color: "var(--color-focus)", transition: '.3s'}}>
				{loading ? (
					<TailSpin
					height="25"
					width="25"
					color="#fc6423"
					ariaLabel="tail-spin-loading"
					radius="1"
					visible={true}
					/>
				) : (
					'Confirmar pagamento'
				)}
				</button>
			</form>
			{isOpen &&(
        <Modal isOpen={isOpen} onClose={()=>{
        onClose()
        }} placement="top-center">
                        <ModalContent>
                          <ModalHeader className="flex flex-col gap-1">Referencia de pagamento</ModalHeader>
                          <ModalBody>
                                  <Input
                                          autoFocus
                                          label="NIB da Entidade emissora"
                                          type="text"
                                          variant="flat"
                                          value={referenceData.entity}
                                          disabled
                                  />
								  <Input
                                          autoFocus
                                          label="Descrição da Entidade Emissora"
                                          type="text"
                                          variant="flat"
                                          value={referenceData.emissor_description}
                                          disabled
                                  />
                        <Input
                                                        autoFocus
                                                        label="Referência"
                                                        type="text"
                                                        variant="flat"
                                                        value={referenceData.reference}
                                                        disabled
                                                />

                        <Input
                                                        autoFocus
                                                        label="Descrição do pagamento"
                                                        type="text"
                                                        variant="flat"
                                                        value={referenceData.description}
                                                        disabled
                                                />
                        
                                                <Input
                                                        label="Montante"
                                                        type="text"
                                                        variant="flat"
                            value={referenceData.balance.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA', maximumFractionDigits: 0 })}
                                                        disabled
                                                />
                                                <Input
                                                        label="Data de emissão"
                                                        type="text"
                                                        variant="flat"
                                                        disabled
                                                        value={formatTimestamp(parseInt(referenceData.date))}
                                                />
                                        </ModalBody>
                                        <ModalFooter>
                                          
                                          <Button color="success" variant="flat" onPress={async()=>{
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
													color="#0f0"
													ariaLabel="tail-spin-loading"
													radius="1"
													visible={true}
													/>
												) : (
													'Pagar'
												)}
                                          </Button>
                                      </ModalFooter>
                        </ModalContent>
        </Modal>
      )}
	  <TwoFAModal isOpen2FA={isOpen2FA} onClose2FA={onClose2FA} onOpen2FA={onOpen2FA} submitForm2FA={submitForm2FA} loading={loading}/>
		</div>
	);
}
