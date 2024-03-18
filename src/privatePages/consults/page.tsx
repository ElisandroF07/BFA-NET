import LateralCard from "@/components/cards/requestCard";
import RequestCard from "@/components/cards/requestCard";
import "@/styles/consults.css";
import {
	CiCircleChevDown,
	CiCircleChevUp,
	CiCirclePlus,
	CiImport,
} from "react-icons/ci";
import { FaAngleDown } from "react-icons/fa6";

interface IProps {
	authorized_balance: number,
	available_balance: number,
	iban: string
}

export default function Consults({authorized_balance, available_balance, iban}: IProps) {
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
						<p>Kz {available_balance},00</p>
					</div>
					<div>
						<h2>Saldo autorizado</h2>
						<p>Kz {authorized_balance},00</p>
					</div>
					<div>
						<h2>IBAN</h2>
						<p>{iban}</p>
					</div>
				</div>
			</div>
			<div className="consults_body">
				<h1 className="title">Histórico de movimentações</h1>
				<div className="historic">
					<div>
						<div className="left">
							<h1>Levantamento sem cartão</h1>
							<p>25.000,00 KZ</p>
						</div>
						<div className="right">
							<p>
								Ref. 003245345 <CiCircleChevDown style={{ fill: "#ff1111" }} />
							</p>
						</div>
					</div>
					<div>
						<div className="left">
							<h1>Levantamento sem cartão</h1>
							<p>25.000,00 KZ</p>
						</div>
						<div className="right">
							<p>
								Ref. 003245345 <CiCircleChevUp style={{ fill: "#11aa11" }} />
							</p>
						</div>
					</div>
					<div>
						<div className="left">
							<h1>Levantamento sem cartão</h1>
							<p>25.000,00 KZ</p>
						</div>
						<div className="right">
							<p>
								Ref. 003245345 <CiCircleChevUp style={{ fill: "#11aa11" }} />
							</p>
						</div>
					</div>
					<div>
						<div className="left">
							<h1>Levantamento sem cartão</h1>
							<p>25.000,00 KZ</p>
						</div>
						<div className="right">
							<p>
								Ref. 003245345 <CiCircleChevDown style={{ fill: "#ff1111" }} />
							</p>
						</div>
					</div>
					<div>
						<div className="left">
							<h1>Levantamento sem cartão</h1>
							<p>25.000,00 KZ</p>
						</div>
						<div className="right">
							<p>
								Ref. 003245345 <CiCircleChevUp style={{ fill: "#11aa11" }} />
							</p>
						</div>
					</div>
					<div>
						<div className="left">
							<h1>Levantamento sem cartão</h1>
							<p>25.000,00 KZ</p>
						</div>
						<div className="right">
							<p>
								Ref. 003245345 <CiCircleChevDown style={{ fill: "#ff1111" }} />
							</p>
						</div>
					</div>
					<div>
						<div className="left">
							<h1>Levantamento sem cartão</h1>
							<p>25.000,00 KZ</p>
						</div>
						<div className="right">
							<p>
								Ref. 003245345 <CiCircleChevDown style={{ fill: "#ff1111" }} />
							</p>
						</div>
					</div>
					<div>
						<div className="left">
							<h1>Levantamento sem cartão</h1>
							<p>25.000,00 KZ</p>
						</div>
						<div className="right">
							<p>
								Ref. 003245345 <CiCircleChevDown style={{ fill: "#ff1111" }} />
							</p>
						</div>
					</div>
					<div>
						<div className="left">
							<h1>Levantamento sem cartão</h1>
							<p>25.000,00 KZ</p>
						</div>
						<div className="right">
							<p>
								Ref. 003245345 <CiCircleChevDown style={{ fill: "#ff1111" }} />
							</p>
						</div>
					</div>
					<div>
						<div className="left">
							<h1>Levantamento sem cartão</h1>
							<p>25.000,00 KZ</p>
						</div>
						<div className="right">
							<p>
								Ref. 003245345 <CiCircleChevDown style={{ fill: "#ff1111" }} />
							</p>
						</div>
					</div>
					<div>
						<div className="left">
							<h1>Levantamento sem cartão</h1>
							<p>25.000,00 KZ</p>
						</div>
						<div className="right">
							<p>
								Ref. 003245345 <CiCircleChevDown style={{ fill: "#ff1111" }} />
							</p>
						</div>
					</div>
					<div>
						<div className="left">
							<h1>Levantamento sem cartão</h1>
							<p>25.000,00 KZ</p>
						</div>
						<div className="right">
							<p>
								Ref. 003245345 <CiCircleChevDown style={{ fill: "#ff1111" }} />
							</p>
						</div>
					</div>
					<div>
						<div className="left">
							<h1>Levantamento sem cartão</h1>
							<p>25.000,00 KZ</p>
						</div>
						<div className="right">
							<p>
								Ref. 003245345 <CiCircleChevDown style={{ fill: "#ff1111" }} />
							</p>
						</div>
					</div>
				</div>
			</div>
			<div className="consults_lateral">
				<div>
					<h1 className="title">Extratos</h1>
				</div>
				<div className="generator">
					<p>
						Gerar extrato <CiImport />
					</p>
				</div>
				<div className="separator" />
				<h1 className="title">Requisições</h1>
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
				</div>
			</div>
		</div>
	);
}
