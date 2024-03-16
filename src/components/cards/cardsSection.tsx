"use client";

import useUserStore from "@/contexts/stores/userStore";
import { useEffect, useState } from "react";
import { BiHide, BiShow } from "react-icons/bi";
import { FaAngleLeft } from "react-icons/fa6";
import { MdOutlineLock, MdOutlineLockOpen } from "react-icons/md";
import api from "@/services/api";
import { toast } from "sonner";

interface ICard{
	cardNumber: string,
	pin: string,
	createdAt: string,
	role: number,
	nickname: string
}

export default function CardsSection({biNumber, titular}:{biNumber: string, titular: string}) {

	const [card, setCard] = useState<ICard | null>(null);
	const [locked, setLocked] = useState(false);
	const [nk, setNk] = useState("")
	const [loading, setLoading] = useState(false);
	const store = useUserStore();


	function convertDate(timestamp: number) {
    // Converte o timestamp para um objeto Date
    const data = new Date(timestamp);
    // Adiciona dois anos à data
    data.setFullYear(data.getFullYear() + 2);
    // Obtém o mês e o ano formatados
    const mes = (`0${data.getMonth() + 1}`).slice(-2); // +1 porque os meses começam em 0
    const ano = data.getFullYear();
    // Retorna a string no formato mm/aaaa
    return `${mes} / ${ano}`;
}

	async function getCard() {
		try {
			const response = await api.get(`/getCardData/${biNumber}`);
			setCard(response.data.card);
			console.log(response.data);
			console.log(card);
		} catch (err) {
			setCard(null);
		}
	}

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	async function APICall(): Promise<any> {
		setLoading(true);
		const data = JSON.stringify({cardNumber: card?.cardNumber, nickname: nk})
		// biome-ignore lint/suspicious/noAsyncPromiseExecutor: <explanation>
		return new Promise(async (resolve, reject) => {
			try {
				const response = await api.post("/setNickname", data);
				if (response.status === 201) {
					resolve(response.data.message);
				} else {
					reject(response.data.message);
				}
			} catch {
				reject("Erro interno! Tente novamente mais tarde.");
			} finally {
				setLoading(false);
			}
		});
	}

	async function saveData(){
		toast.promise(APICall, {
			loading: "Salvando...",
			success: (data) => {
				return data;
			},
			error: (data) => {
				return data;
			},
		});
	}

	useEffect(() => {
		getCard();
	}, []);

	return (
		<div className="cards manageInfoContainer">
			{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
			<div
				className="top"
				onClick={() => {
					store.updateValidation("options");
				}}
			>
				<button type="button">
					<FaAngleLeft />
				</button>
				<p>Cartões</p>
			</div>
			<div className="cardsbottom">
				<div className="left">
					<div className="input_field" style={{ margin: "0px" }}>
						<label htmlFor="email">Apelido do cartão</label>
						<input
							type="text"
							placeholder="Dê um nome ao cartão"
							onChange={(event)=>setNk(event.target.value)}
							defaultValue={card?.nickname || ""}
						/>
					</div>
					<div className="multiText">
						<h1>Tipo de cartão</h1>
						{/* biome-ignore lint/suspicious/noDoubleEquals: <explanation> */}
<p>{card?.role == 1 || "" ? <>Cartão Multicaixa de Débito</> : <>Teste</>}</p>
					</div>
					<div className="multiText">
						<h1>Número do cartão</h1>
						<p>{card?.cardNumber}</p>
					</div>
					<div className="multiText">
						<h1>Data de validade</h1>
						<p>{convertDate(parseInt(card?.createdAt || ""))}</p>
					</div>
					<div className="multiText">
						<h1>Titular</h1>
						<p>{titular}</p>
					</div>
					<div className="multiText">
						{locked ? (
							<button
								type="button"
								onClick={() => setLocked(false)}
								data-locked="true"
							>
								Desbloquear <MdOutlineLockOpen />
							</button>
						) : (
							<button
								type="button"
								onClick={() => setLocked(true)}
								data-locked="false"
							>
								Bloquear <MdOutlineLock />
							</button>
						)}
						<button type="button" onClick={saveData} disabled={loading && nk !== ""}>Salvar</button>
					</div>
				</div>
				<div className="right">
					<div className="cardImage">
						<p>{titular}</p>
						<p>{convertDate(parseInt(card?.createdAt || ""))}</p>
						<p>{card?.cardNumber.slice(-4)}</p>
					</div>
				</div>
			</div>
		</div>
	);
}
