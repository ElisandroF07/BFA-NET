interface IProps {
  children: React.ReactNode,
  currency: string,
  subtitle: string,
  price: string,
  backgroundColor: string
}

export default function CardExchange({children, currency, subtitle, price, backgroundColor}: IProps) {
  return (
    <div className="exchange" style={{background: backgroundColor}}>
      {children}
      <div className="exchangeText">
        <h1>{currency}</h1>
        <p>{subtitle}</p>
        <p>{price},00 Kz</p>
      </div>
    </div>
  )
}