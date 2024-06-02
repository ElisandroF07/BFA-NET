"use client"

import useAccountStore from "@/contexts/stores/accountStore"
import useClientStore from "@/contexts/stores/clientStore"
import { ChangeEvent, useEffect, useState } from "react"
import '@/styles/deposit.css'
import Link from "next/link"
import { toast } from "sonner"
import { Button, Select, SelectItem, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure, Checkbox } from "@nextui-org/react";
import TwoFAModal from "@/components/modals/2faModal";
import api from "@/services/api";
import utils from "@/services/utils"
import { TailSpin } from "react-loader-spinner"
import axios from "axios"

export default function Deposit(){

  const useAccount = useAccountStore()
  const [loading, setLoading] = useState(false)
  const [selectedDP, setSelectedDP] = useState<number | null>(null)
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null)
  const [balance, setBalance] = useState<number>(0)
  const [tanb, setTanb] = useState(0)
  const [jurosBrutos, setJurosBrutos] = useState(0)
  const [jurosLiquidos, setJurosLiquidos] = useState(0)
  const [retencao, setRetencao] = useState(0)
  const [isCheckbox1Checked, setIsCheckbox1Checked] = useState(false);
  const [patrimonioLiquido, setPatrimonioLiquido] = useState(0)
  const { isOpen: isOpen2FA, onOpen: onOpen2FA, onClose: onClose2FA } = useDisclosure();
	const { isOpen, onOpen, onClose } = useDisclosure();
  const useClient = useClientStore()

  const handleDPChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(e.target.value);
    setSelectedDP(value);
    setSelectedDuration(null);
    setBalance(0)  // Reset duration when changing DP
  };

  const handleDurationChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(e.target.value);
    setSelectedDuration(value);
    setRetencao(0)
    setJurosBrutos(0)
    setJurosLiquidos(0)
    setPatrimonioLiquido(0)
  };



  function simulate() {
    if (selectedDP === 1 && balance < 100000) {
      toast.error("O montante mínimo são Kz 100 000")
      setBalance(0)
    }
    else if (selectedDP === 2 && balance < 500000) {
      toast.error("O montante mínimo são Kz 500 000")
      setBalance(0)
    }
    else if (selectedDP === 3 && balance < 100000) {
      toast.error("O montante mínimo são Kz 100 000")
      setBalance(0)
    }
    else {
      const taxa_de_retencao = 10
      if (selectedDP === 3) {
        let juros_brutos1 = balance * ((5.50/100) * ((90 || 0)/365))
        let retencao1 = juros_brutos1 * (taxa_de_retencao/100)
        let juros_liquidos1 = juros_brutos1 - retencao1


        let juros_brutos2 = balance * ((7.50/100) * ((90 || 0)/365))
        let retencao2 = juros_brutos2 * (taxa_de_retencao/100)
        let juros_liquidos2 = juros_brutos2 - retencao2

        let juros_brutos3 = balance * ((12.50/100) * ((90 || 0)/365))
        let retencao3 = juros_brutos3 * (taxa_de_retencao/100)
        let juros_liquidos3 = juros_brutos3 - retencao3

        console.log(juros_brutos1)
        console.log(juros_brutos2)
        console.log(juros_brutos3)
        setPatrimonioLiquido(balance + juros_liquidos1 + juros_liquidos2 + juros_liquidos3)
        setJurosBrutos(juros_brutos1 + juros_brutos2 + juros_brutos3)
        setJurosLiquidos(juros_liquidos1 + juros_liquidos2 + juros_liquidos3)
        setRetencao(retencao1 + retencao2 + retencao3)
      }
      else {
        let juros_brutos = balance * ((tanb/100) * ((selectedDuration || 0)/365))
        let retencao = juros_brutos * (taxa_de_retencao/100)
        let juros_liquidos = juros_brutos - retencao
        let patrimonio_liquido = balance + juros_liquidos
        setPatrimonioLiquido(patrimonio_liquido)
        setJurosBrutos(juros_brutos)
        setJurosLiquidos(juros_liquidos)
        setRetencao(retencao)
      }

    }
  }

  useEffect(()=>{
    if (selectedDP === 1) {
      setTanb(10)
    }
    else if (selectedDP === 2) {
      setTanb(13)
    }
    else {
      setTanb(8.5)
    }
  }, [selectedDP])

  async function submitForm2FA(data: {otp: string}) {
		setLoading(true)
		try {
			const response = await api.get(`/check2FA/${data.otp}/${useClient.biNumber}`)
			if (response.data.valid) {
            const body = JSON.stringify({
              "account": useAccount.number,
              "type": selectedDP,
              "balance": balance,
              "duration": selectedDuration
            })
        		const response = await api.post("/apply", body)
				if (response.status === 201) {
					useAccount.updateAuthorizedBalance(response.data.authorized_balance)
					useAccount.updateAvailableBalance(response.data.availabe_balance)
					toast.success("Aplicação realizada com sucesso!")
					setLoading(false)
					setLoading(false)
					onClose2FA()
					onClose()
				} 
				else {
					toast.error(response.data.message)
					setLoading(false)
				}
			}
			else {
				toast.error("Código de acesso incorreto!")
				setLoading(false)
			}
        }
		catch{
			toast.error("Sem conexão com o servidor")
			setLoading(false)
		}
	}

  return(
    <div className="payments_container">
    <div className="payments_header">
      <div className="top">
        <h1>Depósitos</h1>
        <p>Aplicação de depósito à prazo.</p>
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
     <div className="body_content w-full h-full flex flex-col py-[30px]">
     <div className="cardDeposit">
      <h2>DP BFA 10%</h2>
      <p>O BFA disponibiliza na sua oferta o DP BFA 10%, um depósito a prazo em Kwanzas, a uma taxa bastante atractiva com o propósito de captação de dinheiro novo.</p>
      <div className="infos">
        <div className="part">
          <h3>Duração</h3>
          <p>180 | 365 Dias (renovável automaticamente)</p>
        </div>
        <div className="part">
          <h3>TANB</h3>
          <p>10%</p>
        </div>
        <div className="part">
          <h3>Montante mínimo</h3>
          <p>Kz 100 000</p>
        </div>
        <div className="part">
          <h3>Montante máximo</h3>
          <p>-</p>
        </div>
      </div>
      <div className="actionButtons"><Link target="_blank" href="https://www.bfa.ao/media/4249/ficha-tecnica-informativa-dp-bfa-10.pdf">Ficha técnica</Link> <button type="button" onClick={onOpen}>Constituir</button></div>
     </div>
     <div className="cardDeposit">
      <h2>DP BFA 13%</h2>
      <p>O BFA disponibiliza na sua oferta o DP BFA 13%, um produto de investimento em Kwanzas a 540 dias e uma taxa bastante atractiva. Uma excelente alternativa para rentabilizar os seus recursos.</p>
      <div className="infos">
        <div className="part">
          <h3>Duração</h3>
          <p>540 Dias (renovável automaticamente)</p>
        </div>
        <div className="part">
          <h3>TANB</h3>
          <p>13%</p>
        </div>
        <div className="part">
          <h3>Montante mínimo</h3>
          <p>Kz 500 000</p>
        </div>
        <div className="part">
          <h3>Montante máximo</h3>
          <p>-</p>
        </div>
      </div>
      <div className="actionButtons"><Link target="_blank" href="https://www.bfa.ao/media/4250/ficha-tecnica-informativa-dp-bfa-13.pdf">Ficha técnica</Link> <button type="button" onClick={onOpen}>Constituir</button></div>
     </div>
     <div className="cardDeposit">
      <h2>DP ESPECIAL CRESCENTE</h2>
      <p>Aplicação de curto prazo com taxas de juro crescente, que visa rentabilização dos recursos aplicados exclusivamente via BFA Net e BFA App.</p>
      <div className="infos">
        <div className="part">
          <h3>Duração</h3>
          <p>3 Mêses</p>
        </div>
        <div className="part">
          <h3>TANB</h3>
          <p>5,50% / 7,50% / 12,50%</p>
        </div>
        <div className="part">
          <h3>Montante mínimo</h3>
          <p>Kz 100 000</p>
        </div>
        <div className="part">
          <h3>Montante máximo</h3>
          <p>-</p>
        </div>
      </div>
      <div className="actionButtons"><Link target="_blank" href="https://www.bfa.ao/media/5506/ficha-te-cnica-informativa-dp-especial-crescente.pdf">Ficha técnica</Link> <button type="button" onClick={onOpen}>Constituir</button></div>
     </div>
     </div>
      
    </div>
    <div className="lateral">
      <h1 className="title" style={{margin: "10px 0px 0px 0px"}}>Simulador</h1>
      <div className="separator" />
      <div className="requests">
      <Select
        label="Modalidade de DP"
        onChange={handleDPChange}
        className="max-w-xs"
        value={selectedDP !== null ? selectedDP : ""}
      >
        <SelectItem key={1} value={1}>
          DP BFA 10%
        </SelectItem>
        <SelectItem key={2} value={2}>
          DP BFA 13%
        </SelectItem>
        <SelectItem key={3} value={3}>
          DP BFA CRESCENTE
        </SelectItem>
      </Select>

      {selectedDP === 1 && (
        <Select
          label="Duração"
          className="max-w-xs"
          onChange={handleDurationChange}
          value={selectedDuration !== null ? selectedDuration : ""}
        >
          <SelectItem key="180" value={180}>
            180 DIAS
          </SelectItem>
          <SelectItem key="365" value={365}>
            365 DIAS
          </SelectItem>
        </Select>
      )}

      {selectedDP === 2 && (
        <Select
          label="Duração"
          className="max-w-xs"
          onChange={handleDurationChange}
          value={selectedDuration !== null ? selectedDuration : ""}
        >
          <SelectItem key="540" value={540}>
            540 DIAS
          </SelectItem>
        </Select>
      )}

      {selectedDP === 3 && (
        <Select
          label="Duração"
          className="max-w-xs"
          onChange={handleDurationChange}
          value={selectedDuration !== null ? selectedDuration : ""}
        >
          <SelectItem key="90" value={90}>
            3 MÊSES
          </SelectItem>
        </Select>
      )}
      <div className="infoContainer" style={{paddingBottom: "0px", gap: "15px"}}>
          {
            <>
              {[
                { label: "TANB", value: `${selectedDP === 1 ? '10%' : selectedDP === 2 ? '13%' : '5,50% | 7,50% | 12,50%'}` },
                { label: "Montante Mínimo", value: `${selectedDP === 1 ? 'Kz 100 000' : selectedDP === 2 ? 'Kz 500 000' : 'Kz 100 000'}` },
                { label: "Montante Máximo", value:"-" },
                
              ].map((item, index) => (
                <div key={item.label}>
                  <h1>{item.label}</h1>
                  <p>{item.value}</p>
                </div>
              ))}
            </>
          }
        </div>
        <div className="separator" />
        <div id="Kz" className="input_montante" style={{marginTop: "0px"}}>
          <p>Kz</p>
          <input
            type="text"
            className="montante"
            placeholder="Montante à aplicar"
            pattern="[0-9]*" onInput={(event)=>{
              event.currentTarget.value = event.currentTarget.value.replace(/[^0-9]/g, '');
            }}
            maxLength={6}
            onChange={(e) => setBalance(parseInt(e.target.value))}
            value={balance}
          />
        </div>
        <button className="botao" disabled={(!selectedDP && !selectedDuration && !balance)} type="submit" style={{backgroundColor: "var(--color-focus3)", marginTop: "0px"}} onClick={()=>{
          simulate()
        }}>
					Simular
				</button>
        <div className="separator" />
        <div className="infoContainer" style={{paddingBottom: "0px", gap: "15px"}}>
          {
            <>
              {[
                { label: "Juros brutos", value: new utils().formatBalance(jurosBrutos) },
                { label: "Retenção", value: new utils().formatBalance(retencao) },
                { label: "Juros líquidos", value: new utils().formatBalance(jurosLiquidos) },
                { label: "Poupança líquida", value: new utils().formatBalance(patrimonioLiquido) },
                
              ].map((item, index) => (
                <div key={item.label}>
                  <h1>{item.label}</h1>
                  <p>{item.value}</p>
                </div>
              ))}
            </>
          }
        </div>
      </div>
    </div>
    {isOpen && (
            <Modal isOpen={isOpen} onClose={onClose} placement="top-center">
                <ModalContent>
                        <ModalHeader className="flex flex-col gap-1">Aplicação de Depóstio à Prazo</ModalHeader>
                        <ModalBody>
                        <Input
                                label="Conta"
                                type="text"
                                variant="flat"
                               	value={useAccount.number.replaceAll('.', ' ')}
								                disabled
                            />  
                        <Select
                              label="Produto"
                              onChange={handleDPChange}
                              
                              value={selectedDP !== null ? selectedDP : ""}
                            >
                              <SelectItem key={1} value={1}>
                                DP BFA 10%
                              </SelectItem>
                              <SelectItem key={2} value={2}>
                                DP BFA 13%
                              </SelectItem>
                              <SelectItem key={3} value={3}>
                                DP BFA CRESCENTE
                              </SelectItem>
                            </Select>
                            <Input
                                autoFocus
                                label="Modalidade"
                                type="text"
                                variant="flat"
                                value='Depósito à Prazo'
																disabled
                            />
                            <Input
                                autoFocus
                                label="Taxa Anual Nominal Bruta"
                                type="text"
                                variant="flat"
                                value={selectedDP === 1 ? '10%' : selectedDP === 2 ? '13%' : '5,50% - 7,50% - 12,50%'}
																disabled
                            />
                            {selectedDP === 1 && (
                              <Select
                                label="Duração"
                               
                                onChange={handleDurationChange}
                                value={selectedDuration !== null ? selectedDuration : ""}
                              >
                                <SelectItem key="180" value={180}>
                                  180 DIAS
                                </SelectItem>
                                <SelectItem key="365" value={365}>
                                  365 DIAS
                                </SelectItem>
                              </Select>
                            )}

                            {selectedDP === 2 && (
                              <Select
                                label="Duração"
                                
                                onChange={handleDurationChange}
                                value={selectedDuration !== null ? selectedDuration : ""}
                              >
                                <SelectItem key="540" value={540}>
                                  540 DIAS
                                </SelectItem>
                              </Select>
                            )}

                            {selectedDP === 3 && (
                              <Select
                                label="Duração"
                                
                                onChange={handleDurationChange}
                                value={selectedDuration !== null ? selectedDuration : ""}
                              >
                                <SelectItem key="90" value={90}>
                                  3 MÊSES
                                </SelectItem>
                              </Select>
                            )}
                            <Input
                                label="Montante mínimo"
                                type="text"
                                variant="flat"
                               	value={`${selectedDP === 1 ? 'Kz 100 000' : selectedDP === 2 ? 'Kz 500 000' : 'Kz 100 000'}`}
								                disabled
                            />                      
                            <Input
                                label="Montante à aplicar"
                                type="text"
                                variant="flat"
                                pattern="[0-9]*" onInput={(event)=>{
                                  event.currentTarget.value = event.currentTarget.value.replace(/[^0-9]/g, '');
                                }}
                                maxLength={9}
                                onChange={(e) => {
                                  if (parseInt(e.target.value) > useAccount.authorized_balance){
                                    toast.warning('O saldo da sua conta é insuficiente!.', {description: "Opte por simular uma aplicação."})
                                  } 
                                  setBalance(parseInt(e.target.value))
                                }}
                                value={balance.toString()}
                            />
                            <Checkbox
                              style={{marginBottom: "5px", marginTop: "5px"}}
                              onChange={(event)=>setIsCheckbox1Checked(event.target.checked)}
                              classNames={{
                              label: "text-small",
                              }}>
                              Lí e aceito as condições do <a style={{color: "var(--color-focus)", textDecoration: "underline"}} href="https://bfa.ao/media/1586/ficha-de-adesao-de-produtos-e-servicos_conta-a-ordem.pdf" target="_blank" rel="external">Contrato de Adesão à Produtos e Serviços.</a>
                          </Checkbox> 
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="flat" onPress={onClose}>
                                Cancelar
                            </Button>
                            <Button color="primary" type="button" disabled={loading || !isCheckbox1Checked} onPress={async()=>{
                             setLoading(true)
                             let balancee =  0
                             if (selectedDP === 1)
                            {
                              balancee = 100000
                            }
                            else if (selectedDP === 2)
                            {
                              balancee = 500000
                            }
                            else if (selectedDP === 1)
                            {
                              balancee = 100000
                            }
                            if (balance < balancee) {
                              toast.error('Montante inferior ao mínimo!')
                              setBalance(0)
                              setLoading(false)
                            } 
                            else {
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
                             

                              }}>
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
                                <>Confirmar</>
                              )}
                            </Button>
                        </ModalFooter>
                </ModalContent>
            </Modal>
        )}
		<TwoFAModal isOpen2FA={isOpen2FA} onClose2FA={onClose2FA} onOpen2FA={onOpen2FA} submitForm2FA={submitForm2FA} loading={loading}/>
  </div>
  
  )
}