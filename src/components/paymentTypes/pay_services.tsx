"use client"

import "@/styles/pay-types.css";
import { CiSearch } from "react-icons/ci"
import zap from '../../../public/assets/images/zap.png'
import tvcabo from '../../../public/assets/images/tvcabo.png'
import netone from '../../../public/assets/images/nteone.png'
import africell from '../../../public/assets/images/africell.png'
import unitel from '../../../public/assets/images/unitel.png'
import ende from '../../../public/assets/images/ende.png'
import aws from '../../../public/assets/images/aws.png'
import paratus from '../../../public/assets/images/paratus.png'
import heroku from '../../../public/assets/images/heroku.png'
import googlecloud from '../../../public/assets/images/googlecloud.png'
import dezzer from '../../../public/assets/images/dezzer.png'
import spotify from '../../../public/assets/images/spotify.png'
import vercel from '../../../public/assets/images/vercel.png'
import dstv from '../../../public/assets/images/dstv.png'
import ButtonService from "../buttons/buttonService";
import { useEffect } from "react";

export default function PayServices() {

	useEffect(()=>{
		const btns = document.querySelectorAll('.btnService') as NodeListOf<HTMLLIElement>
	
		function setActive(btn: HTMLLIElement){
			// biome-ignore lint/complexity/noForEach: <explanation>
			btns.forEach((btn)=>{
				btn.dataset.active = "false"
			})
			btn.dataset.active = "true"
		}
	
		// biome-ignore lint/complexity/noForEach: <explanation>
		btns.forEach((btn)=>{
			btn.addEventListener("click", ()=>{
				setActive(btn)
			})
		})
	}, [])

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
