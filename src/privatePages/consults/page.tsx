import LateralCard from "@/components/cards/requestCard";
import TransactionList from "@/components/lists/transactionList";
import useAccountStore from "@/contexts/stores/accountStore";
import api from "@/services/api";
import utils from "@/services/utils";
import "@/styles/consults.css";
import { Input } from "@nextui-org/react";
import { useEffect, useState } from "react";
import {
	CiCirclePlus,
	CiImport,
} from "react-icons/ci";
import { TailSpin } from "react-loader-spinner";
import { toast } from "sonner";

export default function Consults() {

	const useAccount = useAccountStore()
	const [loading, setLoading] = useState(false)

	const [maxDate, setMaxDate] = useState('');
	const [minDate, setMinDate] = useState('');

	const [date1, setDate1] = useState('');
	const [date2, setDate2] = useState('');

    useEffect(() => {
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0'); // Janeiro é 0!
        const yyyy = today.getFullYear();

        const formattedDate = `${yyyy}-${mm}-${dd}`;
        setMaxDate(formattedDate);

		const accountCreationDate = new Date(useAccount.created_at);
        const acDd = String(accountCreationDate.getDate()).padStart(2, '0');
        const acMm = String(accountCreationDate.getMonth() + 1).padStart(2, '0'); // Janeiro é 0!
        const acYyyy = accountCreationDate.getFullYear();

        const formattedAccountCreationDate = `${acYyyy}-${acMm}-${acDd}`;
        setMinDate(formattedAccountCreationDate);
    }, [useAccount.created_at]);

	async function generateExtract() {
		setLoading(true)
		const body = JSON.stringify({
			initial: new Date(date1).getTime(),
			final: new Date(date2).getTime()
		})
		const response = await api.get(`/generatePDF/8.${date1}.${date2}/${useAccount.number.replaceAll('.', '')}`, {responseType: 'arraybuffer'});
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
				{/* <div  style={{display: "flex", alignItems: "center", justifyContent: "center", width: "100%", flexDirection: "column", gap: "10px"}}>
				<Input type="date" label="Inicio" max={maxDate}  min={minDate} onChange={(e)=>setDate1(e.target.value)}/>
				<Input type="date" max={maxDate}  min={minDate} label="Fim" onChange={(e)=>setDate2(e.target.value)} />
				</div> */}
				<div className="generator" onClick={()=>{
					generateExtract()
				}}>
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
