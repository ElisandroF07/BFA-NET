"use client"

import InfoError from "@/components/others/infoError";
import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import { z } from "zod";

  const FormSchema = z.object({
    name: z
      .string({
        required_error: 'O campo não pode estar vazio!',
      })
      .min(1, 'O campo não pode estar vazio!')
      .transform((information) => {
        return information.trim().toUpperCase()
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
      .regex(/^[0-9]{8}[A-Z|a-z]{2}[0-9]{3}$/, 'Número do BI inválido!')
      .transform((phone) => {
        return phone.trim().toUpperCase()
      }),
  })

  type FormType = z.infer<typeof FormSchema>

export default function PersonalData(){

    const {
        register,
        handleSubmit,
        formState: { errors },
        } = useForm<FormType>({
        resolver: zodResolver(FormSchema),
    })

    async function submitForm(data: unknown) {
        console.log(data)
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
              <button type="submit"  className="button_auth">
                Avançar
              </button>
            </div>
          </form>
    )
}