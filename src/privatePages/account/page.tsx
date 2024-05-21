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

interface Sections {
  [key: string]: JSX.Element;
}

export default function Account() {

  const store = useUserStore();
  const useAccount = useAccountStore()
  const useClient = useClientStore()

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
        <p className="pLink">
          Enviar para email <CiLocationArrow1 />
        </p>
        <p className="pLink">
          Salvar como PDF <CiImport />
        </p>
      </div>
    </div>
  );
}
