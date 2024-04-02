import { CiSquarePlus } from "react-icons/ci"
import FriendList from "./friendList"
import api from "@/services/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDisclosure, Modal, ModalContent, ModalHeader, ModalBody, Input, ModalFooter, Button } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { TailSpin } from "react-loader-spinner";
import { toast } from "sonner";
import InfoError from "../others/infoError";
import { z } from "zod";
import useSWR from "swr";

interface IPersonalData {
  name: string[];
  gender: string;
  birthDate: Date;
}

interface IFindFriend {
  success: boolean;
  client?: {
    personalData?: IPersonalData;
    image?: string; 
  };
  message: string;
}

interface IFindFriend {
  success: boolean;
  client?: {
    personalData?: IPersonalData;
    image?: string; 
  };
  message: string;
}

interface IPersonalData {
  name: string[];
  gender: string;
  birthDate: Date;
}

interface IInfoFriend {
	personalData?: IPersonalData;
	image: string; 
	friendId: number,
	nickname: string,
	email: string
}

interface IFriends {
  success: boolean;
  friends: IInfoFriend[]; 
  message: string;
}

const formAddFriendSchema = z.object({
	email: z.string().min(1, "Introduza o endereço de mail").email("Email inválido")
})
const formConfirmAddSchema = z.object({
	nickname: z.string().min(1, "Defina um apelido para o amigo!")
})


type formAddFriendType = z.infer<typeof formAddFriendSchema>
type formConfirmAddType = z.infer<typeof formConfirmAddSchema>

export default function CardFriends({biNumber, number, emailFrom}:{biNumber: string, number: string, emailFrom: string}) {

  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [findedFriend, setFriendedFriend] = useState<IFindFriend>({message: "", success: false, client: {image: "", personalData: {birthDate: new Date(Date.now()), gender: "", name: []}}})
	const { isOpen: isOpenAddFriend, onOpen: onOpenAddFriend, onClose: onCloseAddFriend } = useDisclosure();
	const { isOpen: isOpenConfirmAdd, onOpen: onOpenConfirmAdd, onClose: onCloseConfirmAdd } = useDisclosure();
  const {handleSubmit: handleAddFriendSubmit, formState: {errors: addFriendErrors}, register: registerAddFriend} = useForm<formAddFriendType> ({resolver: zodResolver(formAddFriendSchema)})
	const {handleSubmit: handleConfirmAddSubmit, formState: {errors: ConfirmAddErrors}, register: registerConfirmAdd} = useForm<formConfirmAddType> ({resolver: zodResolver(formConfirmAddSchema)})
	const fetcher = (url: string) => api.get(url).then(res => res.data);
  const { data, error, mutate } = useSWR(`/getFriends/${biNumber}`, fetcher);
  const [friends, setFriends] = useState<IFriends | null>(null);

	useEffect(() => {
    if (data) {
      setFriends(data);
    }
    if (error) {
      setFriends({ friends: [], message: "", success: false });
    }
  }, [data, error]);

	async function updateFriends() {
		const response = await api.get(`/getFriends/${biNumber}`)
    mutate(response.data, false)
	}

  async function addFriend(data: formAddFriendType) {
    setLoading(true)
    const response = await api.get(`/findFriend/${data.email}/${biNumber}`)
    if (response.data.success) {
      setEmail(data.email)
      setFriendedFriend(response.data)
      toast.success("Usuário encontrado com sucesso!")
      setLoading(false)
      onOpenConfirmAdd()
    }
    else {
      toast.error(response.data.message)
      setLoading(false)
    }
  }
  
  async function confirmAdd(data: formConfirmAddType) {
    try {
      setLoading(true)
      const body = JSON.stringify({
        nickname: data.nickname,
        email: email,
        biNumber: biNumber
      })
      const response = await api.post("/addFriend", body)
      if (response.data.success) {
        toast.success("Usuário adicionado com sucesso!")
        setLoading(false)
        onCloseConfirmAdd()
        onCloseAddFriend()
				updateFriends()
      }
      else {
        toast.error(response.data.message)
        setLoading(false)
      }
    }
    catch {
      toast.error("Ocorreu um erro ao processar a sua solicitação! Tente novamente mais tarde")
    }
  }

  return (
    <>
    <div className="bottomRight">
      <div className='btTop'><h1>Enviar para amigos</h1><CiSquarePlus onMouseDown={onOpenAddFriend}/></div>
      <div className="content">
        <FriendList biNumber={biNumber} accountNumber={number} email={emailFrom} error={error} friends={friends}/>
      </div>
    </div>
    {isOpenAddFriend && (
				<Modal isOpen={isOpenAddFriend} onClose={onCloseAddFriend} placement="top-center">
						<ModalContent>
							<form onSubmit={handleAddFriendSubmit(addFriend)}>
										<ModalHeader className="flex flex-col gap-1">Adicionar amigo</ModalHeader>
										<ModalBody>
													<Input
															autoFocus
															label="Endereço de email"
															type="text"
															variant="flat"
															{...registerAddFriend("email")}
													/>
												{addFriendErrors.email && <InfoError message={addFriendErrors.email.message}/>}
										</ModalBody>
										<ModalFooter>
												<Button type='button' color="default" disabled={loading} variant="bordered" onPress={onCloseAddFriend}>
														Cancelar
												</Button>
												<Button type='submit' color="primary" disabled={loading} variant="flat">
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
														'Adicionar amigo'
													)}
												</Button>
										</ModalFooter>
								</form>
						</ModalContent>
				</Modal>
			)}
			{isOpenConfirmAdd && (
				<Modal isOpen={isOpenConfirmAdd} onClose={onCloseConfirmAdd} placement="top-center">
						<ModalContent>
							<form onSubmit={handleConfirmAddSubmit(confirmAdd)}>
										<ModalHeader className="flex flex-col gap-1">Adicionar amigo</ModalHeader>
										<ModalBody>
													<Input
															autoFocus
															label="Nome"
															type="text"
															variant="flat"
															value={findedFriend.client?.personalData?.name.join(" ")}
															disabled
													/>
												<Input
															autoFocus
															label="Defina um apelido para o amigo"
															type="text"
															variant="flat"
															{...registerConfirmAdd("nickname")}
													/>
												{ConfirmAddErrors.nickname && <InfoError message={ConfirmAddErrors.nickname.message}/>}
										</ModalBody>
										<ModalFooter>
												<Button type='button' disabled={loading} color="danger" variant="flat" onPress={onCloseConfirmAdd}>
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