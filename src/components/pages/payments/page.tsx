"use client";

import LateralCard from "@/components/cards/requestCard";
import RequestCard from "@/components/cards/requestCard";
import PType0 from "@/components/paymentTypes/pay_default";
import PayDefault from "@/components/paymentTypes/pay_default";
import PayReference from "@/components/paymentTypes/pay_reference";
import PayServices from "@/components/paymentTypes/pay_services";
import PType1 from "@/components/paymentTypes/pay_services";
import PayState from "@/components/paymentTypes/pay_state";
import "@/styles/payments.css";
import { useState } from "react";

export default function Payments() {
	const [selectedPage, setSelectedPage] = useState("0");

	return (
		<div className="payments_container">
			<div className="payments_header">
				<div className="top">
					<h1>Pagamentos</h1>
					<p>Pague onde estiver.</p>
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
						<h2>Selecione o tipo de pagamento</h2>
						<select
							name="payment_type"
							id="payment_type"
							onChange={(event) => setSelectedPage(event.target.value)}
						>
							<option value="Selecione" selected disabled>
								Selecione
							</option>
							<option value="1">Pagamento de serviços</option>
							<option value="2">Pagamento ao estado</option>
							<option value="3">Pagamento por referência</option>
						</select>
					</div>
				</div>
			</div>
			<div className="payments_body">
				{selectedPage === "0" && <PayDefault />}
				{selectedPage === "1" && <PayServices />}
				{selectedPage === "2" && <PayState />}
				{selectedPage === "3" && <PayReference />}
			</div>
			<div className="payments_lateral">
				<h1 className="title">Últimos pagamentos</h1>
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
	);
}
