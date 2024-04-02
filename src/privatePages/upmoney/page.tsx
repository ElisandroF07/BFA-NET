import LateralCard from "@/components/cards/requestCard";
import "@/styles/upmoney.css";
import { PiInfoThin } from "react-icons/pi";

interface IProps {
	authorized_balance: number,
	available_balance: number,
	email: string
}

export default function Upmoney({authorized_balance, available_balance, email}: IProps) {
	return (
		<div className="mainContainer">
			<div className="header">
				<div className="top">
					<h1>Levantamentos</h1>
					<p>Retire o seu dinheiro a qualquer momento.</p>
				</div>
				<div className="bottom">
					<div>
						<h2>Saldo contabilístico</h2>
						<p>{available_balance.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA', maximumFractionDigits: 0 })}</p>
					</div>
					<div>
						<h2>Saldo autorizado</h2>
						<p>{authorized_balance.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA', maximumFractionDigits: 0 })}</p>
					</div>
				</div>
			</div>
			<div className="middle">
				<div className="all-container">
					<p className="title">Levantamento sem cartão</p>
					<div className="container">
						<div className="containerToMe">
							<h4 className="title">Para mim</h4>
							<div className="toMe">
								<form action="">
									<h4 className="static-text">Meu número endereço de email</h4>
									<p className="static-number">{email}</p>
									<h4 className="static-text mt-2">Montante</h4>
									<div id="Kz" className="input_montante">
										<p>Kz</p>
										<input
											type="text"
											className="montante"
											placeholder="Introduza o montante"
										/>
									</div>
									<div className="info">
										<PiInfoThin className="icone" />
										<p>
											O código secreto é criado por si. É o primeiro código a
											ser introduzido para fazer o levantamento sem cartão. Deve
											container 3 dígitos.
										</p>
									</div>
									<label className="static-text">Código secreto</label>
									<div className="input-container">
										<input
											className="input"
											minLength={1}
											maxLength={1}
											type="text"
										/>
										<input
											className="input"
											minLength={1}
											maxLength={1}
											type="text"
										/>
										<input
											className="input"
											minLength={1}
											maxLength={1}
											type="text"
										/>
									</div>
									<label className="static-text">
										Repita o seu código secreto
									</label>
									<div className="input-container">
										<input
											className="input"
											minLength={1}
											maxLength={1}
											type="text"
										/>
										<input
											className="input"
											minLength={1}
											maxLength={1}
											type="text"
										/>
										<input
											className="input"
											minLength={1}
											maxLength={1}
											type="text"
										/>
									</div>
									<button className="botao" type="button">
										Confirmar
									</button>
								</form>
							</div>
						</div>
						<div className="containeranother">
							<h4 className="title">Para outra pessoa</h4>
							<div className="another">
								<form action="">
									<h4 className="static-text">Endereço de email do beneficiário</h4>

									<div id="Kz" className="input_montante">
										<input
											type="text"
											className="montante"
											placeholder="Introduza o endereço de email do beneficiário"
										/>
									</div>
									<h4 className="static-text">Montante</h4>
									<div id="Kz" className="input_montante">
										<p>Kz</p>
										<input
											type="text"
											className="montante"
											placeholder="Introduza o montante"
										/>
									</div>
									<div className="info">
										<PiInfoThin className="icone" />
										<p>
											O código secreto é criado por si. É o primeiro código a
											ser introduzido para fazer o levantamento sem cartão. Deve
											container 3 dígitos.
										</p>
									</div>

									<label className="static-text">Código secreto</label>
									<div className="input-container">
										<input
											className="input"
											minLength={1}
											maxLength={1}
											type="text"
										/>
										<input
											className="input"
											minLength={1}
											maxLength={1}
											type="text"
										/>
										<input
											className="input"
											minLength={1}
											maxLength={1}
											type="text"
										/>
									</div>
									<label className="static-text">
										Repita o seu código secreto
									</label>
									<div className="input-container">
										<input
											className="input"
											minLength={1}
											maxLength={1}
											type="text"
										/>
										<input
											className="input"
											minLength={1}
											maxLength={1}
											type="text"
										/>
										<input
											className="input"
											minLength={1}
											maxLength={1}
											type="text"
										/>
									</div>
								</form>

								<button className="botao" type="button">
									Confirmar
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="lateral">
				<h4>Levantamentos passados</h4>
				<div className="separator" />
				<div className="requests">
					<LateralCard
						text1="45.000,00 Kz"
						text2="948951028"
						text3="12/09/2023"
						text4="Efectuado"
						status="complete"
					/>
					<LateralCard
						text1="12.000 USD"
						text2="956101465"
						text3="11/09/2023"
						text4="Cancelado"
						status="rejected"
					/>
					<LateralCard
						text1="45.000,00 Kz"
						text2="921509915"
						text3="12/09/2023"
						text4="Efectuado"
						status="complete"
					/>
					<LateralCard
						text1="12.000 USD"
						text2="956101465"
						text3="11/09/2023"
						text4="Cancelado"
						status="rejected"
					/>
					<LateralCard
						text1="45.000,00 Kz"
						text2="921509915"
						text3="12/09/2023"
						text4="Efectuado"
						status="complete"
					/>
					<LateralCard
						text1="12.000 USD"
						text2="956101465"
						text3="11/09/2023"
						text4="Cancelado"
						status="rejected"
					/>
					<LateralCard
						text1="45.000,00 Kz"
						text2="921509915"
						text3="12/09/2023"
						text4="Efectuado"
						status="complete"
					/>
					<LateralCard
						text1="12.000 USD"
						text2="956101465"
						text3="11/09/2023"
						text4="Cancelado"
						status="rejected"
					/>
					<LateralCard
						text1="45.000,00 Kz"
						text2="921509915"
						text3="12/09/2023"
						text4="Efectuado"
						status="complete"
					/>
					<LateralCard
						text1="12.000 USD"
						text2="956101465"
						text3="11/09/2023"
						text4="Cancelado"
						status="rejected"
					/>
					<LateralCard
						text1="45.000,00 Kz"
						text2="921509915"
						text3="12/09/2023"
						text4="Efectuado"
						status="complete"
					/>
					<LateralCard
						text1="12.000 USD"
						text2="956101465"
						text3="11/09/2023"
						text4="Cancelado"
						status="rejected"
					/>
				</div>
			</div>
		</div>
	);
}
