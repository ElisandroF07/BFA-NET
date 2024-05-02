import api from "@/services/api";
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, DropdownSection} from "@nextui-org/react";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";
import {z} from "zod"
import {useForm} from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import InfoError from "../others/infoError";
import { useState } from "react";
import { toast } from "sonner";
import { TailSpin } from 'react-loader-spinner'

interface IProps {
  name: string,
  email?: string,
  imageUrl?: string,
  id: number,
  biNumber: string,
  accountNumber: string,
  emailFrom: string
}

const formSchema = z.object({
	balance: z.string().min(1, "Preenchimento obrigatório!"),
})
const form2Schema = z.object({
	accessCode: z.string().regex(/^[0-9]{6}$/, "O código de acesso deve conter 6 dígitos numéricos.")
})
const formNeedMoneySchema = z.object({
	balance: z.string().min(1, "Introduza um valor!")
})

type formType = z.infer<typeof formSchema>
type form2Type = z.infer<typeof form2Schema>
type formNeedMoneyType = z.infer<typeof formNeedMoneySchema>


export default function CardFriend(props: IProps) {

	const [loading, setLoading] = useState(false)
	const [transfer, setTransfer] = useState({email: "", balance: ""})
	const [loading2, setLoading2] = useState(false)

  const { isOpen, onOpen, onClose } = useDisclosure();
	const { isOpen: isOpenCheck, onOpen: onOpenCheck, onClose: onCloseCheck } = useDisclosure();
  const { isOpen: isOpenNeedMoney, onOpen: onOpenNeedMoney, onClose: onCloseNeedMoney } = useDisclosure();


  const {handleSubmit, formState: {errors}, register} = useForm<formType>({resolver: zodResolver(formSchema)})
	const {handleSubmit: handleSubmit2, formState: {errors: errors2}, register: register2} = useForm<form2Type>({resolver: zodResolver(form2Schema)})
  const {handleSubmit: handleNeedMoneySubmit, formState: {errors: NeedMoneyErrors}, register: registerNeedMoney} = useForm<formNeedMoneyType> ({resolver: zodResolver(formNeedMoneySchema)})



  async function removeFriend() {
    try {
      const response = await api.get(`/removeFriend/${props.id}`)
      if (response.data.success) {
        toast.success("Amigo removido com sucesso!")
      }
      else {
        toast.error(response.data.message)
      }
    }
    catch {
      toast.error("Sem conexão com o servidor!")
    }
  }

  async function submitForm(data: formType) {
		setTransfer({balance: data.balance, email: props.email || ""})
    onOpenCheck()
	}

	function closeModal2() {
		setLoading2(false)
		setLoading(false)
		onCloseCheck()
	}

	function closeModal1() {
		setLoading2(false)
		setLoading(false)
		onClose()
	}

	async function submitForm2(data: form2Type) {
		setLoading2(true)
		const bodyCheck = JSON.stringify({
      accessCode: data.accessCode,
      biNumber: props.biNumber
    })
    const response = await api.post("/checkAccessCode", bodyCheck)
    if (response.data.valid) {
      const body = JSON.stringify({
        balance: transfer.balance,
        email: props.email,
        accountNumber: props.accountNumber
      })
      const resp = await api.post("/sendMoney", body)
      if (resp.data.success) {
        toast.success("Envio realizado com sucesso!")
        setLoading2(false)
        setLoading(false)
        onClose()
        onCloseCheck()
      }
      else {
        toast.error(response.data.message)
        setLoading2(false)
        setLoading(false)
      }
      
    }
    else {
      toast.error("Código de acesso inválido")
      setLoading2(false)
      setLoading(false)
    }
	}

  async function needMoney(data: formNeedMoneyType) {
    try {
      setLoading(true)
      const body = JSON.stringify({
        balance: data.balance,
        emailTo: props.email,
        emailFrom: props.emailFrom
      })
      const response = await api.post("/requestMoney", body)
      if (response.data.success) {
        toast.success("Requisição de dinheiro realizada com sucesso!")
        onCloseNeedMoney()
        setLoading(false)
      }
      else {
        toast.error(response.data.message)
        onCloseNeedMoney()
        setLoading(false)
      }
    }
    catch(error) {
      toast.error("Sem conexão com o servidor!")
    }
  }

  return (
    <>
    <Dropdown>
      <DropdownTrigger>
        <button type="button" className="cardFriend">
          <div className="layoutProfile" style={{backgroundImage: `url(${props.imageUrl})`}}/>
          <div className="text">
            <p>{props.name}</p>
            <p>{props.email}</p>
          </div>
        </button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Example with disabled actions">
        <DropdownSection title="Opções">
          <DropdownItem key="new" onClick={onOpen}>Enviar dinehrio</DropdownItem>
          <DropdownItem key="copy" onClick={onOpenNeedMoney}>Solicitar dinehiro</DropdownItem>
        </DropdownSection>
        <DropdownSection title="Remover">  
          <DropdownItem key="delete" className="text-danger" onClick={removeFriend} color="danger">Remover amigo</DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
    {isOpen && (
            <Modal isOpen={isOpen} onClose={onClose} placement="top-center">
                <ModalContent>
                    <form onSubmit={handleSubmit(submitForm)}>
                        <ModalHeader className="flex flex-col gap-1">Envio Instantâneo</ModalHeader>
                        <ModalBody>
                            <Input
                                autoFocus
                                label="Destinatário"
                                type="text"
                                variant="flat"
                                value={props.name}
																disabled
                            />
                            <Input
                                label="Email"
                                type="text"
                                variant="flat"
                               	value={props.email}
																disabled
                            />
                            <Input
                                label="Montante a enviar"
                                type="text"
                                variant="flat"
                                {...register("balance")}
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="flat" onPress={closeModal1}>
                                Cancelar
                            </Button>
                            <Button color="primary" type="submit">
														Confirmar
                            </Button>
                        </ModalFooter>
                      </form>
                </ModalContent>
            </Modal>
    )}
    {isOpenCheck && (
          <Modal isOpen={isOpenCheck} onClose={onCloseCheck} placement="top-center">
              <ModalContent>
                  <form onSubmit={handleSubmit2(submitForm2)}>
                      <ModalHeader className="flex flex-col gap-1">Finalizar transferência</ModalHeader>
                      <ModalBody>
                          <Input
                              autoFocus
                              label="Código de acesso"
                              type="text"
                              variant="flat"
                              {...register2("accessCode")}
                          />
                          {errors2.accessCode && <InfoError message={errors2.accessCode.message} />}
                      </ModalBody>
                      <ModalFooter>
                          <Button color="danger" variant="flat" onPress={closeModal2} disabled={loading2}>
                              Cancelar
                          </Button>
                          <Button color="primary" type="submit" disabled={loading2}>
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
                            'Finalizar'
                          )}
                          </Button>
                      </ModalFooter>
                  </form>
              </ModalContent>
          </Modal>
    )}
    {isOpenNeedMoney && (
      <Modal isOpen={isOpenNeedMoney} onClose={onCloseNeedMoney} placement="top-center">
          <ModalContent>
            <form onSubmit={handleNeedMoneySubmit(needMoney)}>
                  <ModalHeader className="flex flex-col gap-1">Solicitar dinehiro</ModalHeader>
                  <ModalBody>
                        <Input
                            autoFocus
                            label="Nome"
                            type="text"
                            variant="flat"
                            value={props.name}
                            disabled
                        />
                      <Input
                            autoFocus
                            label="Montante a solicitar"
                            type="text"
                            variant="flat"
                            {...registerNeedMoney("balance")}
                        />
                      {NeedMoneyErrors.balance && <InfoError message={NeedMoneyErrors.balance.message}/>}
                  </ModalBody>
                  <ModalFooter>
                      <Button type='button' disabled={loading} color="danger" variant="flat" onPress={onCloseNeedMoney}>
                          Cancelar
                      </Button>
                      <Button type='submit' disabled={loading} color="primary" variant="flat">
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
                        'Confirmar'
                      )}
                      </Button>
                  </ModalFooter>
              </form>
          </ModalContent>
      </Modal>
    )}
  </>
  )
}