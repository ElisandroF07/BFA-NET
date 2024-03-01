import Image, { StaticImageData } from "next/image"

export default function ButtonService({image, serviceName}:{image: StaticImageData, serviceName: string}) {
    return (
        <li className="flex gap-4 items-center justify-start rounded-[7px] bg-[var(--color-cards)] w-full h-[50px] px-[5px] my-[10px]">
            <Image src={image} alt='image_service' className="w-[40px] h-[40px] rounded-[7px]"/>
            <p>{serviceName}</p>
        </li>
    )
}