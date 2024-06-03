import { Dispatch, SetStateAction, useEffect, useState } from "react";
import CardDashboardTransaction from "../cards/cardDashboardTransaction";
import api from "@/services/api";
import useSWR from "swr";
import Skeleton from "react-loading-skeleton";
import { useDisclosure, Modal, ModalContent, ModalHeader, ModalBody, Input, ModalFooter, Button } from "@nextui-org/react";
import { TbFileDownload } from "react-icons/tb";
import { TailSpin } from "react-loader-spinner";
import useAccountStore from "@/contexts/stores/accountStore";
import utils from "@/services/utils";
import { toast } from "sonner";
import { IoMailOutline  } from "react-icons/io5";
import useClientStore from "@/contexts/stores/clientStore";

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
  emissor_description: string;
  transfer_description: string;
	id: number;
}

interface ITransaction {
  success: boolean;
  transactions: ITransactions[];
}

interface IClient {
  name: string[];
  gender: string;
  birthDate: Date;
}

interface IQuery { 
  status: boolean;
  transaction: ITransactions,
  client: IClient
}

interface IProps {
  accountNumber: string
}

export default function TransactionList({accountNumber}: IProps) {

  const fetcher = (url: string) => api.get(url).then(res => res.data);
  const { data, error } = useSWR(`/getTransactions/${accountNumber}`, fetcher);
  const [transactionData, setTransactionData] = useState<IQuery>({status: false, client: {name: [""], birthDate: new Date(Date.now()), gender: ""}, transaction: {accountFrom: "", accountTo: "", balance: "", date: "", id: 0, receptor_description: "", emissor_description: "", status: "", transfer_description: "", transfer_type: {name: "", type_id: 0}}})
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading2, setLoading2] = useState(false)
  const [loading3, setLoading3] = useState(false)
  const useAccount = useAccountStore()
  const [transactions, setTransactions] = useState<ITransaction | null>(null);
  const useUtils = new utils
  const useClient = useClientStore()


  useEffect(()=>{
    if (data) {
      setTransactions(data)
	  
    }
    if (error) {
      setTransactions({success: false, transactions: []})
    }
  }, [data, error])

  useEffect(()=>{

	async function removeUpMoney(id: number) {
		try {
			const response = await api.put(`/cancelUpmoney/${id}}`);
			if (response.data.success) {
			  useAccount.updateAuthorizedBalance(response.data.balance.authorized_balance)
			  useAccount.updateAvailableBalance(response.data.balance.available_balance)
			  useAccount.updateUpBalance(response.data.balance.up_balance)
			  toast.warning("Levantamento removido por expiração!")
			}
			else {
			  toast.error(response.data.message)
			}
		  }
		  catch {
			toast.error("Sem conexão com o servidor!")
		  }
	}

	async function applyDP(expires: number) {
		try {
			const response = await api.put(`/finalizeDP/${expires}/${useClient.email}`);
			if (response.data.success) {
			  useAccount.updateAuthorizedBalance(response.data.balance.authorized_balance)
			  useAccount.updateAvailableBalance(response.data.balance.available_balance)
			  useAccount.updateUpBalance(response.data.balance.up_balance)
			  toast.warning("Depóstivo finalizado com sucesso!")
			}
			else {
			  toast.error(response.data.message)
			}
		  }
		  catch {
			toast.error("Sem conexão com o servidor!")
		  }
	}

	transactions?.transactions.forEach(element => {
		if (element.transfer_type.type_id === 6) {
			const tmsLev = parseInt(element.date) + (24 * 60 * 60 * 1000)
			if (Date.now() > tmsLev) {
				removeUpMoney(element.id)
			}		
		}
		else if (element.transfer_type.type_id === 10) {
			const tmsLev = parseInt(element.receptor_description)
			if (Date.now() > tmsLev) {
				applyDP(parseInt(element.receptor_description))
			}		
		}
	});
  }, [transactions])

  function formatTimestamp(timestamp: number) {
    const months = [
        "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
            "Jul", "Ago", "Set", "Out", "Nov", "Dez"
    ];

    const date = new Date(timestamp);
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${day} ${month} ${year} - ${hours}:${minutes}`;
  }

  function formatNumber(input: string): string {
    const parts = input.split('.');
    if (parts.length !== 3) {
        throw new Error('Input inválido. Deve estar no formato "xxxxxx.yyy.zz.zzz".');
    }
    const firstPart = parts[0];
    const secondPart = parts[1];
    const thirdPart = parts[2].replace('.', ''); // Removendo o ponto

    return `${firstPart} ${secondPart} ${thirdPart}`;
  }

  return (
    <>
      {(!transactions && !error) && (
        <>
          <Skeleton borderRadius={10} height={50} style={{ width: "100%" }} />
          <Skeleton borderRadius={10} height={50} style={{ width: "100%" }} />
          <Skeleton borderRadius={10} height={50} style={{ width: "100%" }} />
        </>
      )}



      {transactions && transactions.transactions.length === 0 && !error && (
        <div className="withoutTransactions">
        Não há transações
      </div>
      )}



      {transactions && transactions.transactions.length > 0 && !error && (
        transactions.transactions.map((_item) => (
          <CardDashboardTransaction
            key={_item.id}
            id={_item.id}
            balance={parseInt(_item.balance).toLocaleString('pt-AO', { style: 'currency', currency: 'AOA', maximumFractionDigits: 0 })}
            date={formatTimestamp(parseInt(_item.date))}
            status={1}
            type={_item.transfer_type.name}
			typeId={_item.transfer_type.type_id}
            imageUrl="../assets/images/wallets/paypal.png"
            onClick={()=>{
              onOpen()
            }}
            setTransactionData={setTransactionData}
            accountFrom={_item.accountFrom}
          />
        ))
      )}



      {isOpen &&(
        transactionData.transaction.transfer_type.type_id === 1 ? 
			<Modal isOpen={isOpen} onClose={()=>{
			onClose()
			}} placement="top-center">
				<ModalContent>
					<ModalHeader className="flex flex-col gap-1">Transferência Interbancária
					</ModalHeader>
					<ModalBody>
							<Input
								autoFocus
								label="Descrição do Emissor"
								type="text"
								variant="flat"
								value={transactionData.transaction.emissor_description}
								disabled
							/>
							<Input
								autoFocus
								label="NIB do Emissor"
								type="text"
								variant="flat"
								value={transactionData.transaction.accountFrom}
								disabled
							/>

							<Input
								autoFocus
								label="Descrição da Transferência"
								type="text"
								variant="flat"
								value={transactionData.transaction.transfer_description}
								disabled
							/>
	
							<Input
								label="Montante"
								type="text"
								variant="flat"
								value={useUtils.formatBalance(parseInt(transactionData.transaction.balance))}
								disabled
							/>
							<Input
								label="Data da Transferência"
								type="text"
								variant="flat"
								disabled
								value={useUtils.formatWithHours(transactionData.transaction.date)}
							/>
							<Input
								label="Estado da Transferência"
								type="text"
								variant="flat"
								disabled
								value={transactionData.transaction.status}
							/>
							<Input
								label="Descrição do Destinatário"
								type="text"
								variant="flat"
								disabled
								value={transactionData.transaction.receptor_description}
							/>
							<Input
								label="NIB do Destinatário"
								type="text"
								variant="flat"
								disabled
								value={transactionData.transaction.accountTo}
							/>
					</ModalBody>
					<ModalFooter>
						<Button color="success" variant="flat" onPress={async ()=>{
							setLoading2(true)
							const response = await api.get(`/generatePDF/${transactionData.transaction.accountFrom !== useAccount.nbi ? "1" : "2"}/${transactionData.transaction.id}`, {responseType: 'arraybuffer'});
							const blob = new Blob([response.data], { type: 'application/pdf' }); 
							const url = window.URL.createObjectURL(blob); 
							const a = document.createElement('a');
							a.href = url; 
							a.download = `comprovativo-${transactionData.transaction.id}.pdf`; 
							a.click();
							setLoading2(false)
						}}>
							{loading2 ? (
								<TailSpin
								height="25"
								width="25"
								ariaLabel="tail-spin-loading"
								radius="1"
								visible={true}
								/>
							) : (
								<TbFileDownload style={{width: "24px", height: "24px"}}/>
							)}
							
						</Button>
						<Button color="success" disabled={loading3} variant="flat" onPress={async ()=>{
							setLoading3(true)
							const response = await api.get(`/sendPDF/${transactionData.transaction.accountFrom !== useAccount.nbi ? "1" : "2"}/${transactionData.transaction.id}/${useClient.email}`, {responseType: 'arraybuffer'});
							if (response.status === 201) {
							  toast.success("Extrato enviado com sucesso!")
							}
							else {
							  toast.error("Falha ao enviar extrato!")
							}
							setLoading3(false)
						}}>
							{loading3 ? (
								<TailSpin
								height="25"
								width="25"
								ariaLabel="tail-spin-loading"
								radius="1"
								visible={true}
								/>
							) : (
								<IoMailOutline  style={{width: "24px", height: "24px"}}/>
							)}
							
						</Button>
						<Button color="default" variant="flat" onPress={onClose}>
							Fechar
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
        :
		transactionData.transaction.transfer_type.type_id === 2  ? 	
			<Modal isOpen={isOpen} onClose={()=>{
			onClose()
			}} placement="top-center">
				<ModalContent>
					<ModalHeader className="flex flex-col gap-1">Transferência Intrabancária
					</ModalHeader>
					<ModalBody>
							<Input
								autoFocus
								label="Descrição do Emissor"
								type="text"
								variant="flat"
								value={transactionData.transaction.emissor_description}
								disabled
							/>
							<Input
								autoFocus
								label="NIB do Emissor"
								type="text"
								variant="flat"
								value={transactionData.transaction.accountFrom}
								disabled
							/>

							<Input
								autoFocus
								label="Descrição da Transferência"
								type="text"
								variant="flat"
								value={transactionData.transaction.transfer_description}
								disabled
							/>
	
							<Input
								label="Montante"
								type="text"
								variant="flat"
								value={useUtils.formatBalance(parseInt(transactionData.transaction.balance))}
								disabled
							/>
							<Input
								label="Data da Transferência"
								type="text"
								variant="flat"
								disabled
								value={useUtils.formatWithHours(transactionData.transaction.date)}
							/>
							<Input
								label="Estado da Transferência"
								type="text"
								variant="flat"
								disabled
								value={transactionData.transaction.status}
							/>
							<Input
								label="Descrição do Destinatário"
								type="text"
								variant="flat"
								disabled
								value={transactionData.transaction.receptor_description}
							/>
							<Input
								label="NIB do Destinatário"
								type="text"
								variant="flat"
								disabled
								value={transactionData.transaction.accountTo}
							/>
					</ModalBody>
					<ModalFooter>
						<Button color="success" variant="flat" onPress={async ()=>{
							setLoading2(true)
							const response = await api.get(`/generatePDF/${transactionData.transaction.accountFrom !== useAccount.nbi ? "1" : "2"}/${transactionData.transaction.id}`, {responseType: 'arraybuffer'});
							const blob = new Blob([response.data], { type: 'application/pdf' }); 
							const url = window.URL.createObjectURL(blob); 
							const a = document.createElement('a');
							a.href = url; 
							a.download = `comprovativo-${transactionData.transaction.id}.pdf`; 
							a.click();
							setLoading2(false)
						}}>
							{loading2 ? (
								<TailSpin
								height="25"
								width="25"
								ariaLabel="tail-spin-loading"
								radius="1"
								visible={true}
								/>
							) : (
								<TbFileDownload style={{width: "24px", height: "24px"}}/>
							)}
							
						</Button>
						<Button color="success" disabled={loading3} variant="flat" onPress={async ()=>{
							setLoading3(true)
							const response = await api.get(`/sendPDF/${transactionData.transaction.accountFrom !== useAccount.nbi ? "1" : "2"}/${transactionData.transaction.id}/${useClient.email}`, {responseType: 'arraybuffer'});
							if (response.status === 201) {
							  toast.success("Extrato enviado com sucesso!")
							}
							else {
							  toast.error("Falha ao enviar extrato!")
							}
							setLoading3(false)
						}}>
							{loading3 ? (
								<TailSpin
								height="25"
								width="25"
								ariaLabel="tail-spin-loading"
								radius="1"
								visible={true}
								/>
							) : (
								<IoMailOutline  style={{width: "24px", height: "24px"}}/>
							)}
							
						</Button>
						<Button color="default" variant="flat" onPress={onClose}>
							Fechar
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		:
		transactionData.transaction.transfer_type.type_id === 5  ? 	
			<Modal isOpen={isOpen} onClose={()=>{
			onClose()
			}} placement="top-center">
				<ModalContent>
					<ModalHeader className="flex flex-col gap-1">Transferência Express
					</ModalHeader>
					<ModalBody>
							<Input
								autoFocus
								label="Descrição do Emissor"
								type="text"
								variant="flat"
								value={transactionData.transaction.emissor_description}
								disabled
							/>
							<Input
								autoFocus
								label="NIB do Emissor"
								type="text"
								variant="flat"
								value={transactionData.transaction.accountFrom}
								disabled
							/>

							<Input
								autoFocus
								label="Descrição da Transferência"
								type="text"
								variant="flat"
								value={transactionData.transaction.transfer_description}
								disabled
							/>
	
							<Input
								label="Montante"
								type="text"
								variant="flat"
								value={useUtils.formatBalance(parseInt(transactionData.transaction.balance))}
								disabled
							/>
							<Input
								label="Data da Transferência"
								type="text"
								variant="flat"
								disabled
								value={useUtils.formatWithHours(transactionData.transaction.date)}
							/>
							<Input
								label="Estado da Transferência"
								type="text"
								variant="flat"
								disabled
								value={transactionData.transaction.status}
							/>
							<Input
								label="Descrição do Destinatário"
								type="text"
								variant="flat"
								disabled
								value={transactionData.transaction.receptor_description}
							/>
							<Input
								label="NIB do Destinatário"
								type="text"
								variant="flat"
								disabled
								value={transactionData.transaction.accountTo}
							/>
					</ModalBody>
					<ModalFooter>
						<Button color="success" variant="flat" onPress={async ()=>{
							setLoading2(true)
							const response = await api.get(`/generatePDF/${transactionData.transaction.accountFrom !== useAccount.nbi ? "1" : "2"}/${transactionData.transaction.id}`, {responseType: 'arraybuffer'});
							const blob = new Blob([response.data], { type: 'application/pdf' }); 
							const url = window.URL.createObjectURL(blob); 
							const a = document.createElement('a'); 
							a.href = url;
							a.download = `comprovativo-${transactionData.transaction.id}.pdf`; 
							a.click();
							setLoading2(false)
						}}>
							{loading2 ? (
								<TailSpin
								height="25"
								width="25"
								ariaLabel="tail-spin-loading"
								radius="1"
								visible={true}
								/>
							) : (
								<TbFileDownload style={{width: "24px", height: "24px"}}/>
							)}
							
						</Button>
						<Button color="success" disabled={loading3} variant="flat" onPress={async ()=>{
							setLoading3(true)
							const response = await api.get(`/sendPDF/${transactionData.transaction.accountFrom !== useAccount.nbi ? "1" : "2"}/${transactionData.transaction.id}/${useClient.email}`, {responseType: 'arraybuffer'});
							if (response.status === 201) {
							  toast.success("Extrato enviado com sucesso!")
							}
							else {
							  toast.error("Falha ao enviar extrato!")
							}
							setLoading3(false)
						}}>
							{loading3 ? (
								<TailSpin
								height="25"
								width="25"
								ariaLabel="tail-spin-loading"
								radius="1"
								visible={true}
								/>
							) : (
								<IoMailOutline  style={{width: "24px", height: "24px"}}/>
							)}
							
						</Button>
						<Button color="default" variant="flat" onPress={onClose}>
							Fechar
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>	
		:
		transactionData.transaction.transfer_type.type_id === 6  ? 	
			<Modal isOpen={isOpen} onClose={()=>{
			onClose()
			}} placement="top-center">
				<ModalContent>
					<ModalHeader className="flex flex-col gap-1">Levantamento sem Cartão
					</ModalHeader>
					<ModalBody>
							<Input
								autoFocus
								label="Descrição do Emissor"
								type="text"
								variant="flat"
								value={transactionData.transaction.emissor_description}
								disabled
							/>
							<Input
								autoFocus
								label="NIB do Emissor"
								type="text"
								variant="flat"
								value={transactionData.transaction.accountFrom}
								disabled
							/>
							<Input
								label="Montante"
								type="text"
								variant="flat"
								value={useUtils.formatBalance(parseInt(transactionData.transaction.balance))}
								disabled
							/>
							<Input
								label="Data de validade"
								type="text"
								variant="flat"
								disabled
								value={useUtils.addOneDay(transactionData.transaction.date)}
							/>
							<Input
								label="Estado do levantamento"
								type="text"
								variant="flat"
								disabled
								value={transactionData.transaction.status}
							/>
					</ModalBody>
					<ModalFooter>
						{/* <Button color="success" variant="flat" onPress={async ()=>{
							setLoading2(true)
							const response = await api.get(`/generatePDF/3/${transactionData.transaction.id}`, {responseType: 'arraybuffer'});
							const blob = new Blob([response.data], { type: 'application/pdf' }); 
							const url = window.URL.createObjectURL(blob); 
							const a = document.createElement('a');
							a.href = url; 
							a.download = `comprovativo-${transactionData.transaction.id}.pdf`;
							a.click();
							setLoading2(false)
						}}>
							{loading2 ? (
								<TailSpin
								height="25"
								width="25"
								ariaLabel="tail-spin-loading"
								radius="1"
								visible={true}
								/>
							) : (
								<TbFileDownload style={{width: "24px", height: "24px"}}/>
							)}
							
						</Button> */}
						<Button color="default" variant="flat" onPress={onClose}>
							Fechar
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		:
		transactionData.transaction.transfer_type.type_id === 7 || transactionData.transaction.transfer_type.type_id === 8  ? 	
			<Modal isOpen={isOpen} onClose={()=>{
			onClose()
			}} placement="top-center">
				<ModalContent>
					<ModalHeader className="flex flex-col gap-1">Pagamento de serviço
					</ModalHeader>
					<ModalBody>
							<Input
								autoFocus
								label="Entidade"
								type="text"
								variant="flat"
								value={transactionData.transaction.receptor_description}
								disabled
							/>
							<Input
								autoFocus
								label="Nº de Referência da Entidade"
								type="text"
								variant="flat"
								value={transactionData.transaction.accountTo}
								disabled
							/>

							<Input
								autoFocus
								label="Descrição do pagamento"
								type="text"
								variant="flat"
								value={transactionData.transaction.transfer_description}
								disabled
							/>
	
							<Input
								label="Montante"
								type="text"
								variant="flat"
								value={useUtils.formatBalance(parseInt(transactionData.transaction.balance))}
								disabled
							/>
							<Input
								label="Data do pagamento"
								type="text"
								variant="flat"
								disabled
								value={useUtils.formatWithHours(transactionData.transaction.date)}
							/>
							<Input
								label="Estado do pagamento"
								type="text"
								variant="flat"
								disabled
								value={transactionData.transaction.status}
							/>
							<Input
								label="Descrição do Pagante"
								type="text"
								variant="flat"
								disabled
								value={transactionData.transaction.emissor_description}
							/>
							<Input
								label="NIB do Pagante"
								type="text"
								variant="flat"
								disabled
								value={transactionData.transaction.accountFrom}
							/>
					</ModalBody>
					<ModalFooter>
						<Button color="success" variant="flat" onPress={async () => {
								setLoading2(true)
								const response = await api.get(`/generatePDF/3/${transactionData.transaction.id}`, {responseType: 'arraybuffer'});
								const blob = new Blob([response.data], { type: 'application/pdf' }); 
								const url = window.URL.createObjectURL(blob);
								
								const a = document.createElement('a');
								a.href = url;
								a.download = `comprovativo-${transactionData.transaction.id}.pdf`; 
								a.click();
								setLoading2(false)
							}}>
								{loading2 ? (
									<TailSpin
									height="25"
									width="25"
									ariaLabel="tail-spin-loading"
									radius="1"
									visible={true}
									/>
								) : (
									<TbFileDownload style={{width: "24px", height: "24px"}}/>
								)}
								
						</Button>
						<Button color="success" disabled={loading3} variant="flat" onPress={async ()=>{
							setLoading3(true)
							const response = await api.get(`/sendPDF/5/${transactionData.transaction.id}/${useClient.email}`, {responseType: 'arraybuffer'});
							if (response.status === 201) {
							  toast.success("Extrato enviado com sucesso!")
							}
							else {
							  toast.error("Falha ao enviar extrato!")
							}
							setLoading3(false)
						}}>
							{loading3 ? (
								<TailSpin
								height="25"
								width="25"
								ariaLabel="tail-spin-loading"
								radius="1"
								visible={true}
								/>
							) : (
								<IoMailOutline  style={{width: "24px", height: "24px"}}/>
							)}
							
						</Button>
						<Button color="default" variant="flat" onPress={onClose}>
							Fechar
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		:	
		transactionData.transaction.transfer_type.type_id === 9  ? 	
			<Modal isOpen={isOpen} onClose={()=>{
				onClose()
				}} placement="top-center">
				<ModalContent>
					<ModalHeader className="flex flex-col gap-1">Pagamento por Referência
					</ModalHeader>
					<ModalBody>
							<Input
								autoFocus
								label="Descrição da Entidade"
								type="text"
								variant="flat"
								value={transactionData.transaction.receptor_description}
								disabled
							/>
							<Input
								autoFocus
								label="NIB da Entidade"
								type="text"
								variant="flat"
								value={transactionData.transaction.accountTo}
								disabled
							/>
							<Input
								autoFocus
								label="Descrição do pagamento"
								type="text"
								variant="flat"
								value={transactionData.transaction.transfer_description}
								disabled
							/>

							<Input
								label="Montante"
								type="text"
								variant="flat"
								value={useUtils.formatBalance(parseInt(transactionData.transaction.balance))}
								disabled
							/>
							<Input
								label="Data do pagamento"
								type="text"
								variant="flat"
								disabled
								value={useUtils.formatWithHours(transactionData.transaction.date)}
							/>
							<Input
								label="Estado do pagamento"
								type="text"
								variant="flat"
								disabled
								value={transactionData.transaction.status}
							/>
							<Input
								label="Descrição do Pagante"
								type="text"
								variant="flat"
								disabled
								value={transactionData.transaction.emissor_description}
							/>
							<Input
								label="NIB do Pagante"
								type="text"
								variant="flat"
								disabled
								value={transactionData.transaction.accountFrom}
							/>
					</ModalBody>
					<ModalFooter>
						<Button color="success" variant="flat" onPress={async ()=>{
							setLoading2(true)
							const response = await api.get(`/generatePDF/6/${transactionData.transaction.id}`, {responseType: 'arraybuffer'});
							const blob = new Blob([response.data], { type: 'application/pdf' }); 
							const url = window.URL.createObjectURL(blob);
							
							const a = document.createElement('a');
							a.href = url;
							a.download = `comprovativo-${transactionData.transaction.id}.pdf`; 
							a.click();
							setLoading2(false)
						}}>
							{loading2 ? (
								<TailSpin
								height="25"
								width="25"
								ariaLabel="tail-spin-loading"
								radius="1"
								visible={true}
								/>
							) : (
								<TbFileDownload style={{width: "24px", height: "24px"}}/>
							)}
							
						</Button>
						<Button color="success" disabled={loading3} variant="flat" onPress={async ()=>{
							setLoading3(true)
							const response = await api.get(`/sendPDF/6/${transactionData.transaction.id}/${useClient.email}`, {responseType: 'arraybuffer'});
							if (response.status === 201) {
							  toast.success("Extrato enviado com sucesso!")
							}
							else {
							  toast.error("Falha ao enviar extrato!")
							}
							setLoading3(false)
						}}>
							{loading3 ? (
								<TailSpin
								height="25"
								width="25"
								ariaLabel="tail-spin-loading"
								radius="1"
								visible={true}
								/>
							) : (
								<IoMailOutline  style={{width: "24px", height: "24px"}}/>
							)}
							
						</Button>
						<Button color="default" variant="flat" onPress={onClose}>
							Fechar
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		:
		transactionData.transaction.transfer_type.type_id === 10  ? 	
			<Modal isOpen={isOpen} onClose={()=>{
				onClose()
				}} placement="top-center">
				<ModalContent>
					<ModalHeader className="flex flex-col gap-1">Aplicação de Depósito à Prazo
					</ModalHeader>
					<ModalBody>
							<Input
								autoFocus
								label="NIB do Aplicante"
								type="text"
								variant="flat"
								value={transactionData.transaction.accountFrom}
								disabled
							/>
							<Input
								autoFocus
								label="Descrição do Aplicante"
								type="text"
								variant="flat"
								value={transactionData.transaction.emissor_description}
								disabled
							/>
							<Input
								autoFocus
								label="Modalidade"
								type="text"
								variant="flat"
								value="Depósito à Prazo"
								disabled
							/>
							<Input
								autoFocus
								label="Descrição do produto"
								type="text"
								variant="flat"
								value={transactionData.transaction.transfer_description}
								disabled
							/>
							<Input
								label="Taxa Anual Nominal Bruta"
								type="text"
								variant="flat"
								disabled
								value={transactionData.transaction.accountTo.split('.')[0] === "1" ? "10%" : transactionData.transaction.accountTo.split('.')[0] === "2" ? "13%" : "5.50% - 7.50% - 12.50%"}
							/>
							<Input
								label="Montante aplicado"
								type="text"
								variant="flat"
								value={useUtils.formatBalance(parseInt(transactionData.transaction.balance))}
								disabled
							/>
							<Input
								label="Juros líquidos"
								type="text"
								variant="flat"
								disabled
								value={new utils().formatBalance(parseInt(transactionData.transaction.accountTo.split('.')[1]))}
							/>
							<Input
								label="Data da aplicação"
								type="text"
								variant="flat"
								disabled
								value={useUtils.formatWithoutHours(transactionData.transaction.date)}
							/>
							<Input
								label="Data de validade da aplicação"
								type="text"
								variant="flat"
								disabled
								value={useUtils.formatWithoutHours(transactionData.transaction.receptor_description)}
							/>

					</ModalBody>
					<ModalFooter>
						{/* <Button color="success" variant="flat" onPress={async ()=>{
							setLoading2(true)
							const response = await api.get(`/generatePDF/9/${transactionData.transaction.id}`, {responseType: 'arraybuffer'});
							const blob = new Blob([response.data], { type: 'application/pdf' }); 
							const url = window.URL.createObjectURL(blob);
							
							const a = document.createElement('a');
							a.href = url;
							a.download = `Comprovativo de DP-${transactionData.transaction.id}.pdf`; 
							a.click();
							setLoading2(false)
						}}>
							{loading2 ? (
								<TailSpin
								height="25"
								width="25"
								ariaLabel="tail-spin-loading"
								radius="1"
								visible={true}
								/>
							) : (
								<TbFileDownload style={{width: "24px", height: "24px"}}/>
							)}
							
						</Button>
						<Button color="success" disabled={loading3} variant="flat" onPress={async ()=>{
							setLoading3(true)
							const response = await api.get(`/sendPDF/9/${transactionData.transaction.id}/${useClient.email}`, {responseType: 'arraybuffer'});
							if (response.status === 201) {
							  toast.success("Extrato enviado com sucesso!")
							}
							else {
							  toast.error("Falha ao enviar extrato!")
							}
							setLoading3(false)
						}}>
							{loading3 ? (
								<TailSpin
								height="25"
								width="25"
								ariaLabel="tail-spin-loading"
								radius="1"
								visible={true}
								/>
							) : (
								<IoMailOutline  style={{width: "24px", height: "24px"}}/>
							)}
							
						</Button> */}
						<Button color="default" variant="flat" onPress={onClose}>
							Fechar
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		:
		transactionData.transaction.transfer_type.type_id === 11  ? 	
			<Modal isOpen={isOpen} onClose={()=>{
				onClose()
				}} placement="top-center">
				<ModalContent>
					<ModalHeader className="flex flex-col gap-1">Reembolso de Poupança Líquida
					</ModalHeader>
					<ModalBody>
							<Input
								autoFocus
								label="NIB"
								type="text"
								variant="flat"
								value={transactionData.transaction.accountTo}
								disabled
							/>
							<Input
								autoFocus
								label="Nome"
								type="text"
								variant="flat"
								value={transactionData.transaction.receptor_description}
								disabled
							/>
							<Input
								autoFocus
								label="Modalidade"
								type="text"
								variant="flat"
								value="Depósito à Prazo"
								disabled
							/>
							<Input
								autoFocus
								label="Descrição"
								type="text"
								variant="flat"
								value={transactionData.transaction.transfer_description}
								disabled
							/>
							<Input
								label="Taxa Anual Nominal Bruta"
								type="text"
								variant="flat"
								disabled
								value={transactionData.transaction.accountFrom === "1" ? "10%" : transactionData.transaction.accountFrom === "2" ? "13%" : "5.50% - 7.50% - 12.50%"}
							/>
							<Input
								label="Montante aplicado"
								type="text"
								variant="flat"
								value={useUtils.formatBalance(parseInt(transactionData.transaction.emissor_description))}
								disabled
							/>
							<Input
								label="Poupança líquida"
								type="text"
								variant="flat"
								value={useUtils.formatBalance(parseInt(transactionData.transaction.balance))}
								disabled
							/>

							<Input
								label="Data da reembolso"
								type="text"
								variant="flat"
								disabled
								value={useUtils.formatWithoutHours(transactionData.transaction.date)}
							/>


					</ModalBody>
					<ModalFooter>
						{/* <Button color="success" variant="flat" onPress={async ()=>{
							setLoading2(true)
							const response = await api.get(`/generatePDF/9/${transactionData.transaction.id}`, {responseType: 'arraybuffer'});
							const blob = new Blob([response.data], { type: 'application/pdf' }); 
							const url = window.URL.createObjectURL(blob);
							
							const a = document.createElement('a');
							a.href = url;
							a.download = `Comprovativo de DP-${transactionData.transaction.id}.pdf`; 
							a.click();
							setLoading2(false)
						}}>
							{loading2 ? (
								<TailSpin
								height="25"
								width="25"
								ariaLabel="tail-spin-loading"
								radius="1"
								visible={true}
								/>
							) : (
								<TbFileDownload style={{width: "24px", height: "24px"}}/>
							)}
							
						</Button>
						<Button color="success" disabled={loading3} variant="flat" onPress={async ()=>{
							setLoading3(true)
							const response = await api.get(`/sendPDF/9/${transactionData.transaction.id}/${useClient.email}`, {responseType: 'arraybuffer'});
							if (response.status === 201) {
							  toast.success("Extrato enviado com sucesso!")
							}
							else {
							  toast.error("Falha ao enviar extrato!")
							}
							setLoading3(false)
						}}>
							{loading3 ? (
								<TailSpin
								height="25"
								width="25"
								ariaLabel="tail-spin-loading"
								radius="1"
								visible={true}
								/>
							) : (
								<IoMailOutline  style={{width: "24px", height: "24px"}}/>
							)}
							
						</Button> */}
						<Button color="default" variant="flat" onPress={onClose}>
							Fechar
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		:
		null
		)}
    </>
  )
}