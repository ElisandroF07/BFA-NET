"use client";

import "@/styles/pay-types.css";
import { useEffect, useState } from "react";
import { CiCircleChevRight, CiSearch } from "react-icons/ci";
import afrimoney from "@/assets/images/wallets/afrimoney.png";
import aki from "@/assets/images/wallets/aki.png";
import binance from "@/assets/images/wallets/binance.png";
import bnix from "@/assets/images/wallets/bnix.png";
import ekwanza from "@/assets/images/wallets/ekwanza.png";
import kwanza from "@/assets/images/wallets/kwanza.png";
import kwanzaonline from "@/assets/images/wallets/kwanzaonline.png";
import paypal from "@/assets/images/wallets/paypal.png";
import paypay from "@/assets/images/wallets/paypay.png";
import unitelmoney from "@/assets/images/wallets/unitelmoney.png";
import wise from "@/assets/images/wallets/wise.png";
import xikila from "@/assets/images/wallets/xikila.png";
import ButtonService from "../buttons/buttonService";

export default function TransferWallet({number}: {number: string}) {
	const [wallet, setWallet] = useState("");

	useEffect(() => {
		const btns = document.querySelectorAll(
			".btnService",
		) as NodeListOf<HTMLLIElement>;

		function setActive(btn: HTMLLIElement) {
			for (const btn of btns) {
				btn.dataset.active = "false";
			}
			btn.dataset.active = "true";
		}

		for (const btn of btns) {
			btn.addEventListener("click", () => {
				setActive(btn);
			});
		}
	}, []);

	function getDataAtual() {
		const data = new Date();
		const dia = String(data.getDate()).padStart(2, '0');
		const mes = String(data.getMonth() + 1).padStart(2, '0');
		const ano = data.getFullYear();
		return `${dia}/${mes}/${ano}`;
	}

	return (
		<div className="pt1_container">
			<div className="top">
				<h1>Pagamentos de serviços</h1>
				<div className="separator" />
			</div>
			<div className="bottom">
				<div className="left">
					<h1>Selecione o carteira</h1>
					<div className="searchBar">
						<input type="text" placeholder="Pesquise..." />
						<button type="button">
							<CiSearch />
						</button>
					</div>

				</div>
				<div className="wallet rigth">
					{wallet === "" ? (
						<>Selecione a carteira</>
					) : (
						<>
							<div className="input_field">
								<label htmlFor="email">Conta emissora</label>
								<input
									type="text"
									disabled
									style={{ border: "none", background: "none" }}
									value={number}
								/>
							</div>
							<div className="input_field">
								<label htmlFor="email">Descrição da transação</label>
								<p className="static-number" style={{ paddingLeft: "15px" }}>
									Carregamento de carteira digital: {wallet}
								</p>
							</div>
							<div className="input_field">
								<label htmlFor="email">Data do carregamento</label>
								<input
									type="text"
									disabled
									style={{ border: "none", background: "none" }}
									value={getDataAtual()}
								/>
							</div>
							<div className="input_field">
								<label htmlFor="email">Código de referência</label>
								<input
									type="text"
									placeholder="Código emitido pela carteira digital"
								/>
							</div>
							<div className="buttonContainer">
								<button type="button">
									Confirmar transferência <CiCircleChevRight />
								</button>
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	);
}
