import useUserStore from "@/contexts/stores/userStore";
import { FaAngleLeft } from "react-icons/fa6";

interface IProps{
	biNumber: string,
	titular: string,
	email: string,
	country: string,
	address: string,
	birthDate: string
}

export default function ManageInfoSection({biNumber, titular, email, birthDate, country, address}: IProps) {
	const store = useUserStore();

	function convertData(dataString: string){
		const data = new Date(dataString);

		const dia = data.getDate();
		const mes = data.getMonth() + 1; // Mês começa em zero, então adicionamos 1
		const ano = data.getFullYear();

		const dataFormatada = `${dia < 10 ? `0${dia}` : dia}-${mes < 10 ? `0${mes}` : mes}-${ano}`;

		return dataFormatada
	}
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
				<p>Gerir informações</p>
			</div>
			<div className="bottom">
				<div className="input_field" style={{width: "400px"}}>
					<label htmlFor="email">Nome Completo</label>
					<input
						type="text"
						placeholder="Insira o seu nome completo"
						value={titular}
						disabled
					/>
				</div>
				<div className="input_field" style={{width: "400px"}}>
					<label htmlFor="email">Data de Nascimento</label>
					<input type="text" value={convertData(birthDate)} disabled />
				</div>
				<div className="input_field" style={{width: "400px"}}>
					<label htmlFor="email">Email</label>
					<input
						type="text"
						placeholder="Insira o seu número de telefone"
						value={email}
						disabled
					/>
				</div>
				<div className="input_field" style={{width: "400px"}}>
					<label htmlFor="email">Número do BI</label>
					<input
						type="text"
						placeholder="Insira o seu endereço de email"
						value={biNumber}
						disabled
					/>
				</div>
				<div className="input_field" style={{width: "400px"}}>
					<label htmlFor="email">País</label>
					<input
						type="text"
						placeholder="Insira o seu número de telefone"
						value={country}
						disabled
					/>
				</div>
				<div className="input_field" style={{width: "400px"}}>
					<label htmlFor="email">Endereço</label>
					<input
						type="text"
						placeholder="Insira o seu endereço de email"
						value={address}
						disabled
					/>
				</div>
			</div>
		</div>
	);
}
