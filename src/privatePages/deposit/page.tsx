"use client"

import useAccountStore from "@/contexts/stores/accountStore"
import useClientStore from "@/contexts/stores/clientStore"
import { useState } from "react"

export default function Deposit(){

  const useAccount = useAccountStore()
  const useClient = useClientStore()
  const [loading, setLoading] = useState()

  return(
    <>
      <div>
        <h1>Aplicação de Depósito à Prazo</h1>
      </div>
      <div>
        Sem aplicações
      </div>
    </>
  )
}