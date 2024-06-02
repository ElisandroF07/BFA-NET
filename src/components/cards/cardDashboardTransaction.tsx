"use client"

import useAccountStore from "@/contexts/stores/accountStore";
import api from "@/services/api";
import { Dispatch, SetStateAction, useEffect } from "react"
import { BiMoneyWithdraw, BiTransfer, BiTransferAlt } from "react-icons/bi";
import { CiBarcode, CiInboxIn } from "react-icons/ci";
import { GoArrowDownLeft, GoArrowUpRight } from "react-icons/go";
import { GoArrowSwitch } from "react-icons/go";
import { MdAccountBalanceWallet, MdOutlineAccountBalanceWallet } from "react-icons/md";
import { PiFastForwardFill } from "react-icons/pi";


interface IClient {
  name: string[];
  gender: string;
  birthDate: Date;
}

interface ITransactions {
  accountFrom: string;
  accountTo: string;
  balance: string;
  date: string;
  status: string;
  transfer_type: {
		type_id: number,
		name: string
	};
  receptor_description: string;
  emissor_description: string;
  transfer_description: string;
	id: number;
}

interface IQuery { 
  status: boolean;
  transaction: ITransactions,
  client: IClient
}



interface IProps {
  type: string,
  date: string,
  balance: string,
  status: number,
  imageUrl: string,
  onClick: ()=>void,
  setTransactionData: Dispatch<SetStateAction<IQuery>>,
  id: number,
  accountFrom: string,
  typeId: number
}

export default function CardDashboardTransaction(props: IProps) {

  const useAccount = useAccountStore()

  return (
    <button type="button" className="cardDashboardTransaction" onClick={async()=>{
      
      if (useAccount.number !== props.accountFrom) {
        const response = await api.get(`/getTransactionReceptor/${props.id}`)
        const data = response.data
        props.setTransactionData({status: false, client: {name: [""], birthDate: new Date(Date.now()), gender: ""}, transaction: {accountFrom: "", emissor_description: "", accountTo: "", balance: "", date: "", id: 0, receptor_description: "", status: "", transfer_description: "", transfer_type: {name: "", type_id: 0}}})
        props.setTransactionData(data)
        props.onClick()
      }
      else {
        const response = await api.get(`/getTransaction/${props.id}`)
        const data = response.data
        props.setTransactionData({status: false, client: {name: [""], birthDate: new Date(Date.now()), gender: ""}, transaction: {accountFrom: "", emissor_description: "", accountTo: "", balance: "", date: "", id: 0, receptor_description: "", status: "", transfer_description: "", transfer_type: {name: "", type_id: 0}}})
        props.setTransactionData(data)
        props.onClick()
      } 
    }}>
      <div className="iconContainer" style={{backgroundColor: "#AF8D47"}}>
      {props.typeId === 1 ? <BiTransferAlt style={{width: "18px", height: "18px", color: "var(--color-cards)"}}/>: 
        props.typeId === 2 ? <BiTransferAlt style={{width: "18px", height: "18px", color: "var(--color-cards)"}}/> : 
        props.typeId === 5 ? <PiFastForwardFill style={{width: "18px", height: "18px", color: "var(--color-cards)"}}/> : 
        props.typeId === 6 ? <BiMoneyWithdraw style={{width: "18px", height: "18px", color: "var(--color-cards)"}}/> : 
        props.typeId === 7 ? <MdOutlineAccountBalanceWallet style={{width: "18px", height: "18px", color: "var(--color-cards)"}}/> : 
        props.typeId === 8 ? <MdOutlineAccountBalanceWallet style={{width: "18px", height: "18px", color: "var(--color-cards)"}}/> :
        props.typeId === 9 ? <CiBarcode style={{width: "18px", height: "18px", color: "var(--color-cards)"}}/> : 
        props.typeId === 10 ? <CiInboxIn style={{width: "18px", height: "18px", color: "var(--color-cards)"}}/> : null
      }
      </div>
      <p>
        {props.type}
      </p>
      <p>{props.date}</p>
      <p>{props.balance}</p>
    </button>
  )
}