
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
import CardReference from "../cards/cardReference";
import useAccountStore from "@/contexts/stores/accountStore";


interface IReferences {
  id: number,
  reference: string,
  description: string,
  balance: number,
  date: string,
  state: number,
  entity: string,
  emissor_description: string
  payer_description: string,
  payer_nbi: string
}

interface IQuery { 
  success: boolean;
  references: IReferences[],
}

interface IProps {
  accountNumber: string
}

export default function ReferenceList({accountNumber}: IProps) {

  const fetcher = (url: string) => api.get(url).then(res => res.data);
  const useAccount = useAccountStore()
  const { data, error } = useSWR(`/getReferences/${useAccount.nbi}`, fetcher);
  const [references, setReferences] = useState<IQuery>({success: false, references: []})
  const [referenceData, setReferenceData] = useState<IReferences>({balance: 0, payer_description: "", emissor_description: "", payer_nbi: "", date: "", description: "", entity: "", id: 0, reference: "", state: 0})
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading2, setLoading2] = useState(false)


  useEffect(()=>{
    if (data) {
      setReferences(data)
    }
    if (error) {
      setReferences({success: false, references: []})
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
      {(!references && !error) && (
        <>
          <Skeleton borderRadius={10} height={50} style={{ width: "100%" }} />
          <Skeleton borderRadius={10} height={50} style={{ width: "100%" }} />
          <Skeleton borderRadius={10} height={50} style={{ width: "100%" }} />
        </>
      )}


      {references && references.references.length === 0 && !error && (
        <div className="withoutTransactions">
        Não há referências
      </div>
      )}


      {references && references.references.length > 0 && !error && (
        references.references.map((_item) => (
          <CardReference
            key={_item.id}
            id={_item.id}
            balance={_item.balance.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA', maximumFractionDigits: 0 })}
            date={_item.reference}
            status={_item.state}
            onClick={()=>{
              onOpen()
            }}
            setReferenceData={setReferenceData}
          />
        ))
      )}


      {isOpen &&(
        <Modal isOpen={isOpen} onClose={()=>{
        onClose()
        }} placement="top-center">
                        <ModalContent>
                          <ModalHeader className="flex flex-col gap-1">Referencia de pagamento</ModalHeader>
                          <ModalBody>
                                  <Input
                                    autoFocus
                                    label="NIB Entidade emissora"
                                    type="text"
                                    variant="flat"
                                    value={referenceData.entity}
                                    disabled
                                  />
                                  <Input
                                    autoFocus
                                    label="Descrição da Entidade emissora"
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
                                                <Input
                                                        label="Estado da referência"
                                                        type="text"
                                                        variant="flat"
                                                        disabled
                                                        value={referenceData.state === 1 ? "Aguardado pagamento" : referenceData.state === 2 ? "Pagamento finalizado" : ""}
                                                />
                                                {referenceData.payer_description && <Input
                                                        label="Descrição do pagante"
                                                        type="text"
                                                        variant="flat"
                                                        disabled
                                                        value={referenceData.payer_description}
                                                />}
                                                {referenceData.payer_nbi && <Input
                                                        label="NIB do Pagante"
                                                        type="text"
                                                        variant="flat"
                                                        disabled
                                                        value={referenceData.payer_nbi}
                                                />}
                                        </ModalBody>
                                        <ModalFooter>
                                          <Button color="success" variant="flat" onPress={async ()=>{
                                              setLoading2(true)
                                              const response = await api.get(`/generatePDF/5/${referenceData.id}`, {
                                                responseType: 'arraybuffer' // Define o tipo de resposta como arraybuffer
                                              });
                                              
                                              const blob = new Blob([response.data], { type: 'application/pdf' }); // Cria um objeto Blob a partir do arraybuffer
                                              const url = window.URL.createObjectURL(blob); // Cria uma URL para o Blob
                                              
                                              const a = document.createElement('a'); // Cria um elemento <a> para o link de download
                                              a.href = url; // Define o atributo href do elemento <a> com a URL do Blob
                                              a.download = `referencia-${referenceData.id}.pdf`; // Define o atributo download do elemento <a> com o nome do arquivo
                                              a.click();
                                                setLoading2(false)
                                                //window.open(response)
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
                                          <Button color="danger" variant="flat" disabled={loading2} onPress={async()=>{
                                                  setLoading2(true)
                                                  const response = await api.post(`/cancelReference/${referenceData.id}`) 
                                                    setReferences(response.data)
                                                    toast.success("Referência cancelada com sucesso!")
                                                    onClose()
                                                    setLoading2(false)
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
                                                        'Cancelar referência'
                                                      )}
                                          </Button>
                                          <Button color="default" variant="flat" onPress={()=>{
                                            onClose()
                                            }}>
                                              Fechar
                                          </Button>
                                      </ModalFooter>
                        </ModalContent>
        </Modal>
      )}
    </>
  )
}