"use client"

import { useEffect, useRef, useState } from 'react'
import '@/styles/upload.css'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import Uploader from '@/components/cards/uploader'
import UploadCard from '@/components/cards/uploadCard'
import axios from 'axios'
import useUserStore from '@/contexts/stores/userStore'
import useStepsStore from '@/contexts/stores/stepsStore'
import * as faceapi from 'face-api.js';
import Tesseract from 'tesseract.js'
const MAX_FILE_SIZE: number = parseInt(process.env.MAX_FILE_SIZE ?? '5242880')
const regexBI = /^[0-9]{9}[A-Z]{2}[0-9]{3}$/
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
  const idCardRef = useRef<HTMLImageElement>(null)
  const selfieRef = useRef<HTMLImageElement>(null)
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

  let phone_number = ''

  if (typeof window !== 'undefined') {
    phone_number = localStorage.getItem("phone") ?? ''
  }

  useEffect(()=>{

    stepsStore.setCurrent(1);
    stepsStore.setStep1(true);

    

  }, [])

  async function testRegex(regex: RegExp) {
    let biNumber = ''
    let haveBiNumber = false
    const response = await Tesseract.recognize(URL.createObjectURL(frontFile.file || new File([], '')));
    const words  =response.data.words
    if (words) {
      words.forEach(word => {
        if (regexBI.test(word.text)) {
          biNumber = word.text
          haveBiNumber = true
          return
        }
      })
    }
    else {
      toast.error('Envie uma imagem do seu BI')
    }
    if (haveBiNumber) {
      return {haveBiNumber, biNumber}
    }
    else {
      return {haveBiNumber, biNumber}
    }
  }

  async function verify() {

    const response = await testRegex(regexBI)
    

    setLoading(true);
    
    //Aqui a função está a carregar os modelos necessários para funcionar corretamente
    (async () => {

      
      
      setLoading(false)
      

      // await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
      // await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
      // await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
      // await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
      // await faceapi.nets.faceExpressionNet.loadFromUri('/models');

      // let idCard
      // let idSelfie

      // //Aqui a função está a verificar se há um rosto na foto do BI e se a imagem está nítida
      // if (idCardRef.current){
      //   const idCardFacedetection = await faceapi.detectSingleFace(idCardRef.current,
      //     new faceapi.TinyFaceDetectorOptions())
      //     .withFaceLandmarks().withFaceDescriptor();
      //   idCard = idCardFacedetection
      //   if (!idCardFacedetection) {
      //     toast.error('A imagem do BI necessita ser nítida!')
      //   }
      // }

      // //Aqui a função está a verificar se há um rosto na selfie enviada e se a imagem está nítida
      // if (selfieRef.current){
      //   const selfieFacedetection = await faceapi.detectSingleFace(selfieRef.current,
      //     new faceapi.TinyFaceDetectorOptions())
      //     .withFaceLandmarks().withFaceDescriptor();
      //   idSelfie = selfieFacedetection
      //   if (!idSelfie) {
      //     toast.error('Envie uma selfie mais nítida!')
      //   }
      // }

      // //Aqui a função está a comparar os rostos com inteligência artifical 
      // if(idCard && idSelfie){
      //   const distance = faceapi.euclideanDistance(idCard.descriptor, idSelfie.descriptor);
      //   console.log(distance);
      //   //Aqui ela verifica a diferenca/distância entre os rostos, varia de  0 à 1, se for 0 os rostos são iguais, se for 1 são diferentes
      //   if (distance < 0.5) {
      //     //Aqui verificamos se a diferença for menor que 0.5, significa que o os rostos pertencem à mesma pesoa
      //     setLoading(false)
      //     toast.success('Identidade validada com sucesso!')



      //     // toast.promise(uploadFront(), {
      //     //   loading: 'Carregando...',
      //     //   success: (data) => {
      //     //     return data;
      //     //   },
      //     //   error: (data)=> {
      //     //     return data},
      //     //   });
      //     // toast.promise(uploadBack(), {
      //     //   loading: 'Carregando...',
      //     //   success: (data) => {
      //     //     router.push('/register/identity-validation')
      //     //     return data;
      //     //   },
      //     //   error: (data)=> {
      //     //     return data},
      //     //   });
      //   }
      //   else {
      //     setLoading(false)
      //     toast.error('Não foi possível validar a sua identidade!')
      //     toast.warning('Envie imagens autênticas.')
      //   }
      // }
      // else {
      //   toast.error('Não foi possível validar a sua identidade!')
      //   setLoading(false)
      // }

    })();
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
      
    }
  }, [backFile.haveFile])

  useEffect(() => {
    const filePath = URL.createObjectURL(frontFile.file || new File([], ''))
    console.log(filePath);
    
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
      toast.error('Faça upload da sua selfie pessoal!')
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
      verify()
    }
    else {
      
    }
  }

    return (
        <form className="login_form identity_verification">
            <div className="header_form">
              <h1>Documentação</h1>
              <p>Faça upload das imagens abaixo. </p>
            </div>
            <div className="body_form">
            <div className="uploaders_container">
              <div className="upload_container">
                <p className="simple_text">Bilhete de Identidade</p>
                {frontFile.haveFile ? 
                  <Uploader
                    fileName={frontFile.name}
                    fileSize={frontFile.size.toString()}
                    imageAlt="bi-frente"
                    imageType={frontFile.type.replace('image/', '').trim()}
                    key={'1'}
                    file={frontFile.file || new File([], '')}
                    imageRef={idCardRef}
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
                <p className="simple_text">Selfie pessoal</p>
                {backFile.haveFile ? 
                  <Uploader
                    fileName={backFile.name}
                    fileSize={backFile.size.toString()}
                    imageAlt="bi-verso"
                    imageType={backFile.type.replace('image/', '').trim()}
                    key={2}
                    file={backFile.file || new File([], '')}
                    imageRef={selfieRef}
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
              {loading ? <>Validando...</> : <>Avançar</>}
            </button>
          </div>
        </form>
    )
}