"use client"

import { FaArrowRight } from "react-icons/fa";

export default function Button_Next({id}:{id: string}) {
    return <button type="submit" className="button_next" id={id}><p>Avançar</p><FaArrowRight/></button>;
}
