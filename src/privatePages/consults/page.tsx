import LateralCard from "@/components/cards/requestCard";
import TransactionList from "@/components/lists/transactionList";
import useAccountStore from "@/contexts/stores/accountStore";
import api from "@/services/api";
import utils from "@/services/utils";
import "@/styles/consults.css";
import { useState } from "react";
import {
	CiCirclePlus,
	CiImport,
} from "react-icons/ci";
import { TailSpin } from "react-loader-spinner";

export default function Consults() {

	const useAccount = useAccountStore()
	const [loading, setLoading] = useState(false)
	async function generateExtract() {
		setLoading(true)
		const response = await api.get(`/generatePDF/8/${useAccount.number.replaceAll('.', '')}`, {responseType: 'arraybuffer'});
		const blob = new Blob([response.data], { type: 'application/pdf' }); 
		const url = window.URL.createObjectURL(blob);
		
		const a = document.createElement('a');
		a.href = url;
		a.download = `Extrato de Movimentos -${new utils().formatWithoutHours(Date.now().toString())}.pdf`; 
		a.click();
		setLoading(false)
	}

	return (
		<div className="consults_container">
			<div className="consults_header">
				<div className="top">
					<h1>Consultas</h1>
					<p>Consulte o seu saldo a qualquer momento.</p>
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
						<h2>IBAN</h2>
						<p>{useAccount.iban.match(/.{1,4}/g)?.join(' ')}</p>
					</div>
				</div>
			</div>
			<div className="consults_body">
				<h1 className="title" style={{color: "#3B3D4E"}}>Histórico de movimentações</h1>
				<div className="historic">
					<TransactionList accountNumber={useAccount.number} />
				</div>
			</div>
			<div className="consults_lateral">
				<div>
					<h1 className="title" style={{color: "#3B3D4E"}}>Extratos</h1>
				</div>
				<div className="generator" onClick={generateExtract}>
					<p>
						Gerar extrato {loading ? (
								<TailSpin
								height="25"
								width="25"
								ariaLabel="tail-spin-loading"
								radius="1"
								visible={true}
								/>
							) : (
								<CiImport />
							)} 
					</p>
				</div>
				<div className="separator" />
				{/* <h1 className="title">Requisições</h1>
				<div className="requests">
					<LateralCard
						text1="Cartão Visa"
						text2="Ref. 0033"
						text3="12/01/2023"
						text4="Pedente"
						status="pending"
					/>
					<LateralCard
						text1="Cartão de Débito"
						text2="Ref. 0032"
						text3="23/12/2022 "
						text4="Aprovado"
						status="complete"
					/>
					<div className="newRequest">
						<p>
							Nova requisição <CiCirclePlus />
						</p>
					</div>
				</div> */}
			</div>
		</div>
	);
}
