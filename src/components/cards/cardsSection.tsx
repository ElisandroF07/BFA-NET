"use client";

import useUserStore from "@/contexts/stores/userStore";
import { useEffect, useState } from "react";
import { FaAngleLeft } from "react-icons/fa6";
import { MdOutlineLock, MdOutlineLockOpen } from "react-icons/md";
import api from "@/services/api";
import { toast } from "sonner";
import useSWR from "swr";
import useClientStore from "@/contexts/stores/clientStore";
import useCardStore from "@/contexts/stores/cardStore";

export default function CardsSection() {
  const [locked, setLocked] = useState(false);
  const [nk, setNk] = useState("");
  const [loading, setLoading] = useState(false);
  const store = useUserStore();
  const useClient = useClientStore()
  const useCard = useCardStore()

  function convertDate(timestamp: number) {
    const data = new Date(timestamp);
    data.setFullYear(data.getFullYear() + 2);
    const mes = (`0${data.getMonth() + 1}`).slice(-2);
    const ano = data.getFullYear();
    return `${mes} / ${ano}`;
  }

  async function updateCard() {
    try {
      setLoading(true)
      const response = await api.post("/setNickname", { cardNumber: useCard.cardNumber, nickname: nk });
      useCard.setNickname(response.data.nickname); 
      toast.success('Informações atualizadas com sucesso!');
      setLoading(false)
    } catch (error) {
      toast.error('Não foi possível atualizar o cartão. .');
      setLoading(false)
    }
  }


  return (
    <div className="cards manageInfoContainer">
      <div className="top" onMouseDown={() => { store.updateValidation("options"); }}>
        <button type="button"><FaAngleLeft /></button>
        <p>Cartões</p>
      </div>
      <div className="cardsbottom">
        <div className="left">
          <div className="input_field" style={{ margin: "0px" }}>
            <label htmlFor="email">Apelido do cartão</label>
            <input type="text" placeholder="Dê um nome ao cartão" onChange={(event) => setNk(event.target.value)} defaultValue={useCard.nickname || ""} />
          </div>
          <div className="multiText">
            <h1>Tipo de cartão</h1>
            <p>{useCard.role === 1 ? "Cartão BFA - Virtual de Débito" : ""}</p>
          </div>
          <div className="multiText">
            <h1>Número do cartão</h1>
            <p>{useCard.cardNumber}</p>
          </div>
          <div className="multiText">
            <h1>Data de validade</h1>
            <p>{convertDate(parseInt(useCard.createdAt || ""))}</p>
          </div>
          <div className="multiText">
            {locked ? (
              <button type="button" onClick={() => setLocked(false)} data-locked="true">Desbloquear <MdOutlineLockOpen /></button>
            ) : (
              <button type="button" onClick={() => setLocked(true)} data-locked="false">Bloquear <MdOutlineLock /></button>
            )}
            <button type="button" onClick={updateCard} disabled={loading || !nk}>Salvar</button>
          </div>
        </div>
        <div className="right">
          <div className="cardImage">
            <p>{`${useClient.personalData.name[0]} ${useClient.personalData.name[useClient.personalData.name.length - 1]}`}</p>
            <p>{convertDate(parseInt(useCard.createdAt || ""))}</p>
            <p>{useCard.cardNumber.slice(-4)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
