"use client"

import useSWR from 'swr';
import api from "@/services/api";
import { useEffect, useState } from "react";
import "@/styles/dashboard.css"
import CardService from "@/components/cards/cardService";
import { CiGps, CiInboxIn, CiInboxOut, CiMoneyCheck1, CiReceipt, CiWallet } from "react-icons/ci";
import { toast } from "sonner";
import MovimentationsChart from '@/components/charts/movimentationsChart';
import MovimentationCard from '@/components/cards/movimentationCard';
import { GoCheckCircleFill } from "react-icons/go";
import { IoIosCloseCircle } from "react-icons/io";
import { FaDollarSign } from 'react-icons/fa6';
import CardExchange from '@/components/cards/cardExchange';

interface IProps {
	biNumber: string,
	titular: string
}

interface IAccount {
  iban: string;
  nbi: string;
  role: number;
  number: string;
  authorized_balance: number;
  bic: string;
  available_balance: number;
  created_at: string;
  currency: string;
  state: string;
}

interface ICard {
  cardNumber: string;
  pin: string;
  createdAt: string;
  role: number;
  nickname: string;
	state: string
}

export default function Dashboard({biNumber, titular}: IProps) {

	const [account, setAccount] = useState<IAccount | null>(null);
	const [card, setCard] = useState<ICard | null>(null);
	const fetcher = (url: string) => api.get(url).then(res => res.data);

	const { data: accountData, error: accountError } = useSWR(`/getAccountData/${biNumber}`, fetcher);
	const { data: cardData, error: cardError } = useSWR(`/getCardData/${biNumber}`, fetcher);

	useEffect(() => {
		if (accountData) {
			setAccount(accountData.account);
		}
		if (cardData) {
			setCard(cardData.card);
		}
		if (accountError) {
			toast.error("Não foi possível carregar os dados da sua conta!", { description: "Verifique a sua conexão com a internet." });
		}
		if (cardError) {
			setCard(null);
		}
	}, [accountData, cardData, accountError, cardError]);

	function timestampToDateString(timestamp: number): string {
		const date = new Date(timestamp);
		const day = date.getDate().toString().padStart(2, '0'); // Obtém o dia do mês e completa com zero à esquerda se necessário
		const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Obtém o mês (0-indexed) e completa com zero à esquerda se necessário
		const year = date.getFullYear(); // Obtém o ano
	
		return `${day}-${month}-${year}`;
	}

	return (
		<div className="dashboard_container">
			<div className="dashboard_top">
				<h1>Olá {titular}, é um prazer ter você aqui</h1>
				<p>Este é o resumo da sua conta.</p>
			</div>
			<div className="dashboard_middle">
				<div className="exchanges_container">
					<h1 className="title">Taxas de câmbio</h1>
					<div className="exchanges">
						<CardExchange currency='Dollar' subtitle='USD - AOA' price='904'>
							<FaDollarSign/>
						</CardExchange>
						<CardExchange currency='Dollar' subtitle='USD - AOA' price='904'>
							<FaDollarSign/>
						</CardExchange>
						<CardExchange currency='Dollar' subtitle='USD - AOA' price='904'>
							<FaDollarSign/>
						</CardExchange>
						<CardExchange currency='Dollar' subtitle='USD - AOA' price='904'>
							<FaDollarSign/>
						</CardExchange>
					</div>
				</div>
				<div className="movimentations">
					<div className="movimentations_left">
						<h1 className="title">Últimas movimentações</h1>
						<div className='movimentations_container'>
							<MovimentationCard tittle='Pagamento' text='por referência ref.0234128' date='24-02-2024'>
								<GoCheckCircleFill fill='rgb(19, 180, 59)'/>
							</MovimentationCard>
							<MovimentationCard tittle='Pagamento' text='por referência ref.0234128' date='24-02-2024'>
								<GoCheckCircleFill fill='rgb(19, 180, 59)'/>
							</MovimentationCard>
							<MovimentationCard tittle='Levantamento' text='sem cartão ref.92847' date='12-01-2024'>
								<IoIosCloseCircle fill='rgb(217 52 15)'/>
							</MovimentationCard>
							<MovimentationCard tittle='Pagamento' text='por referência ref.0234128' date='24-02-2024'>
								<GoCheckCircleFill fill='rgb(19, 180, 59)'/>
							</MovimentationCard>
							<MovimentationCard tittle='Pagamento' text='por referência ref.0234128' date='24-02-2024'>
								<GoCheckCircleFill fill='rgb(19, 180, 59)'/>
							</MovimentationCard>
							<MovimentationCard tittle='Levantamento' text='sem cartão ref.92847' date='12-01-2024'>
								<IoIosCloseCircle fill='rgb(217 52 15)'/>
							</MovimentationCard>
							<MovimentationCard tittle='Pagamento' text='por referência ref.0234128' date='24-02-2024'>
								<GoCheckCircleFill fill='rgb(19, 180, 59)'/>
							</MovimentationCard>
							<MovimentationCard tittle='Levantamento' text='sem cartão ref.92847' date='12-01-2024'>
								<IoIosCloseCircle fill='rgb(217 52 15)'/>
							</MovimentationCard>
							<MovimentationCard tittle='Pagamento' text='por referência ref.0234128' date='24-02-2024'>
								<GoCheckCircleFill fill='rgb(19, 180, 59)'/>
							</MovimentationCard>
						</div>
					</div>
					<div className="movimentations_right">
						<h1 className="title">Mêses mais movimentados</h1>
						<div>
							<MovimentationsChart/>
						</div>
					</div>
				</div>
				<div className="principal_services">
					<h1 className="title">Acesso rápido aos principais serviços</h1>
					<div className="services_container">
						<CardService label="Consulta de IBAN"><CiMoneyCheck1/></CardService>
						<CardService label="Encontrar agências"><CiGps /></CardService>
						<CardService label="Levantamentos"><CiInboxIn/></CardService>
						<CardService label="Consulta de saldo"><CiReceipt/></CardService>
						<CardService label="Pagamentos"><CiInboxOut/></CardService>
						<CardService label="Carregamentos"><CiWallet/></CardService>
					</div>
				</div>
			</div>
			<div className="dashboard_right">
				<h1 className="title">Meus cartões</h1>
        <div className="separator" />
				<div className="cardImage">
					<p>Elisandro Franco</p>
					<p>26 / 25</p>
					<p>1267</p>
        </div>
				<div className="infoContainer" style={{marginTop: "20px"}}>
          {(
            <>
              {[
                { label: "Saldo contabilístico", value: `${account?.available_balance},00 Kz`},
                { label: "Saldo autorizado", value: `${account?.authorized_balance},00 Kz`},
                
              ].map((item, index) => (
                <div key={item.label}>
                  <h1>{item.label}</h1>
                  <p>{item.value}</p>
                </div>
              ))}
            </>
          )}
        </div>
				<div className="separator"/>
				<h1 className="title">Informações do cartão</h1>
				<div className="infoContainer" style={{marginTop: "20px"}}>
          {(
            <>
              {[
                { label: "Estado", value: `${card?.state}`},
                { label: "Tipo de cartão", value: `${card?.role === 1 && "Multicaixa - Débito"}`},
								{ label: "Moeda", value: `${account?.currency}`},
                
              ].map((item, index) => (
                <div key={item.label}>
                  <h1>{item.label}</h1>
                  <p>{item.value}</p>
                </div>
              ))}
            </>
          )}
        </div>
				<div className="separator"/>
				<h1 className="title">Informações da conta</h1>
				<div className="infoContainer" style={{marginTop: "20px"}}>
          {(
            <>
              {[
                { label: "Tipo de conta", value: `${account?.role === 1 && "Conta à ordem"}`},
                { label: "Estado", value: `${account?.state}`},
								{ label: "Data de abertura", value: timestampToDateString(parseInt(account?.created_at || ""))},
                
              ].map((item, index) => (
                <div key={item.label}>
                  <h1>{item.label}</h1>
                  <p>{item.value}</p>
                </div>
              ))}
            </>
          )}
        </div>
			</div>
		</div>
	);
}