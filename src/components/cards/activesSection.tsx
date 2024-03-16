import useUserStore from "@/contexts/stores/userStore";
import { FaAngleLeft } from "react-icons/fa6";

export default function ActivesSection() {
	const store = useUserStore();
	return (
		<div className="manageInfoContainer">
			{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
			<div
				className="top"
				onClick={() => {
					store.updateValidation("options");
				}}
			>
				<button type="button">
					<FaAngleLeft />
				</button>
				<p>Ativos</p>
			</div>
			<div className="bottom">
				<div className="input_field">
					<label htmlFor="email">Nome Completo</label>
					<input
						type="text"
						placeholder="Insira o seu nome completo"
						value="Elisandro Canjeque da Paixão Franco"
						disabled
					/>
				</div>
				<div className="input_field">
					<label htmlFor="email">Data de Nascimento</label>
					<input type="date" value="26/09/2005" disabled />
				</div>
				<div className="input_field">
					<label htmlFor="email">Telefone</label>
					<input
						type="number"
						placeholder="Insira o seu número de telefone"
						value="948951028"
						disabled
					/>
				</div>
				<div className="input_field">
					<label htmlFor="email">Email</label>
					<input
						type="text"
						placeholder="Insira o seu endereço de email"
						value="Elisandrofranco@g2devs.com"
						disabled
					/>
				</div>
			</div>
			<div className="btnContainer">
				<button type="button">Confirmar</button>
			</div>
		</div>
	);
}
