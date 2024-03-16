import useUserStore from "@/contexts/stores/userStore";
import { FaAngleLeft, FaArrowRight } from "react-icons/fa6";
import { IoIosArrowRoundForward } from "react-icons/io";

export default function SecuritySection() {
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
				<p>Segurança</p>
			</div>
			<div className="security bottom">
				<button type="button">
					Alterar código de acesso <IoIosArrowRoundForward />
				</button>
				<button type="button">
					Alterar endereço de email <IoIosArrowRoundForward />
				</button>
			</div>
		</div>
	);
}
