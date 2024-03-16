import Image from "next/image";
import Link from "next/link";
import { CiWarning } from "react-icons/ci";
import svg from "../../../public/assets/images/503.svg";

export default function TransferInternational() {
	return (
		<div className="w-full h-full flex items-center justify-center flex-col relative">
			<Image src={svg} alt={"image"} className="w-[410px] h-[65%]" />
			<h1 className="text-[1.3rem] text-[var(--color-text)]">
				Temporariamente indisponível.
			</h1>
			<div
				className="information"
				style={{
					bottom: "30px",
					gridTemplateColumns: "30px calc(100% - 30px)",
					left: "20px",
					columnGap: "10px",
				}}
			>
				<CiWarning className="icone" />
				<p>
					A funcionalidade selecionada ficará disponível após 180 dias da
					abertura a criação da conta. Para mais infromações,{" "}
					<Link
						href={"tel:923120120"}
						className=" text-[var(--color-focus)] underline"
					>
						entre em contacto
					</Link>
					.
				</p>
			</div>
		</div>
	);
}
