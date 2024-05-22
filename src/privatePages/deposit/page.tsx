"use client"

import useAccountStore from "@/contexts/stores/accountStore"
import useClientStore from "@/contexts/stores/clientStore"
import { useState } from "react"
import '@/styles/deposit.css'
import Link from "next/link"

export default function Deposit(){

  const useAccount = useAccountStore()
  const useClient = useClientStore()
  const [loading, setLoading] = useState()

  return(
    <div className="payments_container">
    <div className="payments_header">
      <div className="top">
        <h1>Depósitos</h1>
        <p>Aplicação de depósito à prazo.</p>
      </div>
      <div className="bottom">
        <div>
          <h2>Saldo contabilístico</h2>
          <p>{useAccount.available_balance.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA', maximumFractionDigits: 0 })}</p>
        </div>
        <div>
          <h2>Saldo autorizado</h2>
          <p>{useAccount.authorized_balance.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA', maximumFractionDigits: 0 })}</p>
        </div>
      </div>
    </div>
    <div className="payments_body">
     <div className="body_content w-full h-full flex flex-col py-[30px]">
     <div className="cardDeposit">
      <h2>DP BFA 10%</h2>
      <p>O BFA disponibiliza na sua oferta o DP BFA 10%, um depósito a prazo em Kwanzas, a uma taxa bastante atractiva com o propósito de captação de dinheiro novo.</p>
      <div className="infos">
        <div className="part">
          <h3>Duração</h3>
          <p>180 | 365 Dias (renovável automaticamente)</p>
        </div>
        <div className="part">
          <h3>TANB</h3>
          <p>10%</p>
        </div>
        <div className="part">
          <h3>Montante mínimo</h3>
          <p>Kz 100 000</p>
        </div>
        <div className="part">
          <h3>Montante máximo</h3>
          <p>-</p>
        </div>
      </div>
      <div className="actionButtons"><Link target="_blank" href="https://www.bfa.ao/media/4249/ficha-tecnica-informativa-dp-bfa-10.pdf">Ficha técnica</Link> <button>Constituir</button></div>
     </div>
     <div className="cardDeposit">
      <h2>DP BFA 13%</h2>
      <p>O BFA disponibiliza na sua oferta o DP BFA 13%, um produto de investimento em Kwanzas a 540 dias e uma taxa bastante atractiva. Uma excelente alternativa para rentabilizar os seus recursos.</p>
      <div className="infos">
        <div className="part">
          <h3>Duração</h3>
          <p>540 Dias (renovável automaticamente)</p>
        </div>
        <div className="part">
          <h3>TANB</h3>
          <p>13%</p>
        </div>
        <div className="part">
          <h3>Montante mínimo</h3>
          <p>Kz 500 000</p>
        </div>
        <div className="part">
          <h3>Montante máximo</h3>
          <p>-</p>
        </div>
      </div>
      <div className="actionButtons"><Link target="_blank" href="https://www.bfa.ao/media/4250/ficha-tecnica-informativa-dp-bfa-13.pdf">Ficha técnica</Link> <button>Constituir</button></div>
     </div>
     <div className="cardDeposit">
      <h2>DP ESPECIAL CRESCENTE</h2>
      <p>Aplicação de curto prazo com taxas de juro crescente, que visa rentabilização dos recursos aplicados exclusivamente via BFA Net e BFA App.</p>
      <div className="infos">
        <div className="part">
          <h3>Duração</h3>
          <p>3 Mêses</p>
        </div>
        <div className="part">
          <h3>TANB</h3>
          <p>5,50% / 7,50% / 12,50%</p>
        </div>
        <div className="part">
          <h3>Montante mínimo</h3>
          <p>Kz 100 000</p>
        </div>
        <div className="part">
          <h3>Montante máximo</h3>
          <p>-</p>
        </div>
      </div>
      <div className="actionButtons"><Link target="_blank" href="https://www.bfa.ao/media/5506/ficha-te-cnica-informativa-dp-especial-crescente.pdf">Ficha técnica</Link> <button>Constituir</button></div>
     </div>
     </div>
      
    </div>
    <div className="lateral">
      <h1 className="title" style={{margin: "10px 0px 0px 0px"}}>Aplicações</h1>
      <div className="separator" />
      <div className="requests">
       
      </div>
    </div>
  </div>
  )
}