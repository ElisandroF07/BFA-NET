"use client"

import { useEffect, useState } from 'react'
import '@/styles/upload.css'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import Uploader from '@/components/cards/uploader'
import UploadCard from '@/components/cards/uploadCard'

const MAX_FILE_SIZE: number = parseInt(process.env.MAX_FILE_SIZE ?? '5242880')
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/png',
]

export default function IdentityValidation(){


  const router = useRouter()
  const [selfie, setselfie] = useState({
    haveFile: false,
    type: '',
    name: 'Elisandro.png',
    size: 0,
  })
  const [selfieWithBI, setselfieWithBI] = useState({
    haveFile: false,
    type: '',
    name: '',
    size: 0,
  })

  function validateForm() {
    const i1 = document.getElementById('i1') as HTMLInputElement
    const i2 = document.getElementById('i2') as HTMLInputElement
    if (i1.files?.length === 0 && i2.files?.length === 0) {
      toast.warning('Faça upload das imagens para continuar!')
    } else if (i1.files?.length === 0) {
      toast.warning('Faça upload da parte frontal do BI!')
    } else if (i2.files?.length === 0) {
      toast.warning('Faça upload da parte frontal do BI!')
    } else {
      router.push('/auth/step4')
    }
  }

  useEffect(() => {
    if (!selfieWithBI.haveFile) {
      const input = document.getElementById('i2') as HTMLInputElement
      if (input) {
        input.value = ''
      } else {
        alert('Null')
      }
    } else {
      /* empty */
    }
  }, [selfieWithBI.haveFile])

  useEffect(() => {
    if (!selfie.haveFile) {
      const input = document.getElementById('i1') as HTMLInputElement
      if (input) {
        input.value = ''
      } else {
        alert('Null')
      }
    } else {
      /* empty */
    }
  }, [selfie.haveFile])


    return (
        <form className="login_form identity_verification">
            <div className="header_form">
              <h1>Validação de identidade</h1>
              <p>Faça upload das fotografias solicitadas abaixo. </p>
            </div>
            <div className="body_form">
            <div className="uploaders_container">
              <div className="upload_container">
                        <p className="simple_text">Selfie simples</p>
                        {selfie.haveFile ? (
              <Uploader
                fileName={selfie.name}
                fileSize={selfie.size.toString()}
                imageAlt="bi-frente"
                imageType={selfie.type.replace('image/', '').trim()}
                key={'uploader1'}
                handleClick={() =>
                  setselfie({ haveFile: false, type: '', name: '', size: 0 })
                }
              />
                        ) : (
              <UploadCard
                inputId="i1"
                key={'upload_area2'}
                inputName="identityCardFrontImage"
                acceptedImageTypes={ACCEPTED_IMAGE_TYPES}
                maxFileSize={MAX_FILE_SIZE}
                setState={setselfie}
              />
                        )}
                      </div>
                      <div className="upload_container">
                        <p className="simple_text">Selfie segurando o seu BI</p>
                        {selfieWithBI.haveFile ? (
              <Uploader
                fileName={selfieWithBI.name}
                fileSize={selfieWithBI.size.toString()}
                imageAlt="bi-verso"
                imageType={selfieWithBI.type.replace('image/', '').trim()}
                key={2}
                handleClick={() =>
                  setselfieWithBI({ haveFile: false, type: '', name: '', size: 0 })
                }
              />
                        ) : (
              <UploadCard
                inputId="i2"
                key={'upload_area2'}
                inputName="identityCardBackImage"
                acceptedImageTypes={ACCEPTED_IMAGE_TYPES}
                maxFileSize={MAX_FILE_SIZE}
                setState={setselfieWithBI}
              />
                        )}
                      </div>
            </div>
              
              <button type="submit"  className="button_auth">
                Avançar
              </button>
            </div>
          </form>
    )
}