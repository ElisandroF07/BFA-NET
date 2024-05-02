import {
	Button,
	Link,
	Navbar,
	NavbarBrand,
	NavbarContent,
	NavbarItem,
	NavbarMenu,
	NavbarMenuItem,
	NavbarMenuToggle,
} from "@nextui-org/react";
import "@/styles/not-found.css";
import "@/styles/globals.css";
import "@/styles/navbar.css";
import svg from '@/assets/images/500Internal Server Error-rafiki.svg'
import Image from "next/image";

export default function Custom500INT() {
	return (
		<div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
			<main className="not_found">
				<div className="not_found_central">
					<div className="not_found_svg_container">
						<Image src={svg} alt="svg" />
					</div>
					<div className="not_found_text_container">
						<h1 className="not_found_title">Erro no servidor!</h1>
						<p className="basic_text">
							
							Estamos trabalhando para corrigir isso. Por favor, tente novamente
							mais tarde.
							<br /> Agradecemos sua compreensão.
						</p>
						<Link href="/dashboard" className="button_home" id="not_found">
							<p>Recarregar página</p>
						</Link>
					</div>
				</div>
				<p className="basic_text not_found_footer">
					© 2024 Banco de Fomento Angola
				</p>
			</main>
		</div>
	);
}
