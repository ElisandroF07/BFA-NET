import "@/styles/pay-types.css";
import { CiCircleChevRight } from "react-icons/ci"
export default function PayState() {
	return (
		<div className="pt3_container">
			<div className="top">
				<h1>Pagamentos ao estado</h1>
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
						<label htmlFor="email">Referência</label>
						<input
							type="text"
							placeholder="Introduza o número de referência"
							
						/>
					</div>
					<div className="input_field">
						<label htmlFor="email">Montante</label>
						<div className="input_phone">
							<p>Kz</p>
							<input
								type="text"
								placeholder="Conta emissora"
						
							/>
						</div>
					</div>
				</div>
				<div className="right">
				<div className="input_field">
						<label htmlFor="email">Data do pagamento</label>
						<input
							type="text"
							disabled
							style={{border: "none", background: "none"}}
							value="26 / 09 / 2005"
						/>
					</div>
					<div className="input_field">
						<label htmlFor="email">Descrição do pagamento</label>
							<input
								type="text"
								placeholder="Descreva o pagamento"
							/>
					</div>
				</div>
				<button type="button">Confirmar pagamento <CiCircleChevRight/></button>
			</div>
		</div>
	);
}
