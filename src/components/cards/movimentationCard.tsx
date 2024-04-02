interface IProps {
  tittle: string,
  text: string,
  date: string,
  children: React.ReactNode
}

export default function MovimentationCard({tittle, text, date, children}: IProps){
  return (
    <div className="movimentationCard">
      {children}
      <div>
        <div className="flex overflow-hidden gap-1"><h1>{tittle}:</h1><p>{text}</p></div>
        <p>{date}</p>
      </div>
    </div>
  )
}