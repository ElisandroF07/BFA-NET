export default function LateralCard({ text1, text2, text3, text4, status }: { text1: string, text2: string, text3: string, text4: string, status?: string }) {
  return (
    <div className="lateralCard">
      <p>{text1}</p>
      <p>{text2}</p>
      <p>{text3}</p>
      <p>{status && <div className="circle" style={{ backgroundColor: status === "complete" ? "#13DE3B" : status === "pending" ? "#FFC700" : status === "rejected" ? "#FF3E13" : "gray" }} />}{text4}</p>
    </div>
  )
}