"use client"

import { useEffect, useState } from 'react'
import '@/styles/upload.css'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import Uploader from '@/components/cards/uploader'
import UploadCard from '@/components/cards/uploadCard'
import axios from 'axios'
import useUserStore from '@/contexts/stores/userStore'
import useStepsStore from '@/contexts/stores/stepsStore'


const MAX_FILE_SIZE: number = parseInt(process.env.MAX_FILE_SIZE ?? '5242880')
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/png',
]

interface FileState {
  haveFile: boolean;
  type: string;
  name: string;
  size: number;
  file: File | null;
}

export default function Documentation(){

  const useStore = useUserStore()
  const router = useRouter()
  const stepsStore = useStepsStore()
  let phone_number = ''
  if (typeof window !== 'undefined') {
    phone_number = localStorage.getItem("phone") ?? ''
  }
  useEffect(()=>{
    stepsStore.setCurrent(1)
    stepsStore.setStep1(true)
  }, [])

  const [frontFile, setFrontFile] = useState<FileState>({
    haveFile: false,
    type: '',
    name: '',
    size: 0,
    file: null
  })
  const [backFile, setBackFile] = useState<FileState>({
    haveFile: false,
    type: '',
    name: '',
    size: 0,
    file: null
  })
  const [loading, setLoading] = useState(false)


  useEffect(() => {
    
    if (!backFile.haveFile) {
      const input = document.getElementById('i2') as HTMLInputElement
      if (input) {
        input.value = ''
      } else {
        alert('Null')
      }
    } else {
      
    }
  }, [backFile.haveFile])

  useEffect(() => {
    if (!frontFile.haveFile) {
      const input = document.getElementById('i1') as HTMLInputElement
      if (input) {
        input.value = ''
        
      } 
      else {
        alert('Null')
      }
    } 
    else {
      
    }
  }, [frontFile.haveFile])


  function validateForm(): boolean {
    if (!frontFile.haveFile && !backFile.haveFile) {
      toast.error('Faça upload das imagens para continuar!')
      return false
    } else if (!frontFile.haveFile) {
      toast.error('Faça upload da parte frontal do BI!')
      return false
    } else if (!backFile.haveFile) {
      toast.error('Faça upload da parte frontal do BI!')
      return false
    } else {
      return true
    }
  }

  function uploadFront(): Promise<any> {
    setLoading(true)
    const formData = new FormData();
    if (frontFile.file) {
      formData.append('image', frontFile.file);
    }
    return new Promise(async (resolve, reject) => {
      try {
        const response = await axios.post(`https://bfa-nodejs-api.onrender.com/upload/${phone_number ?? useStore.phone}/1`, formData, {headers: {'Content-Type': 'multipart/form-data'}})
        if (response.status === 200) {
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

  function uploadBack(): Promise<any> {
    setLoading(true)
    const formData = new FormData();
    if (backFile.file) {
      formData.append('image', backFile.file);
    }
    return new Promise(async (resolve, reject) => {
      try {
        const response = await axios.post(`https://bfa-nodejs-api.onrender.com/upload/${phone_number ?? useStore.phone}/2`, formData, {headers: {'Content-Type': 'multipart/form-data'}})
        if (response.status === 200) {
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

  function formSubmit() {
    if (validateForm()) {
      toast.promise(uploadFront(), {
        loading: 'Enviando...',
        success: (data) => {
          return data;
        },
        error: (data)=> {
          return data},
        });
      toast.promise(uploadBack(), {
        loading: 'Enviando...',
        success: (data) => {
          router.push('/register/identity-validation')
          return data;
        },
        error: (data)=> {
          return data},
        });
      
    }
    else {
      toast.warning('As imagens não foram enviadas.')
    }
  }

    return (
        <form className="login_form identity_verification">
            <div className="header_form">
              <h1>Documentação</h1>
              <p>Faça upload das fotografias do seu bilhete de identidade. </p>
            </div>
            <div className="body_form">
            <div className="uploaders_container">
              <div className="upload_container">
                <p className="simple_text">Frente</p>
                {frontFile.haveFile ? 
                  <Uploader
                    fileName={frontFile.name}
                    fileSize={frontFile.size.toString()}
                    imageAlt="bi-frente"
                    imageType={frontFile.type.replace('image/', '').trim()}
                    key={'1'}
                    handleClick={() => setFrontFile({ haveFile: false, type: '', name: '', size: 0, file: null })}/> 
                  : 
                  <UploadCard
                  inputId="i1"
                  key={'upload_area1'}
                  inputName="image"
                  acceptedImageTypes={ACCEPTED_IMAGE_TYPES}
                  maxFileSize={MAX_FILE_SIZE}
                  setState={setFrontFile}
                  file={null}/>
              }
              </div>
              <div className="upload_container">
                <p className="simple_text">Verso</p>
                {backFile.haveFile ? 
                  <Uploader
                    fileName={backFile.name}
                    fileSize={backFile.size.toString()}
                    imageAlt="bi-verso"
                    imageType={backFile.type.replace('image/', '').trim()}
                    key={2}
                    handleClick={() => setBackFile({ haveFile: false, type: '', name: '', size: 0, file: null })}/>
                    : 
                  <UploadCard
                  inputId="i2"
                  key={'upload_area2'}
                  inputName="image"
                  acceptedImageTypes={ACCEPTED_IMAGE_TYPES}
                  maxFileSize={MAX_FILE_SIZE}
                  setState={setBackFile} file={null}/>
                }
              </div>
            </div>
            <button type="button" disabled={loading} onClick={formSubmit} className="button_auth">
              Avançar
            </button>
          </div>
        </form>
    )
}