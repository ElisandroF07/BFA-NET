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
import { TailSpin } from "react-loader-spinner";

interface IClient {
  name: string[];
  gender: string;
  birthDate: Date;
}

interface ITransactions {
  accountTo: string;
  accountFrom: string;
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

export default function ReceivedTransfersList({accountNumber, accountIban}: {accountNumber: string, accountIban: string}) {

  const fetcher = (url: string) => api.get(url).then(res => res.data);
  const [transacoesEnviadas, setTransacoesEnviadas] = useState<RespostaAPI>({success: true, data: []});
  const { data: data2, error: error2, mutate: mudate2 } = useSWR(`/getReceivedTransfers/${accountNumber}/${accountIban}`, fetcher);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading2, setLoading2] = useState(false)
  const [transactionData, setTransactionData] = useState<IQuery>({status: false, client: {name: [""], birthDate: new Date(Date.now()), gender: ""}, transaction: {accountTo: "", emissor_description: "", accountFrom: "", balance: "", date: "", id: 0, receptor_description: "", status: "", transfer_description: "", transfer_type: {name: "", type_id: 0}}})
  
  useEffect(()=>{
		if (data2) {
      setTransacoesEnviadas(data2);
    }
    if (error2) {
      toast.error("Não foi possível carregar os dados da sua conta!", { description: "Sem conexão com o servidor!" });
    }
	}, [data2, error2])



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
      
      {
        transacoesEnviadas.data.map((_item) => (
          <CardTransfersTransaction
            key={_item.id}
            id={_item.id}
            balance={parseInt(_item.balance).toLocaleString('pt-AO', { style: 'currency', currency: 'AOA', maximumFractionDigits: 0 })}
            date={formatTimestamp(parseInt(_item.date))}
            status={_item.status === "Pendente" ? 3 : _item.status === "Finalizada" ? 1 : 2}
            type={_item.type === 1 ? "Transferência Interbancária" : "Transferência Intrabancária"}
            imageUrl="../assets/images/wallets/paypal.png"
            onClick={onOpen}
            accountFrom=""
            setTransactionDat={setTransactionData}
          />
        ))
      }
      {isOpen && (
				<Modal isOpen={isOpen} onClose={onClose} placement="top-center">
						<ModalContent>
										<ModalHeader className="flex flex-col gap-1">{transactionData.transaction.transfer_type.name}</ModalHeader>
										<ModalBody>
												<Input
														autoFocus
														label="Destinatário"
														type="text"
														variant="flat"
														value={transactionData.transaction.transfer_type.type_id === 6 ? "" : transactionData.client.name?.join(" ")}
														disabled
												/>
												<Input
														autoFocus
														label="Descrição do destinatário"
														type="text"
														variant="flat"
														value={transactionData.transaction.receptor_description}
														disabled
												/>
												<Input
														autoFocus
														label="Descrição da transação"
														type="text"
														variant="flat"
														value={transactionData.transaction.transfer_description}
														disabled
												/>
												<Input
														label={transactionData.transaction.accountTo.includes("AO06") ? "IBAN" : "Número de conta"}
														type="text"
														variant="flat"
														// biome-ignore lint/complexity/useOptionalChain: <explanation>
                            value={transactionData.transaction.transfer_type.type_id === 6 ? "" : (transactionData.transaction.accountTo && transactionData.transaction.accountTo.includes("AO06") ? transactionData.transaction.accountTo.match(/.{1,4}/g)?.join(' ') : formatNumber(transactionData.transaction.accountTo))}
														disabled
												/>
												<Input
														label="Montante"
														type="text"
														variant="flat"
														disabled
														value={parseInt(transactionData.transaction.balance).toLocaleString('pt-AO', { style: 'currency', currency: 'AOA', maximumFractionDigits: 0 })}
												/>
												<Input
														label="Data da transação"
														type="text"
														variant="flat"
														disabled
														value={formatTimestamp(parseInt(transactionData.transaction.date))}
												/>
												<Input
														label="Estado da transação"
														type="text"
														variant="flat"
														disabled
														value={transactionData.transaction.status}
												/>
										</ModalBody>
										<ModalFooter>
                      <Button color="success" variant="flat" onPress={async ()=>{
                          setLoading2(true)
                          const response = await api.get(`/generatePDF/1/${transactionData.transaction.id}`, {
                            responseType: 'arraybuffer' // Define o tipo de resposta como arraybuffer
                          });
                          
                          const blob = new Blob([response.data], { type: 'application/pdf' }); // Cria um objeto Blob a partir do arraybuffer
                          const url = window.URL.createObjectURL(blob); // Cria uma URL para o Blob
                          
                          const a = document.createElement('a'); // Cria um elemento <a> para o link de download
                          a.href = url; // Define o atributo href do elemento <a> com a URL do Blob
                          a.download = `comprovativo-${transactionData.transaction.id}.pdf`; // Define o atributo download do elemento <a> com o nome do arquivo
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
			)}
    </>
  )
}