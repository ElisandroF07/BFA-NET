/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import "@/styles/private.css";
import { useEffect, useState } from "react";
import {useRouter} from 'next/navigation'
import {CiCloudOn,} from "react-icons/ci";
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
import useClientStore from "@/contexts/stores/clientStore";
import useCardStore from "@/contexts/stores/cardStore";
import TPA from "@/privatePages/tpa/page";
import Deposit from "@/privatePages/deposit/page";

type Card = {
  cardNumber: string;
  pin: string;
  createdAt: string;
  role: number;
  nickname: string;
  state: string
};

interface IAddress {
  country: string,
  full_address: string
}

interface IPersonalData {
  name: [string],
  birthDate: string,
  gender: string
}

type Client = {
  personalData: IPersonalData,
	email: string;
	biNumber: string;
	pictureProfile: string,
  address: IAddress
};

type Accountt = {
  iban: string,
  nbi: string,
  role: number,
  number: string,
  authorized_balance: number,
  bic: string,
  available_balance: number,
  up_balance: number,
  created_at: string,
  currency: string,
  state: string,
};

interface DashboardProps {
  biNumber: string,
  email: string,
  userData: Client,
  cardData: Card,
  accountData: Accountt,
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


export default function Dashbaord({email, biNumber, userData, cardData, accountData}: DashboardProps){

  const [page, setPage] = useState("Dashboard")
  const router = useRouter()
  const [picture, setPicture] = useState("")
  const [loading, setLoading] = useState(false)
  const useAccount = useAccountStore()
  const useClient = useClientStore()
  const useCard = useCardStore()
  const fetcher = (url: string) => api.get(url).then(res => res.data);

  const { data: pictureProfile, error: pictureError } = useSWR(`/getProfilePicture/${biNumber}`, fetcher);
  const currencies = ["USD", "EUR", "ZAR", "CNY"]
  const [currency, setCurrency] = useState<ApiResponse>({genericResponse: [], success: false})

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (userData) {
        useClient.setAddress(userData.address)
        useClient.setPersonalData(userData.personalData)
        useClient.setBiNumber(biNumber)
        useClient.setEmail(email)
        useClient.setPictureProfile(userData.pictureProfile)
    }
    if (cardData) {
      useCard.setCardNumber(cardData.cardNumber)
      useCard.setRole(cardData.role)
      useCard.setCreatedAt(cardData.createdAt)
      useCard.setNickname(cardData.nickname)
      useCard.setPin(cardData.pin)
      useCard.setState(cardData.state)

    }
    if (accountData) {
      useAccount.updateAuthorizedBalance(accountData.authorized_balance)
      useAccount.updateAvailableBalance(accountData.available_balance)
      useAccount.updateState(accountData.state)
      useAccount.updateBic(accountData.bic)
      useAccount.updateCreatedAt(accountData.created_at)
      useAccount.updateCurrency(accountData.currency)
      useAccount.updateIban(accountData.iban)
      useAccount.updateNbi(accountData.nbi)
      useAccount.updateNumber(accountData.number)
      useAccount.updateRole(accountData.role)
      useAccount.updateState(accountData.state)
      useAccount.updateUpBalance(accountData.up_balance)
    }
  }, [userData,  cardData, accountData])

  useEffect(() => {
    if (pictureProfile) {
      setPicture(pictureProfile.imageUrl)
    }
    if (pictureError) {
      toast.error("Não foi possível carregar a sua foto de perfil!", {description: "Verifique a sua conexão conexão com internet."})
    }
  }, [pictureProfile, pictureError])



  useEffect(() => {
    const buttons = document.querySelectorAll(".btn[data-active]") as NodeListOf<HTMLButtonElement>;
    const item_list = document.querySelectorAll(".btn") as NodeListOf<HTMLButtonElement>;
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
          
          <NotificationList email={useClient.email} biNumber={useClient.biNumber}/>
          <ButtonIcon>
            <CiCloudOn className="icon" />
          </ButtonIcon>
        </div>
      </header>
      <section className="privateChildrenContainer">
          {page === "Dashboard" ? (
            <Dashboard logout={logout} exchanges={currency} biNumber={useClient.biNumber}/>
          ) : page === "Conta" ? (
            <Account/>
          ) : page === "Pagamentos" ? (
            <Payments/>
          )
          : page === "TPA Virtual" ? (
            <TPA/>
          )
           : page === "Suporte" ? (
            <Support />
          ) : page === "Consultas" ? (
            <Consults/>
          ) : page === "Levantamentos" ? (
            <Upmoney/>
          ) : page === "Transferências" ? (
            <Transfers />
          )
          : page === "Depósitos" ? (
            <Deposit />
          ) : null}
      </section>
    </main>
    </SkeletonTheme>
  )
}