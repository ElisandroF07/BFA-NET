"use client"

import "@/styles/pay-types.css";
import { CiCircleChevRight, CiSearch } from "react-icons/ci"
import unitelmoney from '../../../public/assets/images/wallets/unitelmoney.png'
import afrimoney from '../../../public/assets/images/wallets/afrimoney.png'
import aki from '../../../public/assets/images/wallets/aki.png'
import ekwanza from '../../../public/assets/images/wallets/ekwanza.png'
import kwanza from '../../../public/assets/images/wallets/kwanza.png'
import kwanzaonline from '../../../public/assets/images/wallets/kwanzaonline.png'
import xikila from '../../../public/assets/images/wallets/xikila.png'
import paypay from '../../../public/assets/images/wallets/paypay.png'
import paypal from '../../../public/assets/images/wallets/paypal.png'
import wise from '../../../public/assets/images/wallets/wise.png'
import binance from '../../../public/assets/images/wallets/binance.png'
import bnix from '../../../public/assets/images/wallets/bnix.png'
import ButtonService from "../buttons/buttonService";
import { useEffect, useState } from "react";

export default function TransferWallet() {

	const [wallet, setWallet] = useState("")

	useEffect(()=>{
		const btns = document.querySelectorAll('.btnService') as NodeListOf<HTMLLIElement>
	
		function setActive(btn: HTMLLIElement){

			for (const btn of btns){
				btn.dataset.active = "false"
			}
			btn.dataset.active = "true"
		}

		for (const btn of btns){
			btn.addEventListener("click", ()=>{
				setActive(btn)
			})
		}
	}, [])

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
						<ButtonService image={unitelmoney} serviceName="Unitel Money" setWallet={setWallet} />
						<ButtonService image={afrimoney} serviceName="Afrimoney" setWallet={setWallet} />
						<ButtonService image={bnix} serviceName="BNI BNIX" setWallet={setWallet} />
						<ButtonService image={ekwanza} serviceName="É-Kwanza BAI" setWallet={setWallet} />
						<ButtonService image={kwanza} serviceName="Kwanza" setWallet={setWallet} />
						<ButtonService image={kwanzaonline} serviceName="Kwanza Online" setWallet={setWallet} />
						<ButtonService image={xikila} serviceName="Xikila Money" setWallet={setWallet} />
						<ButtonService image={aki} serviceName="Aki" setWallet={setWallet} />
						<ButtonService image={wise} serviceName="Wise" setWallet={setWallet} />
						<ButtonService image={binance} serviceName="Binance" setWallet={setWallet} />
						<ButtonService image={paypay} serviceName="PayPay AO" setWallet={setWallet} />
						<ButtonService image={paypal} serviceName="PayPal" setWallet={setWallet} />
					</ul>
				</div>
				<div className="wallet rigth">
					{wallet === "" ? <>Selecione a carteira</> : <><div className="input_field">
													<label htmlFor="email">Conta emissora</label>
													<input
														type="text"
														disabled
														style={{border: "none", background: "none"}}
														value="43674324.10235.353"
													/>
												</div>
												<div className="input_field">
													<label htmlFor="email">Descrição da transação</label>
													<p className="static-number" style={{paddingLeft: "15px"}}>Carregamento de carteira digital: {wallet}</p>
												</div>
												<div className="input_field">
													<label htmlFor="email">Data do carregamento</label>
													<input
														type="text"
														disabled
														style={{border: "none", background: "none"}}
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
														<input
															type="text"
															placeholder="Montante"
														/>
													</div>
												</div>
												<div className="buttonContainer">
													<button type="button">Confirmar transferência <CiCircleChevRight/></button>
												</div></>}
							
				</div>
			</div>
		</div>
	);
}
