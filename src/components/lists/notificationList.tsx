import api from "@/services/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";
import { CiBellOn } from "react-icons/ci";
import { TailSpin } from "react-loader-spinner";
import useSWR from "swr";
import { z } from "zod";
import InfoError from "../others/infoError";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

interface INotification {
  id: number;
  tittle: string;
  email: string;
  type: number
}

interface IResponse {
  success: boolean;
  message: string;
  notifications: INotification[];
}

interface IReq {
  success: boolean,
  request: IRequest
}

interface IRequest {
  id: number,
  balance: number,
  date: string,
  emailFrom: string,
  emailTo: string,
  status: number
}

const form2Schema = z.object({
  accessCode: z.string().regex(/^[0-9]{6}$/, "O código de acesso deve conter 6 dígitos numéricos."),
});

type form2Type = z.infer<typeof form2Schema>;

export default function NotificationList({ email, biNumber }: { email: string; biNumber: string }) {
  const [loading, setLoading] = useState(false);
  const [notifications, setNotification] = useState<IResponse>({ success: false, message: "", notifications: [] });
  const fetcher = (url: string) => api.get(url).then(res => res.data);
  const { data, error, mutate } = useSWR(`/getNotifications/${email}`, fetcher);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [notificationActive, setNotificationActive] = useState<INotification>({email: "", tittle: "", id: 0, type: 0});
  const [request, setRequest] = useState<IReq>({success: false, request: {balance: 0, date: "", emailFrom: "", emailTo: "", id: 0, status: 0}})
  const { isOpen: isOpenCheck, onOpen: onOpenCheck, onClose: onCloseCheck } = useDisclosure();
  const { handleSubmit: handleSubmit2, formState: { errors: errors2 }, register: register2 } = useForm<form2Type>({ resolver: zodResolver(form2Schema) });

  useEffect(() => {
    if (data) {
      setNotification(data);
    }
    if (error) {
      setNotification({ message: "", success: false, notifications: [] });
    }
  }, [data, error]);


  async function updateNotifications() {
    const response = await api.get(`/getNotifications/${email}`)
    mutate(response.data, false)
  }

  async function deleteNotication(id: number) {
    try {
      const response = await api.get(`/deleteNotification/${id}`)
      if (response.data.success) {
        updateNotifications()
      }
      else {
        toast.error("Não foi possivel remover a notificação!")
      }
    }
    catch {
      toast.error("Erro ao remover a notificação!")
    }
  }

  async function getRequest() {
    try {
      const response = await api.get(`/getMoneyRequest/${email}`)
      setRequest(response.data)
    }
    catch {
      toast.error("Erro ao obter as notificações!")
    }
  }

  async function rejectRequest() {
    try {
      setLoading(true);
      const response = await api.get(`/rejectMoneyRequest/${request.request.id}/${notificationActive.id}`);
      if (response.data.success) {
        toast.success("Pedido rejeitado com sucesso!");
        await updateNotifications()
        onClose()
        onCloseCheck()
        setLoading(false);
      } else {
        toast.error("Não foi possível rejeitar o pedido! Tente novamente mais tarde.");
        onClose()
        onCloseCheck()
      }
      setLoading(false);
    } catch (error) {
      toast.error("Não foi possível rejeitar o pedido! Tente novamente mais tarde.");
      setLoading(false);
    }
  }

  async function submitForm2(data: form2Type) {
    setLoading(true);
    const bodyCheck = JSON.stringify({
      accessCode: data.accessCode,
      biNumber: biNumber,
    });
    try {
      const response = await api.post("/checkAccessCode", bodyCheck);
      if (response.data?.valid) {
        const resp = await api.get(`/acceptMoneyRequest/${request.request.id}/${notificationActive.id}`);
        if (resp.data.success) {
          toast.success(resp.data.message);
          await updateNotifications()
          onClose()
          onCloseCheck()
        } else {
          toast.error(resp.data.message);
        }
      }
      else {
        toast.error("Código de acesso incorreto!")
      }
    } catch (error) {
      toast.error("Erro ao processar a requisição. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Dropdown>
        <DropdownTrigger>
          <button type="button" className="button_icon notifications">
            <CiBellOn className="icon" />
            {notifications.notifications && (
              <span className="notificationCount">
                {notifications.notifications?.length}
              </span>
            )}
          </button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Static Actions">
          {notifications.notifications ? notifications.notifications.map((notification) => {
            return (
              <DropdownItem key={notification.id} onPress={async() => {
                
               if (notification.type === 1) {
                await deleteNotication(notification.id)
               }
               else {
                setNotificationActive(notification);
                await getRequest()
                onOpen()
               }
                }}>{notification.tittle}</DropdownItem>
            );
          }) : []}

        </DropdownMenu>
      </Dropdown>
      {isOpen && (
        <Modal isOpen={isOpen} onClose={onClose} placement="top-center">
          <ModalContent>
            <ModalHeader className="flex flex-col gap-1">Solicitação de dinheiro</ModalHeader>
            <ModalBody>
              <Input
                label="Email do solicitante"
                type="text"
                variant="flat"
                value={request.request.emailFrom}
                disabled
              />
              <Input
                label="Montante solicitado"
                type="text"
                variant="flat"
                disabled
                value={request.request.balance.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA', maximumFractionDigits: 0 }) || ""}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={rejectRequest}>
                Rejeitar
              </Button>
              <Button color="primary" type="button" onPress={onOpenCheck}>
                Aceitar
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
      {isOpenCheck && (
        <Modal isOpen={isOpenCheck} onClose={onCloseCheck} placement="top-center">
          <ModalContent>
            <form onSubmit={handleSubmit2(submitForm2)}>
              <ModalHeader className="flex flex-col gap-1">Confirmação</ModalHeader>
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
                <Button color="danger" variant="flat" onPress={onCloseCheck} disabled={loading}>
                  Cancelar
                </Button>
                <Button color="primary" type="submit" disabled={loading}>
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
                    'Finalizar'
                  )}
                </Button>
              </ModalFooter>
            </form>
          </ModalContent>
        </Modal>
      )}
    </>
  );
}
