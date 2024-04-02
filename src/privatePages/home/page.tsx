"use client"

import useSWR from 'swr';
import api from "@/services/api";
import { useEffect, useState } from "react";
import "@/styles/dashboard.css"
import { CiSquarePlus } from "react-icons/ci";
import { toast } from "sonner";
import CardExchange from '@/components/cards/cardExchange';
import {z} from "zod"
import {useForm} from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, User, useDisclosure } from "@nextui-org/react";
import InfoError from '@/components/others/infoError';
import { TailSpin } from 'react-loader-spinner';
import FriendList from '@/components/lists/friendList';
import TransactionList from '@/components/lists/transactionList';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import CardFriends from '@/components/lists/cardFriends';

interface IProps {
	biNumber: string,
	titular: string,
	picture: string,
	exchanges: ApiResponse,
	emailFrom: string,
	logout: ()=>void
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

interface ICurrency {
  taxa: number;
  descricaoTipoCambio: string;
  tipoCambio: string;
  data: string;
  designacaoMoeda: string;
  codigoMoeda: string;
}

interface IGenericResponse {
  genericResponse: ICurrency[];
  success: boolean;
}

interface ApiResponse {
  genericResponse: IGenericResponse[];
  success: boolean;
}

export default function Dashboard({biNumber, titular, picture, exchanges, emailFrom, logout}: IProps) {

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
					<Dropdown>
						<DropdownTrigger>
							<User
								as="button"
								avatarProps={{
									isBordered: true,
									src: picture,
								}}
								className="transition-transform"
								description={emailFrom}
								name={titular}
							/>
						</DropdownTrigger>
						<DropdownMenu aria-label="User Actions" variant="flat">
							<DropdownItem key="profile" className="h-14 gap-2">
								<p className="font-bold">Email</p>
								<p className="font-bold">{emailFrom}</p>
							</DropdownItem>
							<DropdownItem key="logout" onClick={logout} color="danger">
								Sair
							</DropdownItem>
						</DropdownMenu>
					</Dropdown>
				</div>
			</div>
			<div className="dashboard_middle">
				<div className="balanceContainer">
					<div className="balance">
					  <h1>Saldo contabilístico</h1>
						<p>
						{account?.available_balance.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA', maximumFractionDigits: 0 }) || <Skeleton borderRadius={10} height={40} width={220} />}
            </p>
					</div>
					<div className="balance">
					<h1>Saldo autorizado</h1>
						<p>
						{account?.authorized_balance.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA', maximumFractionDigits: 0 }) || <Skeleton borderRadius={10} height={40} width={220} />}
            </p>
					</div>
					<div className="balance">
					<h1>Saldo por levantar</h1>
						<p>
              {account?.available_balance.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA', maximumFractionDigits: 0 }) || <Skeleton borderRadius={10} height={40} width={220}/>}
            </p>
					</div>
				</div>
				<div className="exchanges_container">
					<h1 className="title">Taxas de câmbio</h1>
					<div className="exchanges">
					{ exchanges.genericResponse.length !== 0 ? exchanges.genericResponse.map((_item)=>{
							if (_item.genericResponse[0].codigoMoeda === "USD") {
								return (
									<CardExchange key={"USD"} currency={"Dólar Americano"} subtitle={`${_item.genericResponse[0].codigoMoeda} - AOA`} price={_item.genericResponse[0].taxa.toString()} backgroundColor='linear-gradient(-134deg, #ff5000 0, #6d3901 100%)'/> || <Skeleton borderRadius={10} height={35} width={300}/>
								)
							}
							if (_item.genericResponse[0].codigoMoeda === "EUR") {
								return (
									<CardExchange key={"EUR"} currency={"Euro"} subtitle={`${_item.genericResponse[0].codigoMoeda} - AOA`} price={_item.genericResponse[0].taxa.toString()} backgroundColor='linear-gradient(-134deg, rgb(0 143 251) 0, #003d6d 100%)'/>
								)
							}
							if (_item.genericResponse[0].codigoMoeda === "CNY") {
								return (
									<CardExchange key={"CNY"} currency={"Yuhan"} subtitle={`${_item.genericResponse[0].codigoMoeda} - AOA`} price={_item.genericResponse[0].taxa.toString()} backgroundColor='linear-gradient(-134deg, rgb(0 143 251) 0, #003d6d 100%)'/>
								)
							}
							if (_item.genericResponse[0].codigoMoeda === "ZAR") {
								return (
									<CardExchange key={"ZAR"} currency={"Rand"} subtitle={`${_item.genericResponse[0].codigoMoeda} - AOA`} price={_item.genericResponse[0].taxa.toString()} backgroundColor='linear-gradient(-134deg, rgb(0 143 251) 0, #003d6d 100%)'/>
								)
							}
							
						}) : (
							<>
							<Skeleton borderRadius={10} height={80} width={200}/>
							<Skeleton borderRadius={10} height={80} width={200}/>
							<Skeleton borderRadius={10} height={80} width={200}/>
							<Skeleton borderRadius={10} height={80} width={200}/>
							</>
						)	
						}
					</div>
				</div>
				<div className="bottom">
					<div className="bottomLeft">
						<h1>Ultimas transações</h1>
						<div className="content">
							<TransactionList accountNumber={account?.number || ""}/>
						</div>
					</div>
					<CardFriends biNumber={biNumber} number={account?.number || ""} emailFrom={emailFrom}/>
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
                { label: "Saldo contabilístico", value: `${account?.available_balance.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA', maximumFractionDigits: 0 })}`},
                { label: "Saldo autorizado", value: `${account?.authorized_balance.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA', maximumFractionDigits: 0 })}`},
                
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