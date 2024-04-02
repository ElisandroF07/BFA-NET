"use client"

import { useEffect, useState } from "react";
import useUserStore from "@/contexts/stores/userStore";
import api from "@/services/api";
import CardsSection from "@/components/cards/cardsSection";
import ManageInfoSection from "@/components/cards/manageInfoSection";
import OptionsSection from "@/components/cards/optionsSecton";
import SecuritySection from "@/components/cards/securitySection";
import "@/styles/account.css";
import { toast } from "sonner";
import { CiLocationArrow1, CiImport } from "react-icons/ci";
import useSWR from "swr";


interface IProps {
  biNumber: string;
  titular: string;
  email: string;
  country: string;
  address: string;
  birthDate: string;
  fullName: string;
  picture: string;
}

interface IAccount {
  iban: string;
  nbi: string;
  role: number;
  number: string;
  authorized_balance: number;
  bic: string;
  available_balance: number;
  created_at: string;
  currency: string;
  state: string;
}

interface Sections {
  [key: string]: JSX.Element;
}

export default function Account({
  biNumber,
  titular,
  email,
  birthDate,
  country,
  address,
  fullName,
  picture,
}: IProps) {
  
  const [account, setAccount] = useState<IAccount | null>(null);
  const store = useUserStore();

  const fetcher = (url: string) => api.get(url).then(res => res.data);
	const { data: accountData, error: accountError } = useSWR(`/getAccountData/${biNumber}`, fetcher);

	useEffect(() => {
		if (accountData) {
			setAccount(accountData.account);
		}
		if (accountError) {
			toast.error("Não foi possível carregar os dados da sua conta!", { description: "Verifique a sua conexão com a internet." });
		}
	}, [accountData, accountError]);

  const sections: Sections = {
    options: <OptionsSection />,
    manageInfo: (
      <ManageInfoSection
        biNumber={biNumber}
        titular={fullName}
        birthDate={birthDate}
        email={email}
        country={country}
        address={address}
      />
    ),
    cards: <CardsSection biNumber={biNumber} titular={titular} />,
    security: <SecuritySection  biNumber={biNumber} />,
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
            style={{ backgroundImage: `url(${picture})` }}
          />
          <h1>{fullName}</h1>
          <p>Conta Particular</p>
          {sections[store.validation]}
        </div>
      </div>
      <div className="account_lateral">
        <h1 className="title">Minha conta</h1>
        <div className="separator" />
        <div className="infoContainer">
          {account && (
            <>
              {[
                { label: "Número da conta", value: account.number },
                { label: "IBAN", value: account.iban },
                { label: "NBA", value: account.nbi },
                { label: "BIC/SWIFT", value: account.bic },
                { label: "Divísa", value: account.currency },
                {
                  label: "Titular",
                  value: titular,
                },
                {
                  label: "Data de abertura",
                  value: new Intl.DateTimeFormat("pt-BR").format(
                    new Date(parseInt(account.created_at))
                  ),
                },
                {
                  label: "Tipo de conta",
                  value: account.role === 1 ? "Conta à ordem" : "",
                },
                {
                  label: "Saldo disponível",
                  value: `${account.available_balance} Kz`,
                },
                {
                  label: "Saldo autorizado",
                  value: `${account.authorized_balance} Kz`,
                },
                { label: "Estado", value: account.state },
              ].map((item, index) => (
                <div key={item.label}>
                  <h1>{item.label}</h1>
                  <p>{item.value}</p>
                </div>
              ))}
            </>
          )}
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
