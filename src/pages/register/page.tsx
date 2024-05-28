"use client";
import axios from "axios";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { useDisclosure } from "@nextui-org/react";
import { toast } from "sonner";
import useUserStore from "@/contexts/stores/userStore";
import Image from "next/image";
import Link from "next/link";
import InfoError from "@/components/others/infoError";
import RegisterInfoModal from "@/components/modals/registerInfo";
import business from "@/assets/images/wellcome.svg";
import "@/styles/globals.css";
import "@/styles/phone.css";
import { TailSpin } from 'react-loader-spinner'

const FormSchema = z.object({
    email: z.string().min(1, "O email é obrigatório!").email("Email inválido! Corrija o email").transform((email) => {
        return email.trim().toLowerCase();
    }),
});

type FormType = z.infer<typeof FormSchema>;

export default function Register() {
    const router = useRouter();
    const useStore = useUserStore()
    const [place, setPlace] = useState("")
    const [loading, setLoading] = useState(false)
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const {register, formState: { errors }, handleSubmit, setValue} = useForm<FormType>({
        resolver: zodResolver(FormSchema),
    });

    async function submitForm(data: FormType) {
        APICall(data)
    }

	async function APICall(data: FormType){
		setLoading(true)
        const { email } = data;
            await axios.get(`https://maximum-janith-franco07-5ccaf5a9.koyeb.app/sendEmail/${email}`)
            .then((response) => {
                if (response.status === 201) {
                    useStore.updateEmail(email);
                    if (typeof window !== "undefined") {
                        localStorage.setItem("email", email);
                    }
                    router.push("/email-verification");
                    toast.success(response.data.message)
                }
                else {
                    toast.error(response.data.message) 
                    setLoading(false)
                }
            })
            .catch((err)=>{
                toast.error("Sem conexão com o servidor")
		    console.log(err)
                setLoading(false)
            }) 
    }

    useEffect(() => onOpen(), [onOpen]);

    return (
        <div className="home_main">
            <div className="home_body">
                <div className="left">
                    <Image src={business} alt="business" />
                    <h1>Seja bem-vindo à família</h1>
                    <p>Crie uma conta e junte-se à essa maravilhosa comunidade.</p>
                </div>
                <div className="right">
                    <form onSubmit={handleSubmit(submitForm)} className="login_form">
                        <div className="header_form">
                            <h1>Crie uma conta</h1>
                            <p>
                                Já tem uma conta? <Link href={"/login"}>Fazer login</Link>
                            </p>
                        </div>
                        <div className="body_form">
                            <div className="input_field">
                                <label id="LRE" htmlFor="email">Endereço de email *</label>
                                <input
                                    type="email"
                                    placeholder="Insira o seu endereço de email "
                                    {...register("email")}
                                    onChange={(event)=>{
                                        setPlace(event.target.value)
                                        setValue("email", event.target.value)
                                    }}
                                    onFocus={()=>{
                                        const label = document.querySelector('#LRE') as HTMLLabelElement
                                        label.style.transition = ".3s"
                                        label.style.color = "var(--color-focus)"
                                    }}
                                    onBlur={()=>{
                                        const label = document.querySelector('#LRE') as HTMLLabelElement
                                        label.style.transition = ".3s"
                                        label.style.color = "var(--color-text)"
                                    }}
                                />
                                {errors.email && <InfoError message={errors.email.message} />}
                            </div>
                            <button type="submit" disabled={loading || !place} className="button_auth">
                            {loading ? (
                                <TailSpin
                                    height="25"
                                    width="25"
                                    color="#fff"
                                    ariaLabel="tail-spin-loading"
                                    radius="1"
                                    visible={true}
                                />
                            ) : (
                                <>Aderir <FaArrowRightLong style={{marginLeft: "10px"}}/></>
                            )}
                            </button>
                            <div className="terms">
                                <p>
                                    Ao criar uma conta, você estará confirmando que leu e aceitou
                                    as nossas{" "}
                                    <Link href="/privacy-policies">
                                        Políticas de Privacidade e Termos de Uso
                                    </Link>
                                    .
                                </p>
                            </div>
                        </div>
                    </form>
                    <p className="basic_text not_found_footer">
                        © 2024 Banco de Fomento Angola
                    </p>
                </div>
            </div>
            <RegisterInfoModal isOpen={isOpen} onOpenChange={onOpenChange} />
        </div>
    );
}
