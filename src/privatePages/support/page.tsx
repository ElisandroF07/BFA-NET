import Link from "next/link";
import { CiPaperplane } from "react-icons/ci";
import "@/styles/support.css";

export default function Support() {
	return (
		<div className="support_container">
			<div className="support_header">
				<div className="top">
					<h1>Suporte</h1>
					<p>Sempre disponível para você.</p>
				</div>
			</div>
			<div className="support_body">
				<div className="channels">
					<div className="image" />
					<h1 className="title" style={{color: "#3B3D4E"}}>Fale connosco</h1>
					<p>
						A Linha de Atendimento BFA está disponível 24h por dia. Se tem
						dúvidas, sugestões ou reclamações, fale connosco.
					</p>
					<div>
						<h1>Atendimento personalizado</h1>
						<p>06h - 23h59</p>
					</div>
					<div>
						<h1>Atendimento automático IVR</h1>
						<p>00h - 05h59</p>
					</div>
					<div className="separator" />
					<h1>Como fazer</h1>
					<div>
						<p>1º Ligue</p>
						<p>923 120 120</p>
					</div>
					<div>
						<p>2º Esclareça as suas questões</p>
						<p> </p>
					</div>
					<div className="separator" />
					<h1>Custos</h1>
					<p>
						O curso de cada chamada para a Linha de atendimento BFA depende da
						tarifa em vigor de cada operador.
					</p>
				</div>
				<div className="channels">
					<div className="image" />
					<h1 className="title" style={{color: "#3B3D4E"}}>Canal de denúncias</h1>
					<p>
						Telefone (+244) 931 053 771 (chamadas pagas de acordo com o serviço
						nacional).
					</p>
					<p>Fax (+244) 931 053 811</p>
					<p>
						Email:{" "}
						<Link href={"mailto:bfa.denuncias@bfa.ao"} target="_blank">
							bfa.denuncias@bfa.ao
						</Link>
					</p>
					<p>
						Plataforma online:{" "}
						<Link href={"mailto:bfa@bfa.ao"} target="_blank">
							bfa@bfa.ao
						</Link>{" "}
						ou via QR Code:{" "}
					</p>
					{/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 33 33" shape-rendering="crispEdges"><path fill="#ffffff" d="M0 0h33v33H0z"/><path stroke="#000000" d="M4 4.5h7m2 0h1m4 0h1m1 0h1m1 0h7M4 5.5h1m5 0h1m3 0h2m1 0h1m1 0h2m1 0h1m5 0h1M4 6.5h1m1 0h3m1 0h1m1 0h1m1 0h1m4 0h2m1 0h1m1 0h3m1 0h1M4 7.5h1m1 0h3m1 0h1m1 0h3m1 0h4m2 0h1m1 0h3m1 0h1M4 8.5h1m1 0h3m1 0h1m1 0h1m2 0h2m3 0h1m1 0h1m1 0h3m1 0h1M4 9.5h1m5 0h1m1 0h3m1 0h2m1 0h1m2 0h1m5 0h1M4 10.5h7m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h7M12 11.5h3m3 0h1m1 0h1M4 12.5h1m1 0h5m2 0h2m1 0h5m1 0h5M4 13.5h4m1 0h1m1 0h2m1 0h3m3 0h1m2 0h1m3 0h1M6 14.5h3m1 0h3m2 0h1m2 0h2m1 0h2m1 0h2m1 0h2M4 15.5h1m1 0h1m4 0h3m2 0h1m1 0h1m1 0h1m7 0h1M4 16.5h2m2 0h4m2 0h1m1 0h3m2 0h2m1 0h1m1 0h3M4 17.5h1m2 0h1m3 0h3m3 0h1m5 0h1m1 0h1m1 0h1M4 18.5h1m4 0h2m1 0h2m1 0h2m1 0h2m2 0h4m1 0h2M4 19.5h1m1 0h1m1 0h2m4 0h2m3 0h6m3 0h1M4 20.5h1m1 0h1m1 0h1m1 0h1m1 0h1m2 0h3m1 0h6m1 0h1M12 21.5h3m1 0h2m2 0h1m3 0h2M4 22.5h7m2 0h2m1 0h3m1 0h1m1 0h1m1 0h1m1 0h3M4 23.5h1m5 0h1m1 0h2m2 0h1m3 0h1m3 0h2m1 0h2M4 24.5h1m1 0h3m1 0h1m1 0h2m3 0h8m1 0h1M4 25.5h1m1 0h3m1 0h1m1 0h2m1 0h1m5 0h2m1 0h5M4 26.5h1m1 0h3m1 0h1m1 0h3m1 0h1m8 0h2m1 0h1M4 27.5h1m5 0h1m2 0h2m1 0h1m1 0h4m1 0h3m2 0h1M4 28.5h7m1 0h3m2 0h2m4 0h6"/></svg>

				</div>
				<div className="channels">
					<div className="image" />
					<h1 className="title" style={{color: "#3B3D4E"}}>Reclamações</h1>
					<p>
						Este é o espaço para se aproximar ao BFA. Envie-nos os seus
						comentários, sugestões e reclamações, teremos o maior prazer em
						responder.
					</p>
					<div className="separator" />
					<form action={"mailto:bfanetapi@gmail.com"}>
						<textarea placeholder="Mensagem" />
						<button type="submit">
							Enviar formulário <CiPaperplane />
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}
