import api from "@/services/api";
import { Dispatch, SetStateAction } from "react";
import { BiMoneyWithdraw } from "react-icons/bi";
import { CiBarcode } from "react-icons/ci";
import { MdAccountBalanceWallet } from "react-icons/md";
import { toast } from "sonner";

  interface IReferences {
    id: number,
    reference: string,
    description: string,
    balance: number,
    date: string,
    state: number,
    entity: string,
    payer_description: string,
    payer_nbi: string,
    emissor_description: string
  }

  interface IProps {
    date: string,
    balance: string,
    status: number,
    onClick: ()=>void,
    setReferenceData: Dispatch<SetStateAction<IReferences>>,
    id: number,
  }

export default function CardReference(props: IProps) {


  async function getReferenceData() {
    const response = await api.get(`/getReference/${props.id}`)
    props.setReferenceData({balance: 0, payer_description: "", emissor_description: "", payer_nbi: "", date: "", description: "", entity: "", id: 0, reference: "", state: 0})
    props.setReferenceData(response.data.reference)
    props.onClick()
  }

  return (
    <button type="button" className="cardDashboardTransaction" style={{border: "none", borderBottom: "1px solid #efefef", borderRadius: "0px"}} onClick={getReferenceData}>
      <div className="iconContainer" style={{backgroundColor: props.status === 1 ? "#8484841c" : props.status === 2 ? "#D1F4E0" : "#01893c1c", borderRadius: "7px"}}>
      <CiBarcode style={{fill: props.status === 1 ? "#828282" : props.status === 2 ? "#16A353" : "#01893c", width: "26px", height: "26px"}}/>
      </div>
      <p style={{fontWeight: "600"}}>{props.date}</p>
      <p>{props.balance}</p>
    </button>
  )
}