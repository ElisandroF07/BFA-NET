import "@/styles/globals.css";
import "@/styles/phone_verification.css";
import Image from "next/image";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";
import business from "../../../../../../public/assets/images/403 Error Forbidden-pana.svg";

export default function Register() {
	return (
		<div className="home_main">
			<div className="home_body">
				<div className="left">
					<Image src={business} alt="business" />
					<h1>403! Link de verificação inválido!</h1>
					<p>O link acessado é inválido! </p>
				</div>
				<div className="right">
					<form className="login_form">
						<div className="header_form">
							<h1>Link de verificação inválido!</h1>
							<p>Isto occore quando o link já foi acessado uma vez!</p>
						</div>
						<div className="body_form">
							<Link href={"/"} type="button" className="button_auth">
								Ir para a home{" "}
								<FaArrowRight
									style={{
										color: "var(--color-cards)",
										width: "20px",
										height: "20px",
										marginLeft: "10px",
									}}
								/>
							</Link>
							<div className="terms">
								<p />
							</div>
						</div>
					</form>
					<p className="basic_text not_found_footer">
						© 2024 Banco de Fomento Angola
					</p>
				</div>
			</div>
		</div>
	);
}
