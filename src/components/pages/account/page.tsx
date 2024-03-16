"use client";

import ActivesSection from "@/components/cards/activesSection";
import CardsSection from "@/components/cards/cardsSection";
import ManageInfoSection from "@/components/cards/manageInfoSection";
import OptionsSection from "@/components/cards/optionsSecton";
import SecuritySection from "@/components/cards/securitySection";
import useUserStore from "@/contexts/stores/userStore";
import api from "@/services/api";
import "@/styles/account.css";
import { useEffect, useState } from "react";
import { CiImport, CiLocationArrow1 } from "react-icons/ci";

interface IProps{
	biNumber: string,
	titular: string,
	email: string,
	country: string,
	address: string,
	birthDate: string,
	fullName: string
}

interface IAccount {
	iban: string,
	nbi: string,
	role: number,
	number: string,
	authorized_balance: number,
	bic: string,
	available_balance: number,
	created_at: string,
	currency: string,
	state: string,
}

export default function Account({biNumber, titular, email, birthDate, country, address, fullName}: IProps) {
	const [account, setAccount] = useState<IAccount | null>(null);

	function convertTimestamp(timestamp: number) {
		const data = new Date(timestamp);
		const dia = data.getDate().toString().padStart(2, '0');
		const mes = (data.getMonth() + 1).toString().padStart(2, '0'); // Mês começa em zero, então adicionamos 1
		const ano = data.getFullYear();
		const dataFormatada = `${dia}-${mes}-${ano}`;
		return dataFormatada
	}

	async function getAccount() {
		try {
			const response = await api.get(`/getAccountData/${biNumber}`);
			setAccount(response.data.account);
		} catch (err) {
			setAccount(null);
		}
	}

	useEffect(() => {
		getAccount();
	}, []);

	const store = useUserStore();

	return (
		<div className="account_container">
			<div className="account_header">
				<div className="top">
					<h1>Conta</h1>
					<p>Gerencie a sua.</p>
				</div>
			</div>
			<div className="account_body">
				<div className="settings">
					<div className="image" />
					<h1>{fullName}</h1>
					<p>Conta Particular</p>
					{store.validation === "options" ? (
						<OptionsSection />
					) : store.validation === "manageInfo" ? (
						<ManageInfoSection biNumber={biNumber} titular={fullName} birthDate={birthDate} email={email} country={country} address={address}/>
					) : store.validation === "cards" ? (
						<CardsSection biNumber={biNumber} titular={titular}/>
					) : store.validation === "security" ? (
						<SecuritySection />
					) : store.validation === "actives" ? (
						<ActivesSection />
					) : (
						<></>
					)}
				</div>
			</div>
			<div className="account_lateral">
				<h1 className="title">Minha conta</h1>
				<div className="separator" />
				<div className="infoContainer">
					<div>
						<h1>Número da conta</h1>
						<p>{account?.number}</p>
					</div>
					<div>
						<h1>IBAN</h1>
						<p>{account?.iban}</p>
					</div>
					<div>
						<h1>NBA</h1>
						<p>{account?.nbi}</p>
					</div>
					<div>
						<h1>BIC/SWIFT</h1>
						<p>{account?.bic}</p>
					</div>
					<div>
						<h1>Divísa</h1>
						<p>{account?.currency}</p>
					</div>
					<div>
						<h1>Titular</h1>
						<p>{titular}</p>
					</div>
					<div>
						<h1>Data de abertura</h1>
						<p>{convertTimestamp(parseInt(account?.created_at || ""))}</p>
					</div>
					<div>
						<h1>Tipo de conta</h1>
						<p>{account?.role === 1 && "Conta à ordem"}</p>
					</div>
					<div>
						<h1>Saldo disponível</h1>
						<p>{account?.available_balance} Kz</p>
					</div>
					<div>
						<h1>Saldo autorizado</h1>
						<p>{account?.authorized_balance} Kz</p>
					</div>
					<div>
						<h1>Estado</h1>
						<p
							style={{
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<div
								className="round"
								style={{
									width: "10px",
									height: "10px",
									borderRadius: "10px",
									backgroundColor: "#11aa11",
									marginRight: "10px",
								}}
							/>
							{account?.state}
						</p>
					</div>
				</div>
				<div className="separator" />
				<p className="pLink">
					Enviar para email <CiLocationArrow1 />
				</p>
				<p className="pLink">
					Salvar como PDF <CiImport />
				</p>
			</div>
		</div>
	);
}
