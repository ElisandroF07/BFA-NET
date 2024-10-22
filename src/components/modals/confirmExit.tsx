"use client"

import "@/styles/modal.css";
import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";

interface IProps {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
isOpen: any;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
onOpenChange: any;
}

export default function ConfirmExitModal({ isOpen, onOpenChange }: IProps) {
	const router = useRouter();

	return (
		<Modal
			backdrop="opaque"
			isOpen={isOpen}
			onOpenChange={onOpenChange}
			isDismissable={false}
			motionProps={{
				variants: {
					enter: {
						y: 0,
						opacity: 1,
						transition: {
							duration: 0.2, // Reduzir a duração da transição
							ease: "easeOut",
						},
					},
					exit: {
						y: -10, // Reduzir a distância de deslocamento
						opacity: 0.5, // Reduzir a opacidade durante a saída
						transition: {
							duration: 0.2, // Reduzir a duração da transição
							ease: "easeIn",
						},
					},
				},
			}}
			size="sm"
		>
			<ModalContent>
				{(onClose) => (
					<>
						<ModalHeader className="flex flex-col gap-1">
							Tem a certeza?
						</ModalHeader>
						<ModalBody>
							<p>
								Ao sair durante o processo de abertura de conta, terá que
								reiniciar todas as fases.
							</p>
						</ModalBody>
						<ModalFooter>
							<Button color="primary" variant="light" onPress={onClose}>
								Não, cancelar
							</Button>
							<Button
								color="danger"
								variant="solid"
								onPress={() => {
									router.push("/login");
									onClose();
								}}
							>
								Sim, tenho a certeza
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
}
