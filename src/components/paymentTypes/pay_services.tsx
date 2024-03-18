"use client";

import "@/styles/pay-types.css";
import { useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import africell from "@/assets/images/africell.png";
import aws from "@/assets/images/aws.png";
import dezzer from "@/assets/images/dezzer.png";
import dstv from "@/assets/images/dstv.png";
import ende from "@/assets/images/ende.png";
import googlecloud from "@/assets/images/googlecloud.png";
import heroku from "@/assets/images/heroku.png";
import netone from "@/assets/images/nteone.png";
import paratus from "@/assets/images/paratus.png";
import spotify from "@/assets/images/spotify.png";
import tvcabo from "@/assets/images/tvcabo.png";
import unitel from "@/assets/images/unitel.png";
import vercel from "@/assets/images/vercel.png";
import zap from "@/assets/images/zap.png";
import ButtonService from "../buttons/buttonService";

export default function PayServices() {
	useEffect(() => {
		const btns = document.querySelectorAll(
			".btnService",
		) as NodeListOf<HTMLLIElement>;

		function setActive(btn: HTMLLIElement) {
			// biome-ignore lint/complexity/noForEach: <explanation>
			btns.forEach((btn) => {
				btn.dataset.active = "false";
			});
			btn.dataset.active = "true";
		}

		// biome-ignore lint/complexity/noForEach: <explanation>
		btns.forEach((btn) => {
			btn.addEventListener("click", () => {
				setActive(btn);
			});
		});
	}, []);

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
						<ButtonService image={ende} serviceName="ENDE" />
						<ButtonService image={zap} serviceName="Zap TV" />
						<ButtonService image={unitel} serviceName="Unitel, S.A" />
						<ButtonService image={africell} serviceName="Africell Ltd" />
						<ButtonService image={tvcabo} serviceName="Tv Cabo" />
						<ButtonService image={netone} serviceName="Net One" />
						<ButtonService image={paratus} serviceName="Paratus" />
						<ButtonService image={dstv} serviceName="DsTV" />
						<ButtonService image={vercel} serviceName="Vercel" />
						<ButtonService image={spotify} serviceName="Spotify" />
						<ButtonService image={dezzer} serviceName="Dezzer" />
						<ButtonService image={googlecloud} serviceName="Google Cloud" />
						<ButtonService image={aws} serviceName="Amazon Web Services" />
						<ButtonService image={heroku} serviceName="Heroku" />
					</ul>
				</div>
				<div className="right" />
			</div>
		</div>
	);
}
