interface IProps {
  currency: string,
  subtitle: string,
  price: string,
  backgroundColor: string,
  color?: string,
  border?: string,
  boxShadow?: string
}

export default function CardExchange({currency, subtitle, price, backgroundColor, color, border, boxShadow}: IProps) {
  return (
    <div className="exchange" style={{background: backgroundColor, color: color, border: border, boxShadow: boxShadow}}>
      <div className="exchangeText">
        <h1 style={{color: color}}>{currency}</h1>
        <p style={{color: color}}>{subtitle}</p>
        <p style={{color: color}}>{price},00 Kz</p>
      </div>
    </div>
  )
}