import Link from "next/link";
import '@/styles/globals.css'

export default function Home() {

	return (
		<Link href='/auth/sign-in' className="button_home" id='not_found'><p>Ir para login</p></Link>  
	)
}
