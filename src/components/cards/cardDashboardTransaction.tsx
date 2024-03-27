interface IProps {
  type: string,
  date: string,
  balance: string,
  status: number,
  imageUrl: string
}

export default function CardDashboardTransaction(props: IProps) {
  return (
    <button type="button" className="cardDashboardTransaction">
      <div><div className="imageContainer" style={{backgroundImage: `url(${props.imageUrl})`}}/></div>
      <p>{props.type}</p>
      <p>{props.date}</p>
      <p>{props.balance}</p>
      <p>
        {props.status === 1 && "Finalizado"}
        {props.status === 2 && "Cancelado"}
        {props.status === 3 && "Pendente"}
      </p>
    </button>
  )
}