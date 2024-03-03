"use client";

import { FaArrowRight } from "react-icons/fa";

export default function ButtonNext({ id }: { id: string }) {
	return (
		<button type="submit" className="button_next" id={id}>
			<p>Avançar</p>
			<FaArrowRight />
		</button>
	);
}
