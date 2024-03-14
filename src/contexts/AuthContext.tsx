import { SetStateAction, createContext, useEffect, useState } from "react";
import { setCookie, parseCookies } from 'nookies'
import axios from "axios";
import { useRouter } from "next/navigation";

import { api } from "../services/api";

type User = {
  address: {country: string, full_address: string},
  personal_data: {name: [string], gender: string, birthDate: string},
  bi_number: string,
  email: string,
  profilePicturePath: string
}

type SignInData = {
  OTP: string
  email: string;
}

type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  signIn: (data: SignInData) => Promise<false | undefined>
}

export const AuthContext = createContext({} as AuthContextType)

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export  function AuthProvider({ children }: {children: any}) {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  const isAuthenticated = !!user;

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  // useEffect(() => {
  //   console.log("cheguei")
  //   const fetchData = async () => {
  //     const { 'bfanet.token': token } = parseCookies();
  //     if (token) {
  //       console.log("passei")
  //       try {
  //         const response = await api.get(`/getUserData/${user?.bi_number}`);
  //         const { data } = response.data;
  //         setUser(data);
  //         console.log(user)
  //       } catch (error) {
  //         console.error('Erro ao obter dados do usuário:', error);
  //       }
  //     }
  //   };

  //   fetchData();
  // }, []);

  async function signIn({ OTP, email }: SignInData) {
    try {
      const body = JSON.stringify({OTP: OTP,email: email});
      const response = await axios.post('http://localhost:5000/verifyOTP', body, { headers: { "Content-Type": "application/json" } });
      const { token, client } = response.data;

      if(token) {
        setCookie(undefined, 'bfanet.token', token, {
          maxAge: 60 * 60 * 1, // 1 hora
        });
    
        api.defaults.headers.Authorization = `Bearer ${token}`;
        setUser(client);
        console.log(client)
        console.log(response.data)
        router.push('/dashboard');
      }
      else {
        return false
      }
    } catch (error) {
      return false
    }
  }
  
  return (
    <AuthContext.Provider value={{ user, isAuthenticated, signIn }}>
      {children}
    </AuthContext.Provider>
  )
}