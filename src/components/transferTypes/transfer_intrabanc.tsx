"use client"

import "@/styles/transfer-types.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";
import { CiCircleChevRight, CiCircleInfo } from "react-icons/ci";
import InfoError from "../others/infoError";
import { useState } from "react";

const FormSchema = z.object({
	accountFrom: z.string(),
  accountTo: z.string().min(1, 'Número da conta receptora é obrigatório').regex(/^[0-9]{14}$/, "Número de conta inválido! Deve ser constituido por 14 dígitos numéricos. Sem pontos e espaços."),
  balance: z.string().min(1, 'Montante é obrigatório'),
  transferDescription: z.string(),
  receiverDescription: z.string(),
});

type FormType = z.infer<typeof FormSchema>

interface IData {
	accountFrom: string,
	accountTo: string,
	balance: string,
	transferDescription: string,
	receiverDescription: string
}

export default function TransferIntrabanc({number}: {number: string}) {

	const { isOpen, onOpen, onClose } = useDisclosure();
	const [loading, setLoading] = useState(false)
	const [data, setData] = useState<IData>({accountFrom: "", accountTo: "", balance: "", receiverDescription: "", transferDescription: ""})
	const { register, handleSubmit, formState: { errors } } = useForm<FormType>({
    resolver: zodResolver(FormSchema),
  });

	function getDataAtual() {
		const data = new Date();
		const dia = String(data.getDate()).padStart(2, '0');
		const mes = String(data.getMonth() + 1).padStart(2, '0');
		const ano = data.getFullYear();
		return `${dia}/${mes}/${ano}`;
	}

	async function submitForm(data: FormType) {
		console.log("oieeeieie")
		setData(data)
		onOpen()
	}

	return (
		<div className="tt3_container">
			<div className="top">
				<h1>Transferências intrabancárias</h1>
				<div className="separator" />
			</div>
			<form className="bottom"  onSubmit={handleSubmit(submitForm)}>
				<div className="left">
					<div className="input_field">
						<label htmlFor="email">Conta emissora</label>
						<input
							type="text"
							disabled
							style={{ border: "none", background: "none" }}
							value={number}
							{...register("accountFrom")}
						/>
					</div>
					<div className="input_field">
						<label htmlFor="email">Número da conta receptora</label>
						<input type="text" placeholder="Número do conta" {...register("accountTo")}/>
						{errors.accountTo && <InfoError message={errors.accountTo.message} />}
					</div>
					<div className="input_field">
						<label htmlFor="email">Montante</label>
						<div className="input_phone">
							<p>Kz</p>
							<input type="text" placeholder="Montante" {...register("balance")}/>
						</div>
						{errors.balance && <InfoError message={errors.balance.message} />}
					</div>
				</div>
				<div className="right">
					<div className="input_field">
						<label htmlFor="email">Data da transferência</label>
						<input
							type="text"
							disabled
							style={{ border: "none", background: "none" }}
							value={getDataAtual()}
						/>
						
					</div>
					<div className="input_field">
						<label htmlFor="email">Descrição da transferência</label>
						<input
							type="text"
							placeholder="Descreva o motivo da transferência"
							{...register("transferDescription")}
						/>
						{errors.transferDescription && <InfoError message={errors.transferDescription.message} />}
					</div>
					<div className="input_field">
						<label htmlFor="email">Descrição do destinatário</label>
						<input
							type="text"
							placeholder="Descreva o destinatário (nome, parentesco, ...)"
							{...register("receiverDescription")}
						/>
						{errors.receiverDescription && <InfoError message={errors.receiverDescription.message} />}
					</div>
				</div>
				<div className="information">
					<CiCircleInfo className="icone" />
					<p>Envie e receba dinheiro instantânemante.</p>
					<button type="submit">
						Confirmar transferência <CiCircleChevRight />
					</button>
				</div>
			</form>
			{isOpen && (
            <Modal isOpen={isOpen} onClose={onClose} placement="top-center">
                <ModalContent>
                    <form onSubmit={handleSubmit(submitForm)}>
                        <ModalHeader className="flex flex-col gap-1">Alterar código de acesso</ModalHeader>
                        <ModalBody>
                            <Input
                                autoFocus
                                label="Número da conta destino"
                                type="text"
                                variant="flat"
																value={data.accountTo}
                                onKeyDown={(event)=>{ if (event.key === 'e') event.preventDefault()}}
                                
                            />
                            <Input
                                label="Nome do destinatário"
                                type="password"
                                variant="flat"
																value={"Elisandro Jogn"}
                                onKeyDown={(event)=>{ if (event.key === 'e') event.preventDefault()}}
                                
                            />
														<Input
                                label="Montante"
                                type="password"
                                variant="flat"
																value={`${data.balance},00 Kz`}
                                onKeyDown={(event)=>{ if (event.key === 'e') event.preventDefault()}}
                                
                            />
                            <Input
                                label="Código de acesso"
                                type="password"
                                variant="flat"
                                placeholder="Insira o seu código de acesso"
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="flat" onPress={onClose} disabled={loading}>
                                Cancelar
                            </Button>
                            <Button color="primary" type="submit" disabled={loading}>
                                Confirmar transferência
                            </Button>
                        </ModalFooter>
                    </form>
                </ModalContent>
            </Modal>
        )}
		</div>
	);
}
