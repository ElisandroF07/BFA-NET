import LateralCard from "@/components/cards/requestCard";
import useAccountStore from "@/contexts/stores/accountStore";
import useClientStore from "@/contexts/stores/clientStore";
import "@/styles/upmoney.css";
import { PiInfoThin } from "react-icons/pi";
import { useState, useRef } from "react";
import {useForm} from 'react-hook-form'
import {z} from 'zod'
import { zodResolver } from "@hookform/resolvers/zod";
import InfoError from "@/components/others/infoError";
import api from "@/services/api";
import { toast } from "sonner";
import { Modal, ModalContent, ModalHeader, ModalBody, Input, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
import { TailSpin } from "react-loader-spinner";
import TwoFAModal from "@/components/modals/2faModal"
import UpmoneyList from "@/components/lists/upmoneyList";

const FormSchema = z.object({
	emailTo: z.string().email("Introduza um email válido!"),
	balance: z.string().min(1, "Preenchimento obrigatório!"),
	pin: z.string().min(1, "O PIN do levantamento é obrigatório!").max(3, "O PIN deve apenas conter 3 dígitos!"),
	confirmPin: z.string().min(1, "Introduza novamente o PIN!").max(3, "O PIN deve apenas conter 3 dígitos!")
}).refine(data => data.pin === data.confirmPin, {
  message: "Os PINs não coincidem!",
  path: ["confirmPin"],
});

const formSchema2 = z.object({
	balance: z.string().min(1, "Preenchimento obrigatório!"),
	pin: z.string().min(1, "O PIN do levantamento é obrigatório!").max(3, "O PIN deve apenas conter 3 dígitos!"),
	confirmPin: z.string().min(1, "Introduza novamente o PIN!").max(3, "O PIN deve apenas conter 3 dígitos!")
}).refine(data => data.pin === data.confirmPin, {
  message: "Os PINs não coincidem!",
  path: ["confirmPin"],
});

const formSchemaCheck = z.object({
	accessCode: z.string().regex(/^[0-9]{6}$/, "O código de acesso deve conter 6 dígitos numéricos.")
})

type FormType = z.infer<typeof FormSchema>
type FormType2 = z.infer<typeof formSchema2>
type FormTypeCheck = z.infer<typeof formSchemaCheck>

interface ITransactions {
	accountFrom: string;
	accountTo: string;
	balance: string;
	date: string;
	status: string;
	transfer_type: {
		  type_id: number,
		  name: string
	  };
	receptor_description: string;
	transfer_description: string;
	emissor_description: string;
	  id: number;
  }
  
  interface IUpmoneys {
	accountFrom: string,
	balance: number,
	date: string,
	id: number,
	number: string,
	status: number,
	transferId: number
	transfers: ITransactions
  }

interface IQuery { 
  success: boolean;
  data: IUpmoneys[]
}

export default function Upmoney() {
	const [loading, setLoading] = useState(false)
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [upmoneyList, setUpmoneyList] = useState<IQuery>({success: false, data: []})
	const [upData, setUpData] = useState<FormType>({balance: "", confirmPin: "", emailTo: "", pin: ""})
	const [upmoney, setUpmoney] = useState<{number: "", balance: "", pin: "", expires: ""}>({balance: "", expires: "", number: "", pin: ""})
	const {register, handleSubmit, formState: {errors}} = useForm<FormType>({
		resolver: zodResolver(FormSchema)
	})
	const {handleSubmit: handleSubmit2, formState: {errors: errors2}, register: register2} = useForm<FormType2>({resolver: zodResolver(formSchema2)})
	const { isOpen: isOpen2FA, onOpen: onOpen2FA, onClose: onClose2FA } = useDisclosure();
	

	const useAccount = useAccountStore()
	const useClient = useClientStore()


	function adicionarUmDia(timestamp: number) {
    // Adiciona um dia em milissegundos (24 horas * 60 minutos * 60 segundos * 1000 milissegundos)
    const umDiaEmMilissegundos = 24 * 60 * 60 * 1000;
    
    // Converte o timestamp para um objeto Date
    const data = new Date(timestamp);
    
    // Adiciona um dia ao timestamp
    data.setTime(data.getTime() + umDiaEmMilissegundos);
    
    // Formata a data no formato dd-mm-aaaa hh:mm
    const dia = (`0${data.getDate()}`).slice(-2);
    const mes = (`0${data.getMonth() + 1}`).slice(-2);
    const ano = data.getFullYear();
    const horas = (`0${data.getHours()}`).slice(-2);
    const minutos = (`0${data.getMinutes()}`).slice(-2);
    
    return `${dia}-${mes}-${ano} ${horas}:${minutos}`;
	}

	async function submitForm(data: FormType) {
		setUpData({emailTo: data.emailTo, balance: data.balance, confirmPin: data.confirmPin, pin: data.pin})
		setLoading(true)
		try {
			const resp = await api.post(`/sendOTP/${useClient.email}/${useClient.biNumber}`)
			if (resp.status === 201) {
				toast.success("Código de autenticação enviado!")
				onOpen2FA()
				setLoading(false)
			}
			else {
				toast.error(resp.data.message)
				setLoading(false)
			}
		}
		catch {
			toast.error("Sem conexão com o servidor!")
		}
							
	}

	async function submitForm2(data: FormType2) {
		setUpData({emailTo: useClient.email, balance: data.balance, confirmPin: data.confirmPin, pin: data.pin})
		setLoading(true)
		try {
			const resp = await api.post(`/sendOTP/${useClient.email}/${useClient.biNumber}`)
			if (resp.status === 201) {
				toast.success("Código de autenticação enviado!")
				onOpen2FA()
				setLoading(false)
			}
			else {
				toast.error(resp.data.message)
				setLoading(false)
			}

		}
		catch {
			toast.error("Sem conexão com o servidor!")
		}
	}

	function formatNumber(number: string): string {
    const cleaned = (`${number}`).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{3})(\d{1})$/);

    if (match) {
        return `${match[1]} ${match[2]} ${match[3]} ${match[4]}`;
    }

    return number; // Retorna o número original se não estiver no formato esperado
	}

	async function submitForm2FA(data: {otp: string}) {
		setLoading(true)
		try {
			const response = await api.get(`/check2FA/${data.otp}/${useClient.biNumber}`)
			if (response.data.valid) {
				const body = {
					emailFrom: useClient.email,
					emailTo: upData.emailTo,
					pin: upData.pin,
					balance: upData.balance
				}
				console.log(body)
				const resp = await api.post("/createUpmoney", body)
				if (resp.data.success) {
					setLoading(false)
					toast.success(resp.data.message)
					setUpmoneyList({success: true, data: resp.data.upmoneyList})
					setUpmoney({balance: resp.data.upmoney.balance, expires: resp.data.upmoney.date, number: resp.data.upmoney.number, pin: resp.data.upmoney.pin})
          			useAccount.updateAuthorizedBalance(resp.data.account.authorized_balance)
					useAccount.updateAvailableBalance(resp.data.account.available_balance)
					useAccount.updateUpBalance(resp.data.account.up_balance)
					onClose2FA()
					onOpen()
				}
				else {
					toast.error(resp.data.message)
          			setLoading(false)
				}
			}
			else {
				toast.error("Código de acesso inválido!")
			}
		}catch (err){
			toast.error("Sem conexão com o servidor!")
		}
			finally {
			setLoading(false)
		}
	}

	return (
		<div className="mainContainer">
			<div className="header">
				<div className="top">
					<h1>Levantamentos</h1>
					<p>Retire o seu dinheiro a qualquer momento.</p>
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
					<div>
						<h2>Saldo por levantar</h2>
						<p>{useAccount.up_balance.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA', maximumFractionDigits: 0 })}</p>
					</div>
				</div>
			</div>
			<div className="middle">
				<div className="all-container">
					<p className="title" style={{color: "#3B3D4E"}}>Levantamento sem cartão</p>
					<div className="container">
						<div className="containerToMe">
							<h4 className="title" style={{color: "#3B3D4E"}}>Para mim</h4>
							<div className="toMe">
								<form onSubmit={handleSubmit2(submitForm2)}>
									<h4 className="static-text">Meu número endereço de email</h4>
									<p className="static-number">{useClient.email}</p>
									<h4 className="static-text mt-2">Montante</h4>
									<div id="Kz" className="input_montante">
										<p>Kz</p>
										<input
											type="text"
											className="montante"
											placeholder="Insira o montante"
											{...register2("balance")}
										/>
									</div>
									{errors2.balance && <InfoError message={errors2.balance.message}/>}
									<div className="info">
										<p>
											* São aceites notas de 1000, 2000 e 5000 <br />
											* Mínimo: 1000 Kz <br />
											* Máximo: 100 000 Kz
										</p>
									</div>
									<div id="Kz" className="input_field">
										<label className="static-text" style={{marginBottom: "5px"}}>Código secreto</label>
										<input
											type="password"
											className="montante"
											placeholder="***"
											maxLength={3}
											max={3}
											{...register2("pin")}
											style={{backgroundColor: "var(--color-cards)"}}
										/>
										{errors2.pin && <InfoError message={errors2.pin.message}/>}
									</div>
									
									<div id="Kz" className="input_field">
									<label className="static-text" style={{marginBottom: "5px"}}>
										Repita o seu código secreto
									</label>
										<input
											type="password"
											className="montante"
											placeholder="***"
											maxLength={3}
											max={3}
											{...register2("confirmPin")}
											style={{backgroundColor: "var(--color-cards)"}}
										/>
										{errors2.confirmPin && <InfoError message={errors2.confirmPin.message}/>}
									</div>
									<button className="botao" type="submit" style={{backgroundColor: "var(--color-focus3)"}}>
										Confirmar
									</button>
								</form>
							</div>
						</div>
						<div className="containeranother">
							<h4 className="title" style={{color: "#3B3D4E"}}>Para outra pessoa</h4>
							<div className="another">
								<form onSubmit={handleSubmit(submitForm)}>
									

									<div id="Kz" className="input_field">
										<h4 className="static-text">Endereço de email do beneficiário</h4>
										<input
											type="text"
											className="montante"
											placeholder="Insira o endereço de email do beneficiário"
											{...register("emailTo")}
											style={{backgroundColor: "var(--color-cards)"}}
										/>
										{errors.emailTo && <InfoError message={errors.emailTo.message}/>}
									</div>
									<h4 className="static-text">Montante</h4>
									<div id="Kz" className="input_montante">
										<p>Kz</p>
										<input
											type="text"
											className="montante"
											placeholder="Insira o montante"
											{...register("balance")}
										/>
									</div>
									<div className="info">
										<p>
											* São aceites notas de 1000, 2000 e 5000 <br />
											* Mínimo: 1000 Kz <br />
											* Máximo: 100 000 Kz
										</p>
									</div>
									{errors.balance && <InfoError message={errors.balance.message}/>}
									{/* <div className="info">
										<PiInfoThin className="icone" />
										<p>
											O código secreto é criado por si. É o primeiro código a
											ser introduzido para fazer o levantamento sem cartão. Deve
											conter 3 dígitos.
										</p>
									</div> */}

									
									<div id="Kz" className="input_field">
										<label className="static-text" style={{marginBottom: "5px"}}>Código secreto</label>
										<input
											type="password"
											className="montante"
											placeholder="***"
											maxLength={3}
											max={3}
											{...register("pin")}
											style={{backgroundColor: "var(--color-cards)"}}
										/>
										{errors.pin && <InfoError message={errors.pin.message}/>}
									</div>
									
									<div id="Kz" className="input_field">
									<label className="static-text" style={{marginBottom: "5px"}}>
										Repita o seu código secreto
									</label>
										<input
											type="password"
											className="montante"
											placeholder="***"
											maxLength={3}
											max={3}
											{...register("confirmPin")}
											style={{backgroundColor: "var(--color-cards)"}}
										/>
										{errors.confirmPin && <InfoError message={errors.confirmPin.message}/>}
									</div>
									<button className="botao" type="submit" style={{backgroundColor: "var(--color-focus3)"}}>
										Confirmar
									</button>
								</form>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="lateral">
				<h4 style={{margin: "10px 0px 0px 0px", color: "#3B3D4E"}}>Levantamentos efetuados</h4>
				<div className="requests">
					<UpmoneyList accountNumber={useAccount.number} setUpmoneyList={setUpmoneyList} upmoneyList={upmoneyList}/>
				</div>
			</div>
			{isOpen && (
            <Modal isOpen={isOpen} onClose={onClose} placement="top-center">
                <ModalContent>
                        <ModalHeader className="flex flex-col gap-1">Detalhes do levantamento</ModalHeader>
                        <ModalBody>
                            <Input
                                label="Referência do levantamento"
                                type="text"
                                variant="flat"
                               	value={formatNumber(upmoney.number)}
																disabled
                            />
                            <Input
                                label="Montante"
                                type="text"
                                variant="flat"
                                value={parseInt(upmoney.balance).toLocaleString('pt-AO', { style: 'currency', currency: 'AOA', maximumFractionDigits: 0 })}
                            />
							<Input
                                label="PIN"
                                type="text"
                                variant="flat"
                                value={upmoney.pin}
                            />
							<Input
                                label="Data de validade"
                                type="text"
                                variant="flat"
                                value={adicionarUmDia(parseInt(upmoney.expires))}
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" type="button" onPress={onClose}>
								Fechar
                            </Button>
                        </ModalFooter>
                </ModalContent>
            </Modal>
       		)}
			<TwoFAModal isOpen2FA={isOpen2FA} onClose2FA={onClose2FA} onOpen2FA={onOpen2FA} submitForm2FA={submitForm2FA} loading={loading}/>
		</div>
	);
}
