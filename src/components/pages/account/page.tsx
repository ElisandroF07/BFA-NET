"use client";

import "@/styles/account.css";
import { CiImport, CiLocationArrow1 } from "react-icons/ci";
import OptionsSection from "@/components/cards/optionsSecton";
import { useState } from "react";
import ManageInfoSection from "@/components/cards/manageInfoSection";

export default function Account() {

	const [component, setComponent] = useState("options")

	return (
		<div className="account_container">
			<div className="account_header">
				<div className="top">
					<h1>Conta</h1>
					<p>Gerencie a sua.</p>
				</div>
			</div>
			<div className="account_body">
				<div className="settings">
					<div className="image" />
					<h1>Elisandro Canjeque da Paixao Franco</h1>
					<p>Conta Particular</p>
					{component === "options" ? <OptionsSection/> 
					: component === "manageInfo" ? <ManageInfoSection setComponent={setComponent}/> 
					: <></>}
				</div>
			</div>
			<div className="account_lateral">
				<h1 className="title">Minha conta</h1>
				<div className="separator"/>
				<div className="infoContainer">
					<div>
						<h1>Número da conta</h1>
						<p>545334534.3453.34</p>
					</div>
					<div>
						<h1>IBAN</h1>
						<p>AO06 0000 0040 4532 3454 7</p>
					</div>
					<div>
						<h1>NBA</h1>
						<p>AO06 0000 0040 4354 3454 7</p>
					</div>
					<div>
						<h1>BIC/SWIFT</h1>
						<p>BFMXAOLU</p>
					</div>
					<div>
						<h1>Divísa</h1>
						<p>Kz</p>
					</div>
					<div>
						<h1>Titular</h1>
						<p>Elisandro Franco</p>
					</div>
					<div>
						<h1>Data de abertura</h1>
						<p>26-09-2002</p>
					</div>
					<div>
						<h1>Tipo de conta</h1>
						<p>Conta à ordem</p>
					</div>
					<div>
						<h1>Saldo disponível</h1>
						<p>180.550,00 Kz</p>
					</div>
					<div>
						<h1>Saldo autorizado</h1>
						<p>180.550,00 Kz</p>
					</div>
					<div>
						<h1>Estado</h1>
						<p style={{display: "flex", alignItems: "center", justifyContent: "center"}}><div className="round" style={{width: "10px", height: "10px", borderRadius: "10px", backgroundColor: "#11aa11", marginRight: "10px"}}/>Ativa</p>
					</div>
				</div>
				<div className="separator"/>
				<p className="pLink">Enviar para email <CiLocationArrow1/></p>
				<p className="pLink">Salvar como PDF <CiImport/></p>
			</div>
		</div>
	);
}