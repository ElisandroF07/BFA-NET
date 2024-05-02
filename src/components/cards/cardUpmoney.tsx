import api from "@/services/api";
import { Dispatch, SetStateAction } from "react";
import { BiMoneyWithdraw } from "react-icons/bi";
import { toast } from "sonner";


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

interface IUpmoneys {
  accountFrom: string,
  balance: number,
  date: string,
  id: number,
  number: string,
  status: number,
  transferId: number
  transfers: ITransactions
}

interface IProps {
  balance: string;
  date: string;
  status: number;
  id: number;
  setUpData: Dispatch<SetStateAction<IUpmoneys>>,
  onOpen: ()=>void 
}

export default function CardUpmoney(props: IProps) {

  async function getUpmoneyData() {
    try {
      const response = await api.get(`/getUpmoney/${props.id}`)
      props.setUpData(response.data.upmoney)
      props.onOpen()
    }
    catch {
      toast.error("Sem conexão com o servidor!")
    }
  }

  return (
    <button type="button" className="cardDashboardTransaction" style={{border: "none", borderBottom: "1px solid #efefef", borderRadius: "0px"}} onClick={getUpmoneyData}>
      <div className="iconContainer" style={{backgroundColor: props.status === 1 ? "#dfe8f4" : props.status === 2 ? "rgb(56 219 0 / 19%)" : "rgb(219 0 0 / 10%)", borderRadius: "7px"}}>
      <BiMoneyWithdraw style={{fill: props.status === 1 ? "#0795ff" : props.status === 2 ? "#01af23" : "#ff6565" , width: "20px", height: "20px"}}/>
      </div>
      <p style={{fontWeight: "600"}}>{props.balance}</p>
      <p>{props.date}</p>
    </button>
  )
}