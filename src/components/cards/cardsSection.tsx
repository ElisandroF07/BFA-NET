"use client";

import useUserStore from "@/contexts/stores/userStore";
import { useEffect, useState } from "react";
import { BiHide, BiShow } from "react-icons/bi";
import { FaAngleLeft } from "react-icons/fa6";
import { MdOutlineLock, MdOutlineLockOpen } from "react-icons/md";
import api from "@/services/api";
import { toast } from "sonner";
import useSWR from "swr";

interface ICard {
  cardNumber: string;
  pin: string;
  createdAt: string;
  role: number;
  nickname: string;
}

export default function CardsSection({ biNumber, titular }: { biNumber: string; titular: string }) {
  const [card, setCard] = useState<ICard | null>(null);
  const [locked, setLocked] = useState(false);
  const [nk, setNk] = useState("");
  const [loading, setLoading] = useState(false);
  const store = useUserStore();

  function convertDate(timestamp: number) {
    const data = new Date(timestamp);
    data.setFullYear(data.getFullYear() + 2);
    const mes = (`0${data.getMonth() + 1}`).slice(-2);
    const ano = data.getFullYear();
    return `${mes} / ${ano}`;
  }

  const fetcher = (url: string) => api.get(url).then(res => res.data);
	const { data: cardData, error: cardError, mutate: mutateCard } = useSWR(`/getCardData/${biNumber}`, fetcher);

	useEffect(() => {
		if (cardData) {
			setCard(cardData.card);
		}
		if (cardError) {
			toast.error("Não foi possível carregar os dados do seu cartão!", { description: "Verifique a sua conexão com a internet." });
		}
	}, [cardData, cardError]);

  async function updateCard() {
    try {
      setLoading(true)
      const response = await api.post("/setNickname", { cardNumber: card?.cardNumber, nickname: nk });
      mutateCard(response.data, false); 
      toast.success('Informações atualizadas com sucesso!');
      setLoading(false)
    } catch (error) {
      toast.error('Não foi possível atualizar o cartão. Por favor, tente novamente mais tarde.');
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
            <input type="text" placeholder="Dê um nome ao cartão" onChange={(event) => setNk(event.target.value)} defaultValue={card?.nickname || ""} />
          </div>
          <div className="multiText">
            <h1>Tipo de cartão</h1>
            <p>{card?.role === 1 ? "Cartão Multicaixa de Débito" : "Teste"}</p>
          </div>
          <div className="multiText">
            <h1>Número do cartão</h1>
            <p>{card?.cardNumber}</p>
          </div>
          <div className="multiText">
            <h1>Data de validade</h1>
            <p>{convertDate(parseInt(card?.createdAt || ""))}</p>
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
            <p>{titular}</p>
            <p>{convertDate(parseInt(card?.createdAt || ""))}</p>
            <p>{card?.cardNumber.slice(-4)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
