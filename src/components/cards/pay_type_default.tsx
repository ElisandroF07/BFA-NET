import Image from "next/image"
import svg from '../../../public/assets/images/Select-amico.svg'

export default function Pay_type_default() {
    return (
        <div className="w-full h-full flex items-center justify-center flex-col">
            <Image src={svg} alt={'image'} className="w-[410px] h-[80%]"/>
            <h1 className="font-[14px] text-[var(--color-text)]">Selecione o tipo de pagamento</h1>
        </div>
    )
}