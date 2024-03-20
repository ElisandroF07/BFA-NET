interface IProps {
  children: React.ReactNode,
  label: string
}

export default function CardService({children, label}: IProps) {
  return (
    <div className="service">
      {children}
      <p>{label}</p>
		</div>
  )
}