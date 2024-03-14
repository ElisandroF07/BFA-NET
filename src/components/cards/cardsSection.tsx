"use client";

import useUserStore from "@/contexts/stores/userStore";
import Image from "next/image";
import { useState } from "react";
import { BiHide, BiShow } from "react-icons/bi";
import { FaAngleLeft } from "react-icons/fa6";
import { MdOutlineLock, MdOutlineLockOpen } from "react-icons/md";
import bfacard from "../../../public/assets/images/bfacard.svg";

export default function CardsSection() {
	const [locked, setLocked] = useState(false);
	const [show, setShow] = useState(false);
	const store = useUserStore();
	return (
		<div className="cards manageInfoContainer">
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
				<p>Cartões</p>
			</div>
			<div className="cardsbottom">
				<div className="left">
					<div className="input_field" style={{ margin: "0px" }}>
						<label htmlFor="email">Apelido do cartão</label>
						<input
							type="text"
							placeholder="Dê um nome ao cartão"
							value="Débito 1"
							disabled
						/>
					</div>
					<div className="multiText">
						<h1>Tipo de cartão</h1>
						<p>Multicaixa de Débito</p>
					</div>
					<div className="multiText">
						<h1>Número do cartão</h1>
						<p>3454 9680 0594 1145</p>
					</div>
					<div className="multiText">
						<h1>Data de validade</h1>
						<p>09 / 2025</p>
					</div>
					<div className="multiText">
						<h1>Titular</h1>
						<p>Elisandro Franco</p>
					</div>
					<div className="multiText">
						<h1>PIN</h1>
						<p>{show ? <>2 5 6 3</> : <>* * * *</>}</p>
					</div>
					<div className="multiText">
						{locked ? (
							<button
								type="button"
								onClick={() => setLocked(false)}
								data-locked="true"
							>
								Desbloquear <MdOutlineLockOpen />
							</button>
						) : (
							<button
								type="button"
								onClick={() => setLocked(true)}
								data-locked="false"
							>
								Bloquear <MdOutlineLock />
							</button>
						)}
						{show ? (
							<button
								type="button"
								onClick={() => setShow(false)}
								data-show="true"
							>
								Esconder PIN <BiHide />
							</button>
						) : (
							<button
								type="button"
								onClick={() => setShow(true)}
								data-show="false"
							>
								Exibir PIN <BiShow />
							</button>
						)}
					</div>
				</div>
				<div className="right">
					<div className="cardImage">
						<p>Elisandro Franco</p>
						<p>09 / 2025</p>
						<p>1145</p>
					</div>
				</div>
			</div>
			<div className="buttonContainer">
				<button type="button">Salvar alterações</button>
			</div>
		</div>
	);
}
