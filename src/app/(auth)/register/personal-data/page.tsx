"use client"

import {useRouter} from 'next/navigation'
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import InfoError from '@/components/others/infoError';
import useUserStore from '@/contexts/stores/userStore';
import { useEffect, useState } from 'react';
import useStepsStore from '@/contexts/stores/stepsStore';

const FormSchema = z.object({
  name: z
    .string({
      required_error: 'O campo não pode estar vazio!',
    })
    .min(1, 'O campo não pode estar vazio!')
    .transform((name) => {
			return name
				.trim()
				.split(' ')
				.map((word) => {
					return word[0].toLocaleUpperCase().concat(word.substring(1))
				})
		}),
  email: z.string({
      required_error: 'O email é obrigatório!',
    })
    .min(1, 'O email é obrigatório!')
    .regex(/^[a-z|A-Z|0-9._-]+@[a-z|A-Z|0-9.-]+\.[a-zA-Z]{2,}$/, 'O email digitado é inválido!')
    .transform((information) => {
      return information.trim().toUpperCase()
    }),
  biNumber: z
    .string({
      required_error: 'O número do BI é obrigatório!',
    })
    .min(1, 'O número do BI é obrigatório!')
    .regex(/^[0-9]{9}[A-Z|a-z]{2}[0-9]{3}$/, 'Número do BI inválido!')
    .transform((phone) => {
      return phone.trim().toUpperCase()
    }),
})

type FormType = z.infer<typeof FormSchema>

export default function PersonalData(){
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const useStore = useUserStore()



  const {register, handleSubmit, formState: { errors },  } = useForm<FormType>({
      resolver: zodResolver(FormSchema),
  })

  async function APICall(data: any):Promise<any> {
    setLoading(true)
    return new Promise(async (resolve, reject) => {
      try {
        const response = await axios.post("http://localhost:5000/personal-data", data, {headers: {'Content-Type': 'application/json'}})
        if (response.status === 201) {
          resolve(response.data.message)
          router.push('/register/documentation')
        }
      } 
      catch (error: any) {
        reject(error.response?.data.message)
      }
      finally{
        setLoading(false)
      }
    })
  }

  async function submitForm(data: FormType) {
    const {name, email, biNumber} = data
    const phone = parseInt('244' + '948951028')
    const formatedData = JSON.stringify({
      name,
      email,
      biNumber,
      phone
    })
    toast.promise(APICall(formatedData), {
      loading: 'Enviando...',
      success: (data) => {
        return data;
      },
      error: (data)=> {
        return data},
      });
  }

  return (
    <form onSubmit={handleSubmit(submitForm)} className="login_form">
      <div className="header_form">
        <h1>Dados pessoais</h1>
        <p>Introduza os seus dados pessoais abaixo. Certifique-se de digitar as informações corretamente.</p>
      </div>
      <div className="body_form">
        <div className="input_field">
        <label htmlFor="name">Nome completo</label>
        <input
        type='text'
          placeholder="Insira o seu nome completo"
          {...register('name')}
        />
        {errors.name && (
          <InfoError message={errors.name.message} />
        )}
        </div>
        <div className="input_field">
        <label htmlFor="email">Endereço de email</label>
        <input
          type="email"
          placeholder="Insira o seu endereço de email "
          {...register('email')}
        />
        {errors.email && (
          <InfoError message={errors.email.message} />
        )}
        </div>
        <div className="input_field">
        <label htmlFor="bi_number">Número do BI</label>
        <input
          type="text"
          placeholder="Insira o número do BI"
          {...register('biNumber')}
        />
        {errors.biNumber && (
          <InfoError message={errors.biNumber.message} />
        )}
        </div>
        <button type="submit" disabled={loading} className="button_auth">
          Avançar
        </button>
      </div>
    </form>
  )
}