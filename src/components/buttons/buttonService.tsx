"use client"

import Image, { StaticImageData } from "next/image";
import { Dispatch, SetStateAction, useEffect } from "react";


export default function ButtonService({
	image,
	serviceName,
	setWallet
}: { image: StaticImageData; serviceName: string, setWallet?: Dispatch<SetStateAction<string>> }) {



	return (
		// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
	<li data-active="false" onClick={()=>{
			if(setWallet) {
				setWallet(serviceName)
			}
		}} className="btnService flex gap-4 items-center justify-start rounded-[7px] bg-[var(--color-cards)] w-full h-[70px] px-[10px] " style={{minHeight: "70px", transition: ".3s"}}>
			<Image
				src={image}
				alt="image_service"
				style={{width: "52px", height: "52px", borderRadius: "5px"}}
			/>
			<p style={{transition: ".3s"}}>{serviceName}</p>
		</li>
	);
}
