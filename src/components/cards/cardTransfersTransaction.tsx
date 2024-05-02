"use client"

import useAccountStore from "@/contexts/stores/accountStore";
import api from "@/services/api";
import { Dispatch, SetStateAction, useEffect } from "react"
import { GoArrowDownLeft, GoArrowUpRight } from "react-icons/go";


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
  transfer_description: string;
  emissor_description: string;
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
  setTransactionDat: Dispatch<SetStateAction<IQuery>>,
  id: number,
  accountFrom: string
}

export default function CardDashboardTransaction(props: IProps) {

  const useAccount = useAccountStore()

  return (
    <button type="button" className="cardTransfersTransaction" onClick={async()=>{
      if (useAccount.nbi !== props.accountFrom) {
        const response = await api.get(`/getTransactionReceptor/${props.id}`)
        const data = response.data
        props.setTransactionDat({status: false, client: {name: [""], birthDate: new Date(Date.now()), gender: ""}, transaction: {accountFrom: "", emissor_description: "", accountTo: "", balance: "", date: "", id: 0, receptor_description: "", status: "", transfer_description: "", transfer_type: {name: "", type_id: 0}}})
        props.setTransactionDat(data)
        props.onClick()
      }
      else {
        const response = await api.get(`/getTransaction/${props.id}`)
        const data = response.data
        props.setTransactionDat({status: false, client: {name: [""], birthDate: new Date(Date.now()), gender: ""}, transaction: {accountFrom: "",emissor_description: "", accountTo: "", balance: "", date: "", id: 0, receptor_description: "", status: "", transfer_description: "", transfer_type: {name: "", type_id: 0}}})
        props.setTransactionDat(data)
        props.onClick()
      } 
    }}>
      <div className="iconContainer" style={{backgroundColor: useAccount.nbi === props.accountFrom ? "#ff121214" : "rgb(22 207 0 / 12%)"}}>
      {useAccount.nbi === props.accountFrom ? <GoArrowUpRight style={{fill: "#e30000"}}/> : <GoArrowDownLeft style={{fill: "#0a6600"}}/>}
      </div>
      <p>
        {parseInt(props.balance).toLocaleString('pt-AO', { style: 'currency', currency: 'AOA', maximumFractionDigits: 0 })}
      </p>
      <p>{props.date}</p>
    </button>
  )
}