"use client";

import { useEffect, useState } from "react";
import LateralCard from "@/components/cards/requestCard";
import TransferInterbanc from "@/components/transferTypes/tranfer_interbanc";
import TransferDefault from "@/components/transferTypes/transfer_default";
import TransferInternational from "@/components/transferTypes/transfer_international";
import TransferIntrabanc from "@/components/transferTypes/transfer_intrabanc";
import TransferWallet from "@/components/transferTypes/transfer_wallet";
import "@/styles/transfers.css";
import api from "@/services/api";
import useSWR from "swr";
import { toast } from "sonner";
import SendedTransfersList from "@/components/lists/sendedTransferList";
import ReceivedTransfersList from "@/components/lists/receivedTransferList";
import useAccountStore from "@/contexts/stores/accountStore";
import useClientStore from "@/contexts/stores/clientStore";

interface Transacao {
  balance: string;
  accountTo: string | null;
  date: string;
  status: 'Finalizada' | 'Cancelado' | 'Pendente'; // Ajuste conforme os possíveis valores
  type: number;
}

interface RespostaAPI {
  success: boolean;
  data: Transacao[];
}


export default function Transfers() {
	const [selectedPage, setSelectedPage] = useState("0");
	const useAccount = useAccountStore()
	const useClient = useClientStore()

	function timestampToDateString(timestamp: number): string {
		const date = new Date(timestamp);
		const day = date.getDate().toString().padStart(2, '0'); // Obtém o dia do mês e completa com zero à esquerda se necessário
		const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Obtém o mês (0-indexed) e completa com zero à esquerda se necessário
		const year = date.getFullYear(); // Obtém o ano
	
		return `${day}-${month}-${year}`;
	}

	return (
		<div className="transfers_container">
			<div className="transfers_header">
				<div className="top">
					<h1>Transferências</h1>
					<p>Movimente o seu dineiro livremente.</p>
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
					<div>
						<h2>Selecione o tipo de transferência</h2>
						<select
							name="payment_type"
							id="payment_type"
							onChange={(event) => setSelectedPage(event.target.value)}
						>
							<option value="Selecione" selected disabled>
								Selecione
							</option>
							<option value="1">Transferência interbancária</option>
							<option value="2">Transferência intrabancária</option>
							{/* <option value="3">Transferência internacional</option>
							<option value="4">Carregamento de carteira digital</option> */}
						</select>
					</div>
				</div>
			</div>
			<div className="transfers_body">
				{selectedPage === "0" && <TransferDefault />}
				{selectedPage === "1" && <TransferInterbanc number={useAccount.number} biNumber={useClient.biNumber}/>}
				{selectedPage === "2" && <TransferIntrabanc number={useAccount.number} biNumber={useClient.biNumber}/>}
				{selectedPage === "3" && <TransferInternational />}
				{selectedPage === "4" && <TransferWallet number={useAccount.number}/>}
			</div>
			<div className="transfers_lateral">
				<div className="top">
					<h1 className="title" style={{marginBottom: "5px"}}>Transferências enviadas</h1>
					<div className="requests">
					<SendedTransfersList accountNumber={useAccount.number}/>
					</div>
				</div>
			</div>
		</div>
	);
}
