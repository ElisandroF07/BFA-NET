import useUserStore from "@/contexts/stores/userStore";
import { Dispatch, SetStateAction } from "react";
import {
	CiCreditCard2,
	CiViewTimeline,
	CiVirus,
	CiWallet,
} from "react-icons/ci";

export default function OptionsSection() {
	const store = useUserStore();

	return (
		<div className="optionsContainer">
			{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
			<div
				onClick={() => {
					store.updateValidation("manageInfo");
				}}
			>
				<CiViewTimeline />
				<p>Informações do Cliente</p>
			</div>
			{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
			<div
				onClick={() => {
					store.updateValidation("cards");
				}}
			>
				<CiCreditCard2 />
				<p>Cartões</p>
			</div>
			{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
			<div
				onClick={() => {
					store.updateValidation("security");
				}}
			>
				<CiVirus />
				<p>Segurança</p>
			</div>
		</div>
	);
}
