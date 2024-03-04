import "@/styles/pay-types.css";
import { CiSearch } from "react-icons/ci";
import img from "../../../public/assets/images/bifrente.jpg";
import ButtonService from "../buttons/buttonService";

export default function Pay_type_1() {
	return (
		<div className="pt1_container">
			<div className="top">
				<h1>Pagamentos de serviços</h1>
				<div className="separator" />
			</div>
			<div className="bottom">
				<div className="left">
					<h1>Selecione o serviço</h1>
					<div className="searchBar">
						<input type="text" placeholder="Pesquise..." />
						<button type="button">
							<CiSearch />
						</button>
					</div>
					<ul className="services">
						<ButtonService image={img} serviceName="Zap" />
						<ButtonService image={img} serviceName="Zap" />
						<ButtonService image={img} serviceName="Zap" />
						<ButtonService image={img} serviceName="Zap" />
						<ButtonService image={img} serviceName="Zap" />
						<ButtonService image={img} serviceName="Zap" />{" "}
					</ul>
				</div>
				<div className="right" />
			</div>
		</div>
	);
}
