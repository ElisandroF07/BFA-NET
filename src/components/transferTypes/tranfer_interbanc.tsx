import "@/styles/transfer-types.css";
import { CiCircleChevRight, CiCircleInfo } from "react-icons/ci"
export default function TransferInterbanc() {
	return (
		<div className="tt3_container">
			<div className="top">
				<h1>Transferências interbancárias</h1>
				<div className="separator" />
			</div>
			<div className="bottom">
				<div className="left">
					<div className="input_field">
						<label htmlFor="email">Conta emissora</label>
						<input
							type="text"
							disabled
							style={{border: "none", background: "none"}}
							value="43674324.10235.353"
						/>
					</div>
					<div className="input_field">
						<label htmlFor="email">IBAN da conta receptora</label>
						<div className="input_phone">
							<p>AO06</p>
							<input
								type="text"
								placeholder="Número do IBAN"
							/>
						</div>
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
				</div>
				<div className="right">
				<div className="input_field">
						<label htmlFor="email">Data da transferência</label>
						<input
							type="text"
							disabled
							style={{border: "none", background: "none"}}
							value="26 / 09 / 2005"
						/>
					</div>
					<div className="input_field">
						<label htmlFor="email">Descrição da transferência</label>
							<input
								type="text"
								placeholder="Descreva o motivo da transferência"
							/>
					</div>
					<div className="input_field">
						<label htmlFor="email">Descrição do destinatário</label>
							<input
								type="text"
								placeholder="Descreva o destinatário (nome, parentesco, ...)"
							/>
					</div>
				</div>
				<div className="information">
					<CiCircleInfo className="icone"/>
					<p>Estimando cliente, informamos que para transferências interbancárias a conta beneficiária poderá ser creditada no próximo dia útil em função dos procedimentos do banco destino.
					</p>
					<button type="button">Confirmar transferência <CiCircleChevRight/></button>
				</div>  
			</div>
		</div>
	);
}
