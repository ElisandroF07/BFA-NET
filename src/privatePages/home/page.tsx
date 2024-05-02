"use client"

import "@/styles/dashboard.css"
import CardExchange from '@/components/cards/cardExchange';
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, User, useDisclosure } from "@nextui-org/react";
import TransactionList from '@/components/lists/transactionList';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import CardFriends from '@/components/lists/cardFriends';
import useAccountStore from "@/contexts/stores/accountStore";
import useClientStore from "@/contexts/stores/clientStore";
import useCardStore from "@/contexts/stores/cardStore";
import { useEffect } from "react";

interface IProps {
	biNumber: string,
	exchanges: any,
	logout: ()=>void
}

interface ICurrency {
  taxa: number;
  descricaoTipoCambio: string;
  tipoCambio: string;
  data: string;
  designacaoMoeda: string;
  codigoMoeda: string;
}

interface ApiResponse {
  genericResponse: IGenericResponse[];
  success: boolean;
}

interface IGenericResponse {
  genericResponse: ICurrency[];
  success: boolean;
}



export default function Dashboard({exchanges, logout}: IProps) {

	const useAccount = useAccountStore()
	const useClient = useClientStore()
	const useCard = useCardStore()



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
					<h1 >Dashboard</h1>
					<p>Gerencie o seu dinheiro facilmente</p>
				</div>
				<div className='last'>
					<Dropdown>
						<DropdownTrigger>
							<User
								as="button"
								avatarProps={{
									isBordered: true,
									src: useClient.pictureProfile,
								}}
								className="transition-transform"
								description={useClient.email}
								name={`${useClient.personalData.name[0]} ${useClient.personalData.name[useClient.personalData.name.length - 1]}`}
							/>
						</DropdownTrigger>
						<DropdownMenu aria-label="User Actions" variant="flat">
							<DropdownItem key="profile" className="h-14 gap-2">
								<p className="font-bold">{useAccount.role === 1 ? "Particular" : "Comerciante"}</p>
								<p className="font-bold">{useAccount.number.replaceAll(".", " ")}</p>
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
						<p style={{color: "#3B3D40"}}>
						{useAccount.available_balance.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA', maximumFractionDigits: 0 }) || <Skeleton borderRadius={10} height={40} width={220} />}
            </p>
					</div>
					<div className="balance">
					<h1>Saldo autorizado</h1>
						<p style={{color: "#3B3D40"}}>
						{useAccount.authorized_balance.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA', maximumFractionDigits: 0 }) || <Skeleton borderRadius={10} height={40} width={220} />}
            </p>
					</div>
					<div className="balance">
					<h1>Saldo por levantar</h1>
						<p style={{color: "#3B3D40"}}>
              {useAccount.up_balance.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA', maximumFractionDigits: 0 }) || <Skeleton borderRadius={10} height={40} width={220}/>}
            </p>
					</div>
				</div>
				<div className="exchanges_container">
					<h1 className="title" style={{color: "#3B3D4E"}}>Taxas de câmbio</h1>
					<div className="exchanges">
					{ exchanges.genericResponse.length !== 0 ? exchanges.genericResponse.map((_item: { genericResponse: { taxa: { toString: () => string; }, codigoMoeda: { toString: () => string}; }[]; })=>{
							if (_item.genericResponse[0]?.codigoMoeda === "USD") {
								return (
									<CardExchange key={"USD"} currency={"Dólar Americano"} subtitle={`${_item.genericResponse[0].codigoMoeda} - AOA`} price={_item.genericResponse[0].taxa.toString()} backgroundColor='linear-gradient(-134deg, #ff5000 0, #6d3901 100%)'/> || <Skeleton borderRadius={10} height={35} width={300}/>
								)
							}
							if (_item.genericResponse[0]?.codigoMoeda === "EUR") {
								return (
									<CardExchange key={"EUR"} currency={"Euro"} subtitle={`${_item.genericResponse[0].codigoMoeda} - AOA`} price={_item.genericResponse[0].taxa.toString()} backgroundColor='linear-gradient(-134deg, rgb(0 143 251) 0, #003d6d 100%)'/>
								)
							}
							if (_item.genericResponse[0]?.codigoMoeda === "CNY") {
								return (
									<CardExchange key={"CNY"} currency={"Yuhan"} subtitle={`${_item.genericResponse[0].codigoMoeda} - AOA`} price={_item.genericResponse[0].taxa.toString()} backgroundColor='linear-gradient(-134deg, rgb(0 143 251) 0, #003d6d 100%)'/>
								)
							}
							if (_item.genericResponse[0]?.codigoMoeda === "ZAR") {
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
						<h1 style={{color: "#3B3D4E"}}>Ultimas transações</h1>
						<div className="content">
							<TransactionList accountNumber={useAccount.number || ""}/>
						</div>
					</div>
					<CardFriends biNumber={useClient.biNumber} number={useAccount.number || ""} emailFrom={useClient.email}/>
			</div>
			
			</div>
			<div className="dashboard_right">
				<h1 className="title" style={{color: "#3B3D4E"}}>Meus cartões</h1>
        <div className="separator" />
				<div className="cardImage">
					<p>{`${useClient.personalData.name[0]} ${useClient.personalData.name[useClient.personalData.name.length - 1]}`}</p>
					<p>{convertDate(parseInt(useCard.createdAt || ""))}</p>
					<p>{useCard.cardNumber.slice(-4)}</p>
        </div>
				<div className="infoContainer" style={{marginTop: "10px"}}>
          {(
            <>
              {[
                { label: "Saldo contabilístico", value: `${useAccount.available_balance.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA', maximumFractionDigits: 0 })}`},
                { label: "Saldo autorizado", value: `${useAccount.authorized_balance.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA', maximumFractionDigits: 0 })}`},
                
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
				<h1 className="title" style={{color: "#3B3D4E"}}>Informações do cartão</h1>
				<div className="infoContainer" style={{marginTop: "10px"}}>
          {(
            <>
              {[
                { label: "Estado", value: `${useCard.state}`},
                { label: "Tipo de cartão", value: `${useCard.role === 1 && "Virtual - Débito"}`},
				{ label: "Moeda", value: `${useAccount.currency}`},
                
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
				<h1 className="title" style={{color: "#3B3D4E"}}>Informações da conta</h1>
				<div className="infoContainer" style={{marginTop: "10px"}}>
          {(
            <>
              {[
                { label: "Tipo de conta", value: `${useAccount.role === 1 ? "Conta à Ordem" : "Conta Simplificada"}`},
                { label: "Estado", value: `${useAccount.state}`},
				{ label: "Data de abertura", value: timestampToDateString(parseInt(useAccount.created_at || ""))},
                
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