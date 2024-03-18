import useUserStore from "@/contexts/stores/userStore";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";
import { FaAngleLeft } from "react-icons/fa6";
import { IoIosArrowRoundForward } from "react-icons/io";

export default function SecuritySection() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const store = useUserStore();

    return (
      <div className="manageInfoContainer">
        <div
          className="top"
          onMouseDown={() => {store.updateValidation("options");}}>
          <button type="button">
              <FaAngleLeft />
          </button>
          <p>Segurança</p>
        </div>
        <div className="security bottom">
            <button type="button" onMouseDown={onOpen}>
                Alterar código de acesso <IoIosArrowRoundForward />
            </button>
            <button type="button">
                Alterar endereço de email <IoIosArrowRoundForward />
            </button>
        </div>
        {isOpen && (
            <Modal isOpen={isOpen} onClose={onClose} placement="top-center">
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1">Alterar código de acesso</ModalHeader>
                    <ModalBody>
                        <Input
                            autoFocus
                            label="Novo código de acesso"
                            placeholder="Insira o novo código de acesso"
                            type="password"
                            variant="bordered"
                        />
                        <Input
                            label="Confirme o código de acesso"
                            placeholder="Insira novamente o novo código de acesso"
                            type="password"
                            variant="bordered"
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" variant="flat" onPress={onClose}>
                            Cancelar
                        </Button>
                        <Button color="primary" onPress={onClose}>
                            Confirmar
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        )}
      </div>
    );
}
