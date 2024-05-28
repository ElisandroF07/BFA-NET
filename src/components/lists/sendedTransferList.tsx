import { Dispatch, SetStateAction, useEffect, useState } from "react";
import CardDashboardTransaction from "../cards/cardDashboardTransaction";
import api from "@/services/api";
import useSWR from "swr";
import Skeleton from "react-loading-skeleton";
import { useDisclosure, Modal, ModalContent, ModalHeader, ModalBody, Input, ModalFooter, Button } from "@nextui-org/react";
import error from "next/error";
import { toast } from "sonner";
import { TbFileDownload } from "react-icons/tb";
import CardTransfersTransaction from "../cards/cardTransfersTransaction";
import { TailSpin } from 'react-loader-spinner'
import utils from "@/services/utils";
import useAccountStore from "@/contexts/stores/accountStore";

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

interface Transacao {
  balance: string;
  accountTo: string | null;
  date: string;
  status: 'Finalizada' | 'Cancelado' | 'Pendente'; // Ajuste conforme os possíveis valores
  type: number;
  id: number;
}

interface RespostaAPI {
  success: boolean;
  data: Transacao[];
}

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

interface ITransaction {
  success: boolean;
  transactions: ITransactions[];
}

export default function SendedTransfersList({accountNumber}: {accountNumber: string}) {

  const fetcher = (url: string) => api.get(url).then(res => res.data);
  const [transacoesEnviadas, setTransacoesEnviadas] = useState<ITransaction>({success: true, transactions: []});
  const { data: data2, error: error2, mutate:mudate2 } = useSWR(`/getTransactions/${accountNumber}`, fetcher);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const useUtils = new utils
  const useAccount = useAccountStore()
  const [loading2, setLoading2] = useState(false)
  const [transactionData, setTransactionData] = useState<IQuery>({status: false, client: {name: [""], birthDate: new Date(Date.now()), gender: ""}, transaction: {accountFrom: "", emissor_description: "", accountTo: "", balance: "", date: "", id: 0, receptor_description: "", status: "", transfer_description: "", transfer_type: {name: "", type_id: 0}}})
  
  useEffect(()=>{
		if (data2) {
      setTransacoesEnviadas(data2);
    }
    if (error2) {
      toast.error("Não foi possível carregar os dados da sua conta!", { description: "Sem conexão com o servidor!" });
    }
	}, [data2, error2])



  

  return (
    <>

    {transacoesEnviadas && transacoesEnviadas.transactions.length === 0 && !error2 && (
        <div className="withoutTransactions">
        Sem transferências
      </div>
      )}

      {
        transacoesEnviadas.transactions.map((_item) => (
          _item.transfer_type.type_id === 2 ? (
              <CardTransfersTransaction
              key={_item.id}
              id={_item.id}
              balance={_item.balance}
              date={useUtils.formatWithHours(_item.date)}
              status={_item.status === "Pendente" ? 3 : _item.status === "Finalizada" ? 1 : 2}
              type={"Intrabancária"}
              imageUrl="../assets/images/wallets/paypal.png"
              onClick={onOpen}
              setTransactionDat={setTransactionData}
              accountFrom={_item.accountFrom}
            />
          ) : _item.transfer_type.type_id === 1 ? (
              <CardTransfersTransaction
              key={_item.id}
              id={_item.id}
              balance={_item.balance}
              date={useUtils.formatWithHours(_item.date)}
              status={_item.status === "Pendente" ? 3 : _item.status === "Finalizada" ? 1 : 2}
              type={"Interbancária"}
              imageUrl="../assets/images/wallets/paypal.png"
              onClick={onOpen}
              setTransactionDat={setTransactionData}
              accountFrom={_item.accountFrom}
            />
          ) : null
        ))
      }


      {isOpen && (
				transactionData.transaction.transfer_type.type_id === 1  ? 
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