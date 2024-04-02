"use client"

import api from "@/services/api";
import { Dispatch, SetStateAction, useEffect } from "react"

interface IClient {
  name: string[];
  gender: string;
  birthDate: Date;
}

interface ITransactions {
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
  id: number
}

export default function CardDashboardTransaction(props: IProps) {


  return (
    <button type="button" className="cardDashboardTransaction" onClick={async()=>{
      const response = await api.get(`/getTransaction/${props.id}`)
      const data = response.data
      props.setTransactionData(data)
      props.onClick()
    }}>
      <div><div className="imageContainer" style={{backgroundImage: `url(${props.imageUrl})`}}/></div>
      <p>
        {props.type}
      </p>
      <p>{props.date}</p>
      <p>{props.balance}</p>
    </button>
  )
}