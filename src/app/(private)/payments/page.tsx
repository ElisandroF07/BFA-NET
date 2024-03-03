"use client";

import PType1 from "@/components/cards/pay_type_1";
import PType0 from "@/components/cards/pay_type_default";
import "@/styles/payments.css";
import { useState } from "react";

export default function Dashboard() {
	const [selectedPage, setSelectedPage] = useState("1");

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
				{selectedPage === "0" && <PType0 />}
				{selectedPage === "1" && <PType1 />}
				{selectedPage === "2" && <></>}
			</div>
			<div className="payments_lateral" />
		</div>
	);
}
