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
					<ul className="services">
						<ButtonService
							image={unitelmoney}
							serviceName="Unitel Money"
							setWallet={setWallet}
						/>
						<ButtonService
							image={afrimoney}
							serviceName="Afrimoney"
							setWallet={setWallet}
						/>
						<ButtonService
							image={bnix}
							serviceName="BNI BNIX"
							setWallet={setWallet}
						/>
						<ButtonService
							image={ekwanza}
							serviceName="É-Kwanza BAI"
							setWallet={setWallet}
						/>
						<ButtonService
							image={kwanza}
							serviceName="Kwanza"
							setWallet={setWallet}
						/>
						<ButtonService
							image={kwanzaonline}
							serviceName="Kwanza Online"
							setWallet={setWallet}
						/>
						<ButtonService
							image={xikila}
							serviceName="Xikila Money"
							setWallet={setWallet}
						/>
						<ButtonService
							image={aki}
							serviceName="Aki"
							setWallet={setWallet}
						/>
						<ButtonService
							image={wise}
							serviceName="Wise"
							setWallet={setWallet}
						/>
						<ButtonService
							image={binance}
							serviceName="Binance"
							setWallet={setWallet}
						/>
						<ButtonService
							image={paypay}
							serviceName="PayPay AO"
							setWallet={setWallet}
						/>
						<ButtonService
							image={paypal}
							serviceName="PayPal"
							setWallet={setWallet}
						/>
					</ul>
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
									value="26 / 09 / 2024"
								/>
							</div>
							<div className="input_field">
								<label htmlFor="email">Código de referência</label>
								<input
									type="text"
									placeholder="Código emitido pela carteira digital"
								/>
							</div>
							<div className="input_field">
								<label htmlFor="email">Montante</label>
								<div className="input_phone">
									<p>Kz</p>
									<input type="text" placeholder="Montante" />
								</div>
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