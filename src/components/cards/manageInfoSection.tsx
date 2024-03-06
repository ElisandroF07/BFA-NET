import { Dispatch, SetStateAction } from "react";
import { FaAngleLeft } from "react-icons/fa6";

export default function ManageInfoSection({setComponent}:{setComponent: Dispatch<SetStateAction<string>>}){

  function setState(){
    setComponent("options")
  }

  return (
    <div className="manageInfoContainer">
      <div className="top" onKeyDown={setState}><button type="button"><FaAngleLeft/></button><p>Gerir informações</p></div>
      <div className="bottom">
      <div className="input_field">
        <label htmlFor="email">Nome Completo</label>
        <input
          type="text"
          placeholder="Insira o seu nome completo"
          value="Elisandro Canjeque da Paixão Franco"
          disabled
        />
			</div>
      <div className="input_field">
        <label htmlFor="email">Data de Nascimento</label>
        <input
          type="date"
          disabled
        />
			</div>
      <div className="input_field">
        <label htmlFor="email">Telefone</label>
        <input
          type="date"
          placeholder="Insira o seu nome completo"
          value="Elisandro Canjeque da Paixão Franco"
          disabled
        />
			</div>
      <div className="input_field">
        <label htmlFor="email">Email</label>
        <input
          type="text"
          placeholder="Insira o seu endereço de email"
          value="Elisandrofranco@g2devs.com"
          disabled
        />
			</div>

      </div>
      <div className="btnContainer">
        <button type="button">Confirmar</button>
      </div>
    </div>
  )
}