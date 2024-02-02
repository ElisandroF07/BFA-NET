"use client"

import { useRouter } from "next/navigation";
import { FaAngleLeft } from "react-icons/fa";

export default function Button_Back() {

	const router = useRouter()

	return <button onClick={() => router.back()} className="button_back"><FaAngleLeft/></button>
}