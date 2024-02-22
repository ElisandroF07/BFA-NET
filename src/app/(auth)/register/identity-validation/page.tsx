"use client"

import { useEffect, useState } from 'react'
import '@/styles/upload.css'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import Uploader from '@/components/cards/uploader'
import UploadCard from '@/components/cards/uploadCard'
import useUserStore from '@/contexts/stores/userStore'
import axios from 'axios'
import useStepsStore from '@/contexts/stores/stepsStore'

const MAX_FILE_SIZE: number = parseInt(process.env.MAX_FILE_SIZE ?? '5242880')
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/png',
]

export default function IdentityValidation(){

  const file = new File([], '')
  const useStore = useUserStore()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const stepsStore = useStepsStore()

  useEffect(()=>{
    stepsStore.setCurrent(2)
    stepsStore.setStep1(true)
    stepsStore.setStep2(true)
  }, [])

  const [selfie, setselfie] = useState({
    haveFile: false,
    type: '',
    name: '',
    size: 0,
    file: file
  })
  const [selfieWithBI, setselfieWithBI] = useState({
    haveFile: false,
    type: '',
    name: '',
    size: 0,
    file: file
  })

  function validateForm(): boolean {
    if (!selfie.haveFile && !selfieWithBI.haveFile) {
      toast.warning('Faça upload das imagens para continuar!')
      return false
    } else if (!selfie.haveFile) {
      toast.warning('Faça upload da sua selfie')
      return false
    } else if (!selfieWithBI.haveFile) {
      toast.warning('Faça upload da sua selfie segurando o BI!')
      return false
    } else {
      return true
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

    }
  }, [selfie.haveFile])

  function uploadSelfie(): Promise<any> {
    setLoading(true)
    const formData = new FormData();
    formData.append('image', selfie.file);
    return new Promise(async (resolve, reject) => {
      try {
        const response = await axios.post(`http://localhost:5000/upload-image/${useStore.phone}/SELFIE`, formData, {headers: {'Content-Type': 'multipart/form-data'}})
        if (response.status === 201) {
          resolve(response.data.message)
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

  function uploadSelfieBI(): Promise<any> {
    setLoading(true)
    const formData = new FormData();
    formData.append('image', selfieWithBI.file);
    return new Promise(async (resolve, reject) => {
      try {
        const response = await axios.post(`http://localhost:5000/upload-image/${useStore.phone}/SELFIE_BI`, formData, {headers: {'Content-Type': 'multipart/form-data'}})
        if (response.status === 201) {
          resolve(response.data.message)
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

  function submitForm() {
    if (validateForm()) {
      toast.promise(uploadSelfie(), {
        loading: 'Enviando...',
        success: (data) => {
          return data;
        },
        error: (data)=> {
          return data},
        });
      toast.promise(uploadSelfieBI(), {
        loading: 'Enviando...',
        success: (data) => {
          return data;
        },
        error: (data)=> {
          return data},
        });
        router.push('/register/credentials')
    }
    else {
      toast.warning('As imagens não foram enviadas.')
    }
  }

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
              {selfie.haveFile ? 
                <Uploader
                  fileName={selfie.name}
                  fileSize={selfie.size.toString()}
                  imageAlt="bi-frente"
                  imageType={selfie.type.replace('image/', '').trim()}
                  key={'uploader1'}
                  handleClick={() => setselfie({ haveFile: false, type: '', name: '', size: 0, file: file })
                  }
                />
                : 
                <UploadCard
                  inputId="i1"
                  key={'upload_area2'}
                  inputName="identityCardFrontImage"
                  acceptedImageTypes={ACCEPTED_IMAGE_TYPES}
                  maxFileSize={MAX_FILE_SIZE}
                  setState={setselfie}
                  file={file}
                />
              }
            </div>
            <div className="upload_container">
              <p className="simple_text">Selfie segurando o seu BI</p>
              {selfieWithBI.haveFile ? 
                <Uploader
                  fileName={selfieWithBI.name}
                  fileSize={selfieWithBI.size.toString()}
                  imageAlt="bi-verso"
                  imageType={selfieWithBI.type.replace('image/', '').trim()}
                  key={2}
                  handleClick={() =>
                    setselfieWithBI({ haveFile: false, type: '', name: '', size: 0, file: file })
                  }
                />
                : 
                <UploadCard
                  inputId="i2"
                  key={'upload_area2'}
                  inputName="identityCardBackImage"
                  acceptedImageTypes={ACCEPTED_IMAGE_TYPES}
                  maxFileSize={MAX_FILE_SIZE}
                  setState={setselfieWithBI}
                  file={file}
                />
              }
            </div>
        </div>
        <button type="button" disabled={loading} onClick={submitForm} className="button_auth">
          Avançar
        </button>
      </div>
    </form>
  )
}