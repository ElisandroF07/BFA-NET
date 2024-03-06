import { CiViewTimeline, CiCreditCard2, CiWallet, CiVirus } from "react-icons/ci";

export default function OptionsSection(){
  return (
    <div className="optionsContainer">
      <div>
        <CiViewTimeline />
        <p>Gerir Informações</p>
      </div>
      <div>
        <CiCreditCard2/>
        <p>Cartões</p>
      </div>
      <div>
        <CiWallet />
        <p>Ativos</p>
      </div>
      <div>
        <CiVirus />
        <p>Segurança</p>
      </div>
    </div>
  )
}