"use client";

import "@/styles/private.css";
import { useEffect, useState } from "react";
import {useRouter} from 'next/navigation'
import {
  CiBellOff,
  CiBellOn,
  CiCloudOn,
  CiGps,
  CiGrid41,
  CiInboxIn,
  CiInboxOut,
  CiLogout,
  CiMoneyCheck1,
  CiReceipt,
  CiSettings,
  CiShare1,
  CiSquareAlert,
} from "react-icons/ci";
import { FiLogOut } from "react-icons/fi";
import { signOut } from "next-auth/react";
import ButtonIcon from "@/components/buttons/buttonIcon";
import Account from "@/privatePages/account/page";
import Consults from "@/privatePages/consults/page";
import Dashboard from "@/privatePages/home/page";
import Payments from "@/privatePages/payments/page";
import Support from "@/privatePages/support/page";
import Transfers from "@/privatePages/transfers/page";
import Upmoney from "@/privatePages/upmoney/page";
import api from "@/services/api";
import useAccountStore from "@/contexts/stores/accountStore";
import { toast } from "sonner";
import useSWR from "swr";
import axios from "axios";
import DashboardNavbar from "@/components/others/dasboardNavbar";
import { SkeletonTheme } from "react-loading-skeleton";
import NotificationList from "@/components/lists/notificationList";

interface DashboardProps {
  username: string,
  biNumber: string,
  email: string,
  birthDate: string,
  country: string,
  address: string,
  fullName: string
}

interface IAccount {
	iban: string,
	nbi: string,
	role: number,
	number: string,
	authorized_balance: number,
	bic: string,
	available_balance: number,
	created_at: string,
	currency: string,
	state: string,
}

interface ICurrency {
  taxa: number;
  descricaoTipoCambio: string;
  tipoCambio: string;
  data: string;
  designacaoMoeda: string;
  codigoMoeda: string;
}

interface ApiResponse {
  genericResponse: ICurrency[];
  success: boolean;
}

export default function Dashbaord({fullName, username, biNumber, email, birthDate, country, address}: DashboardProps){

  const [page, setPage] = useState("Dashboard")
  const router = useRouter()
  const [picture, setPicture] = useState("")
  const [loading, setLoading] = useState(false)
  const useAccount = useAccountStore()
  const fetcher = (url: string) => api.get(url).then(res => res.data);
	const { data: accountData, error: accountError } = useSWR(`/getAccountData/${biNumber}`, fetcher);
  const { data: pictureProfile, error: pictureError } = useSWR(`/getProfilePicture/${biNumber}`, fetcher);
  const currencies = ["USD", "EUR", "ZAR", "CNY"]
  const [currency, setCurrency] = useState<ApiResponse>({genericResponse: [], success: false})

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
		if (accountData) {
      useAccount.updateIban(accountData.account.iban)
      useAccount.updateNbi(accountData.account.nbi)
      useAccount.updateRole(accountData.account.role)
      useAccount.updateNumber(accountData.account.number)
      useAccount.updateAuthorizedBalance(accountData.account.authorized_balance)
      useAccount.updateBic(accountData.account.bic)
      useAccount.updateAuthorizedBalance(accountData.account.available_balance)
      useAccount.updateCreatedAt(accountData.account.created_at)
      useAccount.updateCurrency(accountData.account.currency)
      useAccount.updateState(accountData.account.state)
		}
		if (accountError) {
			toast.error("Não foi possível carregar os dados da sua conta!", { description: "Verifique a sua conexão com a internet." });
		}
	}, [accountData, accountError]);

  useEffect(() => {
    async function getCurrencies() {
     try {
      let newCurrencies: ICurrency[] = [];
      newCurrencies = await Promise.all(
        currencies.map(async (item) => {
          const response = await axios.get(
            `https://www.bna.ao/service/rest/taxas/get/taxa/referencia?moeda=${item}&tipocambio=G`
          );
          return response.data;
        })
      );
      setCurrency((prevCurrency) => {
        const existingCurrencies = prevCurrency.genericResponse.map((curr) => curr.designacaoMoeda);
        return {
          ...prevCurrency,
          genericResponse: [
            ...prevCurrency.genericResponse,
            ...newCurrencies.filter((curr) => !existingCurrencies.includes(curr.designacaoMoeda)).slice(0, 4),
          ],
        };
      });
     }
     catch {
      toast.error("Não foi possivel obter as taxas de câmbio!")
     }
    }
    getCurrencies();
  }, []);

  useEffect(() => {
    console.log(currency);
  }, [currency]);
  
  


  useEffect(() => {
    if (pictureProfile) {
      setPicture(pictureProfile.imageUrl)
    }
    if (pictureError) {
      toast.error("Não foi possível carregar a sua foto de perfil!", {description: "Verifique a sua conexão conexão com internet."})
    }
  }, [pictureProfile, pictureError])


  useEffect(() => {
    const buttons = document.querySelectorAll(
      ".btn[data-active]",
    ) as NodeListOf<HTMLButtonElement>;
    const item_list = document.querySelectorAll(
      ".btn",
    ) as NodeListOf<HTMLButtonElement>;
    const shadow = document.querySelector(".shadow") as HTMLDivElement;

    for (const item of item_list) {
      if (item.dataset.active === "true") {
        shadow.style.transition = ".5s";
        shadow.style.transform = `translate(${
          item.getBoundingClientRect().x + 7
        }px, ${item.getBoundingClientRect().y + 18}px)`;
        shadow.style.height = `${item.getBoundingClientRect().height - 35}px`;
      }
    }

    for (const button of buttons) {
      button.addEventListener("mouseover", () => {
        shadow.style.transform = `translate(${
          button.getBoundingClientRect().x + 7
        }px, ${button.getBoundingClientRect().y + 18}px)`;
        shadow.style.height = `${button.getBoundingClientRect().height - 35}px`;
      });
    }

    for (const button of buttons) {
      button.addEventListener("mouseleave", () => {
        for (const item of item_list) {
          if (item.dataset.active === "true") {
            shadow.style.transition = ".5s";
            shadow.style.transform = `translate(${
              item.getBoundingClientRect().x + 7
            }px, ${item.getBoundingClientRect().y + 18}px)`;
            shadow.style.height = `${
              item.getBoundingClientRect().height - 35
            }px`;
          }
        }
      });
    }

    function update(button: HTMLButtonElement) {
      for (const btn of buttons) {
        btn.dataset.active = "false";
      }
      button.dataset.active = "true";
    }

    for (const button of buttons) {
      button.addEventListener("click", () => {
        update(button);
        setPage(button.dataset.page || "");
      });
    }

  }, []);

  async function logout() {
    setLoading(true)
    await signOut({
      redirect: false
    })
    router.replace('/login')
  }

  return (
    <SkeletonTheme baseColor="#F0F0F0" highlightColor="#fff">
    <main className="privateMainContainer">
      <div className="shadow" />
      <DashboardNavbar loading={loading} logout={logout}/>
      <header className="privateHeader">
        <h1>{page}</h1>
        <p>Internet Banking</p>
        <div>
          
          <NotificationList email={email} biNumber={biNumber}/>
          <ButtonIcon>
            <CiCloudOn className="icon" />
          </ButtonIcon>
        </div>
      </header>
      <section className="privateChildrenContainer">
          {page === "Dashboard" ? (
            <Dashboard biNumber={biNumber} titular={username} picture={picture} logout={logout} exchanges={currency} emailFrom={email}/>
          ) : page === "Conta" ? (
            <Account biNumber={biNumber} fullName={fullName} titular={username} birthDate={birthDate} email={email} country={country} address={address} picture={picture}/>
          ) : page === "Pagamentos" ? (
            <Payments authorized_balance={useAccount.authorized_balance} available_balance={useAccount.available_balance}  number={useAccount.number}/>
          ) : page === "Suporte" ? (
            <Support />
          ) : page === "Consultas" ? (
            <Consults authorized_balance={useAccount.authorized_balance} number={useAccount.number} available_balance={useAccount.available_balance} iban={useAccount.iban} />
          ) : page === "Levantamentos" ? (
            <Upmoney authorized_balance={useAccount.authorized_balance} available_balance={useAccount.available_balance} email={email}/>
          ) : page === "Transferências" ? (
            <Transfers authorized_balance={useAccount.authorized_balance} biNumber={biNumber} available_balance={useAccount.available_balance} iban={useAccount.iban} number={useAccount.number}/>
          ) : null}
      </section>
    </main>
    </SkeletonTheme>
  )
}