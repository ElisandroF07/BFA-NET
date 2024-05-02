import Image from "next/image";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";
import business from "@/assets/images/Celebration-amico.svg";
import "@/styles/globals.css";
import "@/styles/phone_verification.css";

export default function VerifiedToken() {
	return (
		<div className="home_main">
			<div className="home_body">
				<div className="left">
					<Image src={business} alt="business" />
					<h1>Parabéns! O seu email foi verificado!</h1>
					<p>Você está pronto para avançar. </p>
				</div>
				<div className="right">
					<form className="login_form">
						<div className="header_form">
							<h1>O seu email foi verificado com sucesso!</h1>
							<p>
								Está na hora de finalizar as restantes etapas do seu processo de
								adesão!
							</p>
						</div>
						<div className="body_form">
							<Link
								type="button"
								href={"/register/account-type"}
								className="button_auth"
							>
								Avançar{" "}
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
