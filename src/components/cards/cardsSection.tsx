import useUserStore from "@/contexts/stores/userStore";
import { FaAngleLeft } from "react-icons/fa6";
import bfacard from '../../../public/assets/images/bfacard.svg'
import Image from "next/image";

export default function CardsSection(){

  const store = useUserStore()
  return (
    <div className="cards manageInfoContainer">
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
    <div className="top" onClick={()=>{store.updateValidation("options")}}><button type="button"><FaAngleLeft/></button><p>Cartões</p></div>
      <div className="cards bottom">
      <div className="left">
         <div className="input_field">
            <label htmlFor="email">Apelido do cartão</label>
            <input
              type="text"
              placeholder="Dê um nome ao cartão"
              value="Débito 1"
              disabled
            />
          </div>
          <div>
            <h1>Número da conta</h1>
            <p>545334534.3453.34</p>
          </div>
          <div>
            <h1>Número da conta</h1>
            <p>545334534.3453.34</p>
          </div>
          <div>
            <h1>Número da conta</h1>
            <p>545334534.3453.34</p>
          </div>
          <div>
            <h1>Número da conta</h1>
            <p>545334534.3453.34</p>
          </div>
        <div>
          <h1>Número da conta</h1>
          <p>545334534.3453.34</p>
        </div>
      </div>
      <div className="right">
        <Image src={bfacard} alt="bfa" />
      </div>
      </div>
    </div>
  )
}