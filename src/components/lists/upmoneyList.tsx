/* eslint-disable react-hooks/exhaustive-deps */
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import api from "@/services/api";
import useSWR from "swr";
import Skeleton from "react-loading-skeleton";
import { useDisclosure, Modal, ModalContent, ModalHeader, ModalBody, Input, ModalFooter, Button } from "@nextui-org/react";
import CardUpmoney from "../cards/cardUpmoney";
import { toast } from "sonner";
import useAccountStore from "@/contexts/stores/accountStore";
import utils from "@/services/utils";
import { TailSpin } from "react-loader-spinner";

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

interface IProps {
  accountNumber: string,
  upmoneyList: IQuery,
  setUpmoneyList: Dispatch<SetStateAction<IQuery>>
}

export default function UpmoneyList({accountNumber, upmoneyList, setUpmoneyList}: IProps) {

  const useAccount = useAccountStore()
  const fetcher = (url: string) => api.get(url).then(res => res.data);
  const { data, error } = useSWR(`/getUpmoneys/${useAccount.nbi}`, fetcher);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const useUtils = new utils
  const [loading, setLoading] = useState(false)
  const [upData, setUpData] = useState<IUpmoneys>({accountFrom: "", balance: 0, date: "", id: 0, number: "", status: 0, transferId: 0, transfers: {accountFrom: "", accountTo: "", balance: "", date: "", emissor_description: "", id: 0, receptor_description: "", status: "", transfer_description: "", transfer_type: {name: "", type_id: 0}}})

  useEffect(()=>{
    if (data) {
      setUpmoneyList(data)
    }
    if (error) {
      setUpmoneyList({success: false, data: []})
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

    return `${day} ${month} ${year}`;
  }

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

  function getFullDate(timestamp: number) {
    const data = new Date(timestamp);
    data.setHours(data.getHours());
  
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    const hora = String(data.getHours()).padStart(2, '0');
    const minutos = String(data.getMinutes()).padStart(2, '0');
  
    return `${dia}/${mes}/${ano} - ${hora}:${minutos}`;
  }

  async function cancelUpmoney(id: number) {
    try {
      const response = await api.put(`/cancelUpmoney/${id}`);
      if (response.data.success) {
        setUpmoneyList({success: true, data: response.data.upmoneyList})
        useAccount.updateAuthorizedBalance(response.data.balance.authorized_balance)
        useAccount.updateAvailableBalance(response.data.balance.available_balance)
        useAccount.updateUpBalance(response.data.balance.up_balance)
        toast.success(response.data.message)
        onClose()
      }
      else {
        toast.error(response.data.message)
      }
    }
    catch {
      toast.error("Sem conexão com o servidor!")
    }
  }

  return (
    <>
      {(!upmoneyList && !error) && (
        <>
          <Skeleton borderRadius={10} height={50} style={{ width: "100%" }} />
          <Skeleton borderRadius={10} height={50} style={{ width: "100%" }} />
          <Skeleton borderRadius={10} height={50} style={{ width: "100%" }} />
        </>
      )}


      {upmoneyList && upmoneyList.data.length === 0 && !error && (
        <div className="withoutTransactions">
        Não há transações
      </div>
      )}


      {upmoneyList && upmoneyList.data.length > 0 && !error && (
        upmoneyList.data.map((_item) => (
          <CardUpmoney
            key={_item.id}
            balance={_item.balance.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA', maximumFractionDigits: 2 })}
            date={formatTimestamp(parseInt(_item.date))}
            status={_item.status}
            id={_item.id}
            setUpData={setUpData}
            onOpen={onOpen}
          />
        ))
      )}


      {isOpen && (
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
                    value={upData.transfers.emissor_description}
                    disabled
                  />
                  <Input
                    autoFocus
                    label="NIB do Emissor"
                    type="text"
                    variant="flat"
                    value={upData.accountFrom}
                    disabled
                  />
                  <Input
                    label="Montante"
                    type="text"
                    variant="flat"
                    value={useUtils.formatBalance(upData.balance)}
                    disabled
                  />
                  <Input
                    label="Data de validade"
                    type="text"
                    variant="flat"
                    disabled
                    value={useUtils.addOneDay(upData.date)}
                  />
                  <Input
                    label="Estado do levantamento"
                    type="text"
                    variant="flat"
                    disabled
                    value={upData.status === 1 ? "Pendente" : upData.status === 2 ? "Finalizado" : upData.status === 3 ? "Cancelado" : "Expirado"}
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
                <Button variant="flat" color="danger" disabled={loading} onPress={async ()=>{
                  setLoading(true)
                  const resp = await api.put(`/cancelUpmoney/${upData.transferId}`)
                  if (resp.data.success) {
                    toast.success("Levantamento cancelado com sucesso!")
                    useAccount.updateAuthorizedBalance(resp.data.balance.authorized_balance)
                    useAccount.updateAvailableBalance(resp.data.balance.available_balance)
                    useAccount.updateUpBalance(resp.data.balance.up_balance)
                    setUpmoneyList({success: true, data: resp.data.upmoneyList})
                    onClose()
                  }
                  else {
                    toast.error("Falha ao cancelar levantamento!")
                  }
                  setLoading(false)
                }}>{loading ? (
                  <TailSpin
                  height="25"
                  width="25"
                  color="#f00"
                  ariaLabel="tail-spin-loading"
                  radius="1"
                  visible={true}
                  />
                ) : (
                  'Cancelar levantamento'
                )}</Button>
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