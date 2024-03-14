"use client";

import LateralCard from "@/components/cards/requestCard";
import TransferInterbanc from "@/components/transferTypes/tranfer_interbanc";
import TransferDefault from "@/components/transferTypes/transfer_default";
import TransferInternational from "@/components/transferTypes/transfer_international";
import TransferIntrabanc from "@/components/transferTypes/transfer_intrabanc";
import TransferWallet from "@/components/transferTypes/transfer_wallet";
import "@/styles/transfers.css";
import { useState } from "react";

export default function Transfers() {
	const [selectedPage, setSelectedPage] = useState("0");

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
						<p>Kz 832.540,00</p>
					</div>
					<div>
						<h2>Saldo autorizado</h2>
						<p>Kz 832.540,00</p>
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
							<option value="3">Transferência internacional</option>
							<option value="4">Carregamento de carteira digital</option>
						</select>
					</div>
				</div>
			</div>
			<div className="transfers_body">
				{selectedPage === "0" && <TransferDefault />}
				{selectedPage === "1" && <TransferInterbanc />}
				{selectedPage === "2" && <TransferIntrabanc />}
				{selectedPage === "3" && <TransferInternational />}
				{selectedPage === "4" && <TransferWallet />}
			</div>
			<div className="transfers_lateral">
				<div className="top">
					<h1 className="title">Transferências enviadas</h1>
					<div className="separator" />
					<div className="requests">
						<LateralCard
							text1="45.000,00 Kz"
							text2="Paratus"
							text3="12/09/2023"
							text4="Internet Service"
						/>
						<LateralCard
							text1="12.000 USD"
							text2="Vercel"
							text3="11/09/2023"
							text4="Premium Cloud Storage"
						/>
						<LateralCard
							text1="45.000,00 Kz"
							text2="Paratus"
							text3="12/09/2023"
							text4="Internet Service"
						/>
						<LateralCard
							text1="12.000 USD"
							text2="Vercel"
							text3="11/09/2023"
							text4="Premium Cloud Storage"
						/>
						<LateralCard
							text1="45.000,00 Kz"
							text2="Paratus"
							text3="12/09/2023"
							text4="Internet Service"
						/>
						<LateralCard
							text1="12.000 USD"
							text2="Vercel"
							text3="11/09/2023"
							text4="Premium Cloud Storage"
						/>
					</div>
				</div>
				<div className="bottom">
					<h1 className="title">Transferências recebidas</h1>
					<div className="separator" />
					<div className="requests">
						<LateralCard
							text1="45.000,00 Kz"
							text2="Paratus"
							text3="12/09/2023"
							text4="Internet Service"
						/>
						<LateralCard
							text1="12.000 USD"
							text2="Vercel"
							text3="11/09/2023"
							text4="Premium Cloud Storage"
						/>
						<LateralCard
							text1="45.000,00 Kz"
							text2="Paratus"
							text3="12/09/2023"
							text4="Internet Service"
						/>
						<LateralCard
							text1="12.000 USD"
							text2="Vercel"
							text3="11/09/2023"
							text4="Premium Cloud Storage"
						/>
						<LateralCard
							text1="45.000,00 Kz"
							text2="Paratus"
							text3="12/09/2023"
							text4="Internet Service"
						/>
						<LateralCard
							text1="12.000 USD"
							text2="Vercel"
							text3="11/09/2023"
							text4="Premium Cloud Storage"
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
