"use client"

import useStepsStore from "@/contexts/stores/stepsStore";
import { Button, Checkbox, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MutatingDots, TailSpin } from "react-loader-spinner";
import {z} from "zod"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InfoError from "@/components/others/infoError";

const formSchema1 = z.object({
    check1: z.any(),
    check2:  z.any(),
    check3: z.any(),
})

type formType = z.infer<typeof formSchema1>

export default function AccountType() {
    const [account, setAccount] = useState("")
    const [isCheckbox1Checked, setIsCheckbox1Checked] = useState(false);
    const [isCheckbox2Checked, setIsCheckbox2Checked] = useState(false);
    const [isCheckbox3Checked, setIsCheckbox3Checked] = useState(false);
    const [isCheckbox4Checked, setIsCheckbox4Checked] = useState(false);
    const [isCheckbox5Checked, setIsCheckbox5Checked] = useState(false);
    const router = useRouter()
    const useStore = useStepsStore()
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const { isOpen: isOpen2, onOpen: onOpen2, onOpenChange: onOpenChange2, onClose: onClose2 } = useDisclosure();
    const [loading, setLoading] = useState(false)

    const {handleSubmit, formState: {errors}, register} = useForm<formType>({
        resolver: zodResolver(formSchema1)
    })

    useEffect(()=>{
        const cards = document.querySelectorAll('.cardType') as NodeListOf<HTMLDivElement>
        for( let card of cards) {
            card.addEventListener('click', () => {
                for( let carddd of cards) {
                    carddd.dataset.active = "false"
                }
                card.dataset.active = "true"
                setAccount(card.id)
            })
        }
    }, [])

    function submitForm(data: formType) {
        console.log(data)
    }

    return (
        <div>
			<div className="header_form">
				<h1>Tipo de conta</h1>
				<p>
					Assistente de criação de contas simplificadas. <br /> Selecione a finalidade da conta
				</p>
			</div>
			<div className="body_form">
                <div className="accountTypes">
                    <div className="cardType" data-active="false" id="c1">
                        <div className="image"/>
                        <div className="text">
                            <h2>Pessoal</h2>
                            <div className="info">
                            <a href={`https://www.bfa.ao/media/2954/fti-conta-a-ordem-bfa_21042021.pdf`} rel={'external'} target="_blank">Ficha técnica informativa</a>
                            </div>
                        </div>
                    </div>
                    <div className="cardType" data-active="false" id="c2">
                        <div className="image"/>
                        <div className="text">
                            <h2>Comércio</h2>
                            <div className="info">
                                <a href={`https://www.bfa.ao/media/2711/afh_bfa_fti_contasimplicada_dez20.pdf`} rel={'external'} target="_blank">Ficha técnica informativa</a>
                            </div>
                        </div>
                    </div>
                </div>
				<button className="button_auth" disabled={account ? loading ? true : false : true} onClick={()=>{
                    if (account === 'c1') {
                        onOpen2()
                    }
                    if (account === 'c2') {
                        onOpen()
                    }
                }}>
					{loading ? 
                        <TailSpin
                        height="25"
                        width="25"
                        color="#fff"
                        ariaLabel="tail-spin-loading"
                        radius="1"
                        visible={true}
                      />
                        :
                        "Avançar"
                    }
				</button>
			</div>
            <Modal
			backdrop="opaque"
			isOpen={isOpen}
			onOpenChange={onOpenChange}
			isDismissable={false}
			size="lg"
		>
			<ModalContent>
				{(onClose) => (
					<>
                        <form onSubmit={(event)=>{
                            event.preventDefault()
                            setLoading(true)
                            if (typeof window !== "undefined") {
                                localStorage.setItem("accountType", account)
                            }
                            onClose()
                            onClose2()
                            router.push('/register/personal-data')
                        }}>
                            <ModalHeader className="flex flex-col gap-1">
                                Conta Simplificada P/Comerciantes
                            </ModalHeader>
                            <ModalBody>
                                <p>
                                    Condições de abertura:
                                </p>
                                <ul style={{ listStyleType: "none" }}>
                                    <li style={{marginBottom: "15px"}}>
                                        <p>
                                            <strong>1- Tenha seu bilhete de identidade em mãos.</strong>
                                            <br />
                                        </p>
                                    </li>
                                    <li style={{marginBottom: "15px"}}>
                                        <p>
                                            <strong>
                                                2- Montante mínimo <br /> 
                                            </strong>
                                            Fins Comerciais Com TPA - 16.000,00 KZ<br />
                                        </p>
                                    </li>
                                    <li style={{marginBottom: "15px"}}>
                                        <p>
                                            <strong>
                                            3- Montante máximo <br /> 
                                            </strong>
                                            Fins Comerciais Com TPA - 4.000.000,00 KZ
                                        </p>
                                    </li>
                                    <li style={{marginBottom: "15px"}}>
                                        <p>
                                            <strong>
                                            4- Leia os termos e condições contratuais <br /> 
                                            </strong>
                                            <Checkbox
                                                style={{marginBottom: "5px", marginTop: "5px"}}
                                                required={true}
                                                onChange={(event)=>setIsCheckbox1Checked(event.target.checked)}
                                                classNames={{
                                                label: "text-small",
                                                }}>
                                                Lí e aceito as condições do <a style={{color: "var(--color-focus)", textDecoration: "underline"}} href="https://bfa.ao/media/1586/ficha-de-adesao-de-produtos-e-servicos_conta-a-ordem.pdf" target="_blank" rel="external">Contrato de abertura de Contas de Depósito e Adesão a Produtos e Serviços.</a>
                                            </Checkbox> 
                                            <Checkbox
                                                style={{marginBottom: "5px"}}
                                                required={true}
                                                onChange={(event)=>setIsCheckbox2Checked(event.target.checked)}
                                                classNames={{
                                                label: "text-small",
                                                }}>
                                                Lí e aceito as condições do <a style={{color: "var(--color-focus)", textDecoration: "underline"}} href="https://bfa.ao/media/1311/contrato-tpa.pdf" rel="external" target="_blank">Contrato de adesão aos terminais de pagamento automático.</a>
                                            </Checkbox> 
                                            <Checkbox
                                                style={{marginBottom: "5px"}}
                                                onChange={(event)=>setIsCheckbox3Checked(event.target.checked)}
                                                
                                                classNames={{
                                                label: "text-small",
                                                }}>
                                                Lí e aceito as condições do <a style={{color: "var(--color-focus)", textDecoration: "underline"}} href="https://www.bfa.ao/media/4295/contrato-de-adesao-cartao-de-debito-multicaixa-particulares.pdf" rel="external" target="_blank">Contrato de Adesão ao Cartão de Débito Multicaixa BFA.</a>
                                            </Checkbox>
                                            
                                        </p>
                                    </li>
                                </ul>
                            </ModalBody>
                            <ModalFooter>
                                <Button type="button" color="danger" variant="flat" onPress={()=>{
                                    setIsCheckbox1Checked(false)
                                    setIsCheckbox2Checked(false)
                                    setIsCheckbox3Checked(false)
                                    setIsCheckbox4Checked(false)
                                    setIsCheckbox5Checked(false)
                                    onClose()
                                }}>Cancelar</Button>
                                <Button
                                    disabled={isCheckbox1Checked && isCheckbox2Checked && isCheckbox3Checked ? false : true}
                                    color="success"
                                    radius="sm"
                                    variant="flat"
                                    type="submit"
                                >
                                    Avançar
                                </Button>
                            </ModalFooter>
                        </form>
					</>
				)}
			</ModalContent>
		    </Modal>
            <Modal
			backdrop="opaque"
			isOpen={isOpen2}
			onOpenChange={onOpenChange2}
			isDismissable={false}
			size="sm"
		>
			<ModalContent>
				{(onClose2) => (
					<>
                        <form onSubmit={(event)=>{
                            event.preventDefault()
                            setLoading(true)
                            if (typeof window !== "undefined") {
                                localStorage.setItem("accountType", account)
                            }
                            onClose()
                            onClose2()
                            router.push('/register/personal-data')
                        }}>
                            <ModalHeader className="flex flex-col gap-1">
                                Conta Simplificada P/Pessoal
                            </ModalHeader>
                            <ModalBody>
                                <p>
                                    Condições de abertura:
                                </p>
                                <ul style={{ listStyleType: "none" }}>
                                    <li style={{marginBottom: "15px"}}>
                                        <p>
                                            <strong>1- Tenha seu bilhete de identidade em mãos.</strong>
                                            <br />
                                        </p>
                                    </li>
                                    <li style={{marginBottom: "15px"}}>
                                        <p>
                                            <strong>
                                                2- Montante mínimo <br /> 
                                            </strong>
                                            Contas para Fins pessoais - 5.000,00 KZ <br />
                                        </p>
                                    </li>
                                    <li style={{marginBottom: "15px"}}>
                                        <p>
                                            <strong>
                                            3- Montante máximo <br /> 
                                            </strong>
                                            Contas para Fins Pessoais - 1.000.000,00 KZ <br />
                                        </p>
                                    </li>
                                    <li style={{marginBottom: "15px"}}>
                                        <p>
                                            <strong>
                                            4- Leia os termos e condições contratuais <br /> 
                                            </strong>
                                            <Checkbox
                                                style={{marginBottom: "5px", marginTop: "5px"}}
                                                onChange={(event)=>setIsCheckbox4Checked(event.target.checked)}
                                                classNames={{
                                                label: "text-small",
                                                }}>
                                                Lí e aceito as condições do <a style={{color: "var(--color-focus)", textDecoration: "underline"}} href="https://bfa.ao/media/1586/ficha-de-adesao-de-produtos-e-servicos_conta-a-ordem.pdf" target="_blank" rel="external">Contrato de abertura de Contas de Depósito e Adesão a Produtos e Serviços.</a>
                                            </Checkbox> 
                                            <Checkbox
                                                style={{marginBottom: "5px"}}
                                                onChange={(event)=>setIsCheckbox5Checked(event.target.checked)}
                                                classNames={{
                                                label: "text-small",
                                                }}>
                                                Lí e aceito as condições do <a style={{color: "var(--color-focus)", textDecoration: "underline"}} href="https://www.bfa.ao/media/4295/contrato-de-adesao-cartao-de-debito-multicaixa-particulares.pdf" rel="external" target="_blank">Contrato de Adesão ao Cartão de Débito Multicaixa BFA.</a>
                                            </Checkbox>
                                        </p>
                                    </li>
                                </ul>
                            </ModalBody>
                            <ModalFooter>
                                <Button type="button" color="danger" variant="flat" onPress={()=>{
                                    setIsCheckbox1Checked(false)
                                    setIsCheckbox2Checked(false)
                                    setIsCheckbox3Checked(false)
                                    setIsCheckbox4Checked(false)
                                    setIsCheckbox5Checked(false)
                                    onClose2()
                                }}>Cancelar</Button>
                                <Button
                                    color="success"
                                    disabled={isCheckbox4Checked && isCheckbox5Checked ? false : true}
                                    radius="sm"
                                    variant="flat"
                                    type="submit"
                                >
                                    Avançar
                                </Button>
                            </ModalFooter>
                        </form>
					</>
				)}
			</ModalContent>
		    </Modal>
		</div>
    )
}