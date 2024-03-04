import Image from "next/image";
import business from "../../../../public/assets/images/Construction hat-pana.svg";

export default function Dashboard() {
	return (
		<div className="w-full h-full flex flex-col items-center justify-center">
			<Image src={business} alt="business" className="w-[400px] h-[400px]" />
			<h1 className="text-[28px] font-semibold text-[var(--color-text)]">
				Seja bem vindo Professor
			</h1>
			<p>
				Como o professor pode averiguar, estamos em processo de desenvolvimento
			</p>
		</div>
	);
}
