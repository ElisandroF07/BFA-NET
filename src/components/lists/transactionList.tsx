import { Dispatch, SetStateAction, useEffect, useState } from "react";
import CardDashboardTransaction from "../cards/cardDashboardTransaction";
import api from "@/services/api";
import useSWR from "swr";
import Skeleton from "react-loading-skeleton";
import { useDisclosure, Modal, ModalContent, ModalHeader, ModalBody, Input, ModalFooter, Button } from "@nextui-org/react";

interface ITransactions {
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
  const [transactionData, setTransactionData] = useState<IQuery>({status: false, client: {name: [], birthDate: new Date(Date.now()), gender: ""}, transaction: {accountTo: "", balance: "", date: "", id: 0, receptor_description: "", status: "", transfer_description: "", transfer_type: {name: "", type_id: 0}}})
  const { isOpen, onOpen, onClose } = useDisclosure();
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
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
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
            imageUrl="../assets/images/wallets/paypal.png"
            onClick={onOpen}
            setTransactionData={setTransactionData}
          />
        ))
      )}
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
														value={transactionData.client.name.join(" ")}
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
value={transactionData.transaction.accountTo && transactionData.transaction.accountTo.includes("AO06") ? transactionData.transaction.accountTo.match(/.{1,4}/g)?.join(' ') : formatNumber(transactionData.transaction.accountTo)}
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