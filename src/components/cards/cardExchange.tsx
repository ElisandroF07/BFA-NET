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
  
  function formatNumber(x: string) {
    const roundedNumber = parseFloat(x).toFixed(2);
    return roundedNumber.replace('.', ',');
  }
  
  return (
    <div className="exchange" style={{background: backgroundColor, color: color, border: border, boxShadow: boxShadow}}>
      <div className="exchangeText">
        <h1 style={{color: color}}>{currency}</h1>
        <p style={{color: color}}>{subtitle}</p>
        <p style={{color: color}}>{formatNumber(price)} Kz</p>
      </div>
    </div>
  )
}