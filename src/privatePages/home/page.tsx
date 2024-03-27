"use client"

import useSWR from 'swr';
import api from "@/services/api";
import { useEffect, useState } from "react";
import "@/styles/dashboard.css"
import { CiBellOn, CiGps, CiInboxIn, CiInboxOut, CiMoneyCheck1, CiReceipt, CiSquarePlus, CiWallet } from "react-icons/ci";
import { toast } from "sonner";
import CardExchange from '@/components/cards/cardExchange';
import CardFriend from '@/components/cards/cardFriend';
import CardDashboardTransaction from '@/components/cards/cardDashboardTransaction';
import axios from 'axios';

interface IProps {
	biNumber: string,
	titular: string,
	picture: string,
	exchanges: []
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


export default function Dashboard({biNumber, titular,picture, exchanges}: IProps) {

	const [account, setAccount] = useState<IAccount | null>(null);
	const [card, setCard] = useState<ICard | null>(null);
	const [exchangeRates, setExchangeRates] = useState(exchanges)
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

	function convertDate(timestamp: number) {
    const data = new Date(timestamp);
    data.setFullYear(data.getFullYear() + 2);
    const mes = (`0${data.getMonth() + 1}`).slice(-2);
    const ano = data.getFullYear();
    return `${mes} / ${ano}`;
  }

	return (
		<div className="dashboard_container">
			<div className="dashboard_top">
				<div>
					<h1>Dashboard</h1>
					<p>Gerencie o seu dinheiro facilemente no sua plataforma de Internet Banking</p>
				</div>
				<div className='last'>
					<button type='button'>
						<CiBellOn className="icon" />
					</button>
					<div className="layoutProfile" style={{backgroundImage: `url(${picture})`}}/>
				</div>
			</div>
			<div className="dashboard_middle">
				<div className="balanceContainer">
					<div className="balance">
					  <h1>Saldo contabilístico</h1>
						<p>
						{account?.available_balance},00 Kz
            </p>
					</div>
					<div className="balance">
					<h1>Saldo autorizado</h1>
						<p>
              {account?.authorized_balance},00 Kz
            </p>
					</div>
					<div className="balance">
					<h1>Saldo por levantar</h1>
						<p>
              {account?.available_balance},00 Kz
            </p>
					</div>
				</div>
				<div className="exchanges_container">
					<h1 className="title">Taxas de câmbio</h1>
					<div className="exchanges">
					{exchanges.map((_item, index)=>{
							if (_item.codigoMoeda === "USD") {
								return (
									<CardExchange key={"USD"} currency={"Dólar Americano"} subtitle={`${_item.codigoMoeda} - AOA`} price={_item.taxa.toString()} backgroundColor='linear-gradient(-134deg, #ff5000 0, #6d3901 100%)'/>
								)
							}
							if (_item.codigoMoeda === "EUR") {
								return (
									<CardExchange key={"EUR"} currency={"Euro"} subtitle={`${_item.codigoMoeda} - AOA`} price={_item.taxa.toString()} backgroundColor='linear-gradient(-134deg, rgb(0 143 251) 0, #003d6d 100%)'/>
								)
							}
							if (_item.codigoMoeda === "CNY") {
								return (
									<CardExchange key={"CNY"} currency={"Yuhan"} subtitle={`${_item.codigoMoeda} - AOA`} price={_item.taxa.toString()} backgroundColor='linear-gradient(-134deg, rgb(0 143 251) 0, #003d6d 100%)'/>
								)
							}
							if (_item.codigoMoeda === "ZAR") {
								return (
									<CardExchange key={"ZAR"} currency={"Rand"} subtitle={`${_item.codigoMoeda} - AOA`} price={_item.taxa.toString()} backgroundColor='linear-gradient(-134deg, rgb(0 143 251) 0, #003d6d 100%)'/>
								)
							}
							
						})}
					</div>
				</div>
				<div className="bottom">
					<div className="bottomLeft">
						<h1>Ultimas transações</h1>
						<div className="content">
							<CardDashboardTransaction balance='Kz 2000,00' date='25 Jan 2024' status={1} type='Pagamento' imageUrl="../assets/images/wallets/paypal.png"/>
							<CardDashboardTransaction balance='Kz 2000,00' date='25 Jan 2024' status={1} type='Pagamento' imageUrl="../assets/images/wallets/paypal.png"/>
							<CardDashboardTransaction balance='Kz 2000,00' date='25 Jan 2024' status={1} type='Pagamento' imageUrl="../assets/images/wallets/paypal.png"/>
							<CardDashboardTransaction balance='Kz 2000,00' date='25 Jan 2024' status={1} type='Pagamento' imageUrl="../assets/images/wallets/paypal.png"/>
							<CardDashboardTransaction balance='Kz 2000,00' date='25 Jan 2024' status={1} type='Pagamento' imageUrl="../assets/images/wallets/paypal.png"/>
							<CardDashboardTransaction balance='Kz 2000,00' date='25 Jan 2024' status={1} type='Pagamento' imageUrl="../assets/images/wallets/paypal.png"/>
							<CardDashboardTransaction balance='Kz 2000,00' date='25 Jan 2024' status={1} type='Pagamento' imageUrl="../assets/images/wallets/paypal.png"/>
							<CardDashboardTransaction balance='Kz 2000,00' date='25 Jan 2024' status={1} type='Pagamento' imageUrl="../assets/images/wallets/paypal.png"/>
							<CardDashboardTransaction balance='Kz 2000,00' date='25 Jan 2024' status={1} type='Pagamento' imageUrl="../assets/images/wallets/paypal.png"/>
						
						</div>
					</div>
					<div className="bottomRight">
						<div className='btTop'><h1>Enviar para amigos</h1><CiSquarePlus /></div>
						<div className="content">
							<CardFriend name={"Elisandro Franco"} email='elisandrofranco@gmai.com' imageUrl={picture}/>
							<CardFriend name={"Elisandro Franco"} email='elisandrofranco@gmai.com' imageUrl={picture}/>
							<CardFriend name={"Elisandro Franco"} email='elisandrofranco@gmai.com'  imageUrl={picture}/>
						</div>
					</div>
				</div>
			</div>
			<div className="dashboard_right">
				<h1 className="title">Meus cartões</h1>
        <div className="separator" />
				<div className="cardImage">
					<p>{titular}</p>
					<p>{convertDate(parseInt(card?.createdAt || ""))}</p>
					<p>{card?.cardNumber.slice(-4)}</p>
        </div>
				<div className="infoContainer" style={{marginTop: "10px"}}>
          {(
            <>
              {[
                { label: "Saldo contabilístico", value: `${account?.available_balance},00 Kz`},
                { label: "Saldo autorizado", value: `${account?.authorized_balance},00 Kz`},
                
              ].map((item, _index) => (
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
				<div className="infoContainer" style={{marginTop: "10px"}}>
          {(
            <>
              {[
                { label: "Estado", value: `${card?.state}`},
                { label: "Tipo de cartão", value: `${card?.role === 1 && "Multicaixa - Débito"}`},
								{ label: "Moeda", value: `${account?.currency}`},
                
              ].map((item, _index) => (
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
				<div className="infoContainer" style={{marginTop: "10px"}}>
          {(
            <>
              {[
                { label: "Tipo de conta", value: `${account?.role === 1 && "Conta à ordem"}`},
                { label: "Estado", value: `${account?.state}`},
								{ label: "Data de abertura", value: timestampToDateString(parseInt(account?.created_at || ""))},
                
              ].map((item, _index) => (
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