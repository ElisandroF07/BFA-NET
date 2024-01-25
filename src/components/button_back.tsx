import Link from "next/link";
import { FaAngleLeft } from "react-icons/fa";

export default function Button_Back() {
    return <Link href="/auth/sign-in" className="button_back">
					<FaAngleLeft/>
			</Link>
}