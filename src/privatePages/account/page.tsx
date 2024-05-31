"use client"

import useUserStore from "@/contexts/stores/userStore";
import CardsSection from "@/components/cards/cardsSection";
import ManageInfoSection from "@/components/cards/manageInfoSection";
import OptionsSection from "@/components/cards/optionsSecton";
import SecuritySection from "@/components/cards/securitySection";
import "@/styles/account.css";
import { CiLocationArrow1, CiImport } from "react-icons/ci";
import useClientStore from "@/contexts/stores/clientStore";
import useAccountStore from "@/contexts/stores/accountStore";
import { useState } from "react";
import api from "@/services/api";
import { TailSpin } from "react-loader-spinner";
import { toast } from "sonner";

interface Sections {
  [key: string]: JSX.Element;
}

export default function Account() {

  const store = useUserStore();
  const useAccount = useAccountStore()
  const useClient = useClientStore()
  const [loading, setLoading] = useState(false)
  const [loading2, setLoading2] = useState(false)

  async function getAccountExtract(){
    setLoading(true)
    const response = await api.get(`/generatePDF/7/${useAccount.number.replaceAll('.', '')}`, {responseType: 'arraybuffer'});
    const blob = new Blob([response.data], { type: 'application/pdf' }); 
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Extrato de Conta N-${useAccount.number.replaceAll('.', '')}.pdf`; 
    a.click();
    setLoading(false)
  }

  async function sendEmailExtract(){
    setLoading2(true)
    const response = await api.get(`/sendPDF/7/${useAccount.number.replaceAll('.', '')}/${useClient.email}`, {responseType: 'arraybuffer'});
    if (response.status === 201) {
      toast.success("Extrato enviado com sucesso!")
    }
    else {
      toast.error("Falha ao enviar extrato!")
    }
    setLoading2(false)
  }


  const sections: Sections = {
    options: <OptionsSection />,
    manageInfo: (
      <ManageInfoSection
      />
    ),
    cards: <CardsSection/>,
    security: <SecuritySection biNumber={useClient.biNumber}/>,
  };

  return (
    <div className="account_container">
      <div className="account_header">
        <div className="top">
          <h1>Conta</h1>
          <p>Gerencie a sua.</p>
        </div>
      </div>
      <div className="account_body">
        <div className="settings">
          <div
            className="image"
            style={{ backgroundImage: `url(${useClient.pictureProfile})` }}
          />
          <h1>{useClient.personalData.name.join(' ')}</h1>
          <p>{useAccount.role === 1 ? "Particular" : "Comerciante"}</p>
          {sections[store.validation]}
        </div>
      </div>
      <div className="account_lateral">
        <h1 className="title" style={{color: "#3B3D4E"}}>Minha conta</h1>
        <div className="separator" />
        <div className="infoContainer">
          {
            <>
              {[
                { label: "Número da conta", value: useAccount.number.replaceAll('.', ' ') },
                { label: "IBAN", value: useAccount.iban.replace('AO06', '') },
                { label: "NIB", value: useAccount.nbi.replace('AO06', '') },
                { label: "BIC/SWIFT", value: useAccount.bic },
                { label: "Moeda", value: useAccount.currency },
                {
                  label: "Titular",
                  value: `${useClient.personalData.name[0]} ${useClient.personalData.name[useClient.personalData.name.length - 1]}`,
                },
                {
                  label: "Data de abertura",
                  value: new Intl.DateTimeFormat("pt-BR").format(
                    new Date(parseInt(useAccount.created_at))
                  ),
                },
                {
                  label: "Tipo de conta",
                  value: useAccount.role === 1 ? "Conta à Ordem" : "Conta Simplificada",
                },
                {
                  label: "Saldo disponível",
                  value: `${useAccount.available_balance.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA', maximumFractionDigits: 0 })}`,
                },
                {
                  label: "Saldo autorizado",
                  value: `${useAccount.authorized_balance.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA', maximumFractionDigits: 0 })}`,
                },
                { label: "Estado", value: useAccount.state },
              ].map((item, index) => (
                <div key={item.label}>
                  <h1>{item.label}</h1>
                  <p>{item.value}</p>
                </div>
              ))}
            </>
          }
        </div>
        <div className="separator" />
        <p className="pLink" onClick={sendEmailExtract}>
          Enviar para email
          {loading2 ? <TailSpin
              height="25"
              width="25"
              color="#fc6423"
              ariaLabel="tail-spin-loading"
              radius="1"
              visible={true}
              />
             : 
              <CiLocationArrow1 />
            }
        </p>
        <p className="pLink" onClick={getAccountExtract}>
          Salvar como PDF {loading ? (
              <TailSpin
              height="25"
              width="25"
              color="#fc6423"
              ariaLabel="tail-spin-loading"
              radius="1"
              visible={true}
              />
            ) : (
            <CiImport />
            )}
        </p>
      </div>
    </div>
  );
}
