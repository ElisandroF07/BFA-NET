import { Dispatch, SetStateAction, useEffect, useState } from "react";
import CardDashboardTransaction from "../cards/cardDashboardTransaction";
import api from "@/services/api";
import useSWR from "swr";
import Skeleton from "react-loading-skeleton";
import { useDisclosure, Modal, ModalContent, ModalHeader, ModalBody, Input, ModalFooter, Button } from "@nextui-org/react";
import CardUpmoney from "../cards/cardUpmoney";
import CardPay from "../cards/cardPay";
import { TbFileDownload } from "react-icons/tb";
import { TailSpin } from "react-loader-spinner";
import { toast } from "sonner";
import utils from "@/services/utils";
import useAccountStore from "@/contexts/stores/accountStore";
import { IoMailOutline } from "react-icons/io5";
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

export default function PayList({accountNumber}: IProps) {

  const fetcher = (url: string) => api.get(url).then(res => res.data);
  const { data, error } = useSWR(`/getTransactions/${accountNumber}`, fetcher);
  const [transactionData, setTransactionData] = useState<IQuery>({status: false, client: {name: [""], birthDate: new Date(Date.now()), gender: ""}, transaction: {accountFrom: "", emissor_description: "", accountTo: "", balance: "", date: "", id: 0, receptor_description: "", status: "", transfer_description: "", transfer_type: {name: "", type_id: 0}}})
  const { isOpen, onOpen, onClose } = useDisclosure();
  const useUtils = new utils
  const useAccount = useAccountStore()
  const useClient = useClientStore()
  const [loading2, setLoading2] = useState(false)
  const [loading3, setLoading3] = useState(false)
  const [transactions, setTransactions] = useState<ITransaction | null>(null);


  useEffect(()=>{
    if (data) {
      setTransactions(data)
    }
    if (error) {
      setTransactions({success: false, transactions: []})
    }
  }, [data, error])

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
        Não há pagamentos
      </div>
      )}


      {transactions && transactions.transactions.length > 0 && !error && (
        transactions.transactions.map((_item) => (
          _item.transfer_type.type_id === 7 ? 
          <CardPay
            key={_item.id}
            id={_item.id}
            balance={parseInt(_item.balance).toLocaleString('pt-AO', { style: 'currency', currency: 'AOA', maximumFractionDigits: 0 })}
            date={_item.receptor_description}
            status={1}
            type={_item.transfer_type.name}
            imageUrl="../assets/images/wallets/paypal.png"
            onClick={()=>{
              onOpen()
            }}
            setTransactionData={setTransactionData}
            accountFrom={_item.accountFrom}
          />
          : _item.transfer_type.type_id === 8 ?
          <CardPay
            key={_item.id}
            id={_item.id}
            balance={parseInt(_item.balance).toLocaleString('pt-AO', { style: 'currency', currency: 'AOA', maximumFractionDigits: 0 })}
            date={_item.receptor_description}
            status={1}
            type={_item.transfer_type.name}
            imageUrl="../assets/images/wallets/paypal.png"
            onClick={()=>{
              onOpen()
            }}
            setTransactionData={setTransactionData}
            accountFrom={_item.accountFrom}
          />
          : _item.transfer_type.type_id === 9 && _item.accountFrom === useAccount.nbi ?
          <CardPay
            key={_item.id}
            id={_item.id}
            balance={parseInt(_item.balance).toLocaleString('pt-AO', { style: 'currency', currency: 'AOA', maximumFractionDigits: 0 })}
            date={_item.receptor_description}
            status={1}
            type={_item.transfer_type.name}
            imageUrl="../assets/images/wallets/paypal.png"
            onClick={()=>{
              onOpen()
            }}
            setTransactionData={setTransactionData}
            accountFrom={_item.accountFrom}
          />
          : null
        ))
      )}


      {isOpen && (
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
        null
        )}
    </>
  )
}