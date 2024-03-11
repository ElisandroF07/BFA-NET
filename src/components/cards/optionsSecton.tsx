import useUserStore from "@/contexts/stores/userStore";
import { Dispatch, SetStateAction } from "react";
import { CiViewTimeline, CiCreditCard2, CiWallet, CiVirus } from "react-icons/ci";

export default function OptionsSection(){

  const store = useUserStore()

  return (
    <div className="optionsContainer">
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
      <div onClick={()=>{store.updateValidation("manageInfo")}}>
        <CiViewTimeline />
        <p>Gerir Informações</p>
      </div>
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
      <div onClick={()=>{store.updateValidation("cards")}}>
        <CiCreditCard2/>
        <p>Cartões</p>
      </div>
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
      <div onClick={()=>{store.updateValidation("actives")}}>
        <CiWallet />
        <p>Ativos</p>
      </div>
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
      <div onClick={()=>{store.updateValidation("security")}}>
        <CiVirus />
        <p>Segurança</p>
      </div>
    </div>
  )
}