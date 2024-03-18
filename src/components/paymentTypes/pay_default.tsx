import Image from "next/image";
import svg from "@/assets/images/Select-amico.svg";

export default function PayDefault() {
	return (
		<div className="w-full h-full flex items-center justify-center flex-col">
			<Image src={svg} alt={"image"} className="w-[410px] h-[65%]" />
			<h1 className="text-[1.3rem] text-[var(--color-text)]">
				Selecione o tipo de pagamento
			</h1>
		</div>
	);
}
