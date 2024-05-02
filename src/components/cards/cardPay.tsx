import api from "@/services/api";
import { Dispatch, SetStateAction } from "react";
import { BiMoneyWithdraw } from "react-icons/bi";
import { MdAccountBalanceWallet } from "react-icons/md";
import { toast } from "sonner";


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
    setTransactionData: Dispatch<SetStateAction<IQuery>>,
    id: number,
    accountFrom: string
  }

export default function CardPay(props: IProps) {


  async function getUpmoneyData() {
    const response = await api.get(`/getTransaction/${props.id}`)
    const data = response.data
    props.setTransactionData({status: false, client: {name: [""], birthDate: new Date(Date.now()), gender: ""}, transaction: {accountFrom: "", emissor_description: "",accountTo: "", balance: "", date: "", id: 0, receptor_description: "", status: "", transfer_description: "", transfer_type: {name: "", type_id: 0}}})
    props.setTransactionData(data)
    props.onClick()
  }

  return (
    <button type="button" className="cardDashboardTransaction" style={{border: "none", borderBottom: "1px solid #efefef", borderRadius: "0px"}} onClick={getUpmoneyData}>
      <div className="iconContainer" style={{backgroundColor: "#D1F4E0", borderRadius: "7px"}}>
      <MdAccountBalanceWallet style={{fill: "#16A353", width: "20px", height: "20px"}}/>
      </div>
      <p style={{fontWeight: "600"}}>{props.date}</p>
      <p>{props.balance}</p>
    </button>
  )
}