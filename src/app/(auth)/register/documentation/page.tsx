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

export default function Documentation(){


  const router = useRouter()
  const [frontFile, setFrontFile] = useState({
    haveFile: false,
    type: '',
    name: 'Elisandro.png',
    size: 0,
  })
  const [backFile, setBackFile] = useState({
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
    if (!backFile.haveFile) {
      const input = document.getElementById('i2') as HTMLInputElement
      if (input) {
        input.value = ''
      } else {
        alert('Null')
      }
    } else {
      /* empty */
    }
  }, [backFile.haveFile])

  useEffect(() => {
    if (!frontFile.haveFile) {
      const input = document.getElementById('i1') as HTMLInputElement
      if (input) {
        input.value = ''
      } else {
        alert('Null')
      }
    } else {
      /* empty */
    }
  }, [frontFile.haveFile])
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
                        {frontFile.haveFile ? (
              <Uploader
                fileName={frontFile.name}
                fileSize={frontFile.size.toString()}
                imageAlt="bi-frente"
                imageType={frontFile.type.replace('image/', '').trim()}
                key={'uploader1'}
                handleClick={() =>
                  setFrontFile({ haveFile: false, type: '', name: '', size: 0 })
                }
              />
                        ) : (
              <UploadCard
                inputId="i1"
                key={'upload_area2'}
                inputName="identityCardFrontImage"
                acceptedImageTypes={ACCEPTED_IMAGE_TYPES}
                maxFileSize={MAX_FILE_SIZE}
                setState={setFrontFile}
              />
                        )}
                      </div>
                      <div className="upload_container">
                        <p className="simple_text">Verso</p>
                        {backFile.haveFile ? (
              <Uploader
                fileName={backFile.name}
                fileSize={backFile.size.toString()}
                imageAlt="bi-verso"
                imageType={backFile.type.replace('image/', '').trim()}
                key={2}
                handleClick={() =>
                  setBackFile({ haveFile: false, type: '', name: '', size: 0 })
                }
              />
                        ) : (
              <UploadCard
                inputId="i2"
                key={'upload_area2'}
                inputName="identityCardBackImage"
                acceptedImageTypes={ACCEPTED_IMAGE_TYPES}
                maxFileSize={MAX_FILE_SIZE}
                setState={setBackFile}
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