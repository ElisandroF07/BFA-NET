'use client'

import Link from 'next/link'
import Image from 'next/image'
import '@/styles/globals.css'
import '@/styles/phone_verification.css'
import business from '../../../../../public/assets/images/Two factor authentication-pana.svg'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import axios from 'axios'

import useUserStore from '@/contexts/stores/userStore'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const FormSchema = z.object({
  field1: z
    .string()
    .min(1, 'O campo não pode estar vazio!')
    .max(1, 'Apenas é aceite 1 dígito'),
  field2: z
    .string()
    .min(1, 'O campo não pode estar vazio!')
    .max(1, 'Apenas é aceite 1 dígito'),
  field3: z
    .string()
    .min(1, 'O campo não pode estar vazio!')
    .max(1, 'Apenas é aceite 1 dígito'),
  field4: z
    .string()
    .min(1, 'O campo não pode estar vazio!')
    .max(1, 'Apenas é aceite 1 dígito'),
  field5: z
    .string()
    .min(1, 'O campo não pode estar vazio!')
    .max(1, 'Apenas é aceite 1 dígito'),
  field6: z
    .string()
    .min(1, 'O campo não pode estar vazio!')
    .max(1, 'Apenas é aceite 1 dígito'),
})

type FormType = z.infer<typeof FormSchema>

export default function TwoFactorAuthentication() {

  const useStore = useUserStore()
  const router = useRouter()

  const { handleSubmit, register } = useForm<FormType>({
    resolver: zodResolver(FormSchema),
  })


  function APICall(body: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
          const response = await axios.post("https://bfa-nodejs-api.onrender.com/verify-otp", body,{ headers: { 'Content-Type': 'application/json' } })
          if (response.status === 201) {
            resolve(response.data.message)
          }
        }
        catch(error: any){
          reject(error.response?.data.message)
        }
    })
  }

  async function submitForm(data: FormType) {
    const verificationContainer = document.querySelector('.verification_container') as HTMLDivElement
    const { field1, field2, field3, field4, field5, field6 } = data;
    const formatedData = field1 + field2 + field3 + field4 + field5 + field6;
    const body = JSON.stringify({phone: parseInt(useStore.phone), otp_code: formatedData});
    toast.promise(APICall(body), {
      loading: 'Verificando...',
      success: (data) => {
        useStore.updateValidation(false)
        verificationContainer.style.display = 'none'
        router.push('/register/upload-id')
        return data;
      },
      error: (data)=> {
        return data},
    });
      
  }

  function reSend(){
    const button = document.querySelector('#step2_next') as HTMLButtonElement
    useStore.updateValidation(true)
    button.click()
  }

  useEffect(() => {
    const phoneFragments = document.querySelectorAll(
      '.phone_fragment',
    ) as NodeListOf<HTMLInputElement>

    function focusNext() {
      const phone = document.querySelector(
        'input[data-checked="false"]',
      ) as HTMLInputElement
      if (phone) {
        phone.focus()
      }
    }

    phoneFragments.forEach((phone) => {
      phone.addEventListener('keyup', () => {
        if (phone.value) {
          phone.dataset.checked = 'true'
          focusNext()
        } else {
          phone.dataset.checked = 'false'
        }
      })
    })
  }, [])

  return (
    <div className='home_main'>
        <svg className='logo' id="svg" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="400" height="109.71428571428571" viewBox="0, 0, 400,109.71428571428571"><g id="svgg"><path id="path0" d="M10.417 0.319 C 5.274 1.618,1.431 5.524,0.268 10.637 C -0.190 12.650,-0.134 93.348,0.327 95.269 C 1.321 99.417,4.245 102.902,8.167 104.616 L 9.417 105.163 48.295 105.165 L 87.173 105.167 88.172 104.761 C 91.328 103.479,93.894 101.003,95.454 97.735 L 96.083 96.417 96.083 52.833 L 96.083 9.250 95.307 7.667 C 93.519 4.021,90.188 1.319,86.265 0.332 C 84.321 -0.157,12.351 -0.169,10.417 0.319 M96.582 52.833 C 96.582 75.429,96.601 84.673,96.625 73.375 C 96.649 62.077,96.649 43.590,96.625 32.292 C 96.601 20.994,96.582 30.238,96.582 52.833 M71.091 16.242 C 71.735 16.887,71.144 20.058,69.981 22.195 C 69.865 22.409,69.680 23.146,69.570 23.833 C 69.389 24.967,69.264 25.426,68.806 26.642 C 68.669 27.006,68.630 27.017,68.287 26.790 C 67.673 26.384,67.538 25.742,67.969 25.283 C 68.326 24.903,68.433 24.287,68.232 23.764 C 68.053 23.298,67.686 23.480,67.571 24.092 C 67.510 24.417,67.375 24.777,67.272 24.893 C 66.924 25.280,66.133 26.890,65.915 27.657 C 65.488 29.151,65.131 29.925,64.532 30.657 C 63.385 32.057,63.231 32.364,63.343 33.035 C 63.468 33.787,62.842 35.793,62.234 36.590 C 62.011 36.882,61.712 37.464,61.569 37.883 C 61.426 38.303,61.202 38.735,61.071 38.843 C 60.940 38.952,60.833 39.105,60.833 39.184 C 60.833 40.141,58.568 42.257,57.362 42.426 C 55.927 42.628,54.207 43.929,54.710 44.432 C 55.353 45.076,57.825 45.362,58.891 44.917 C 59.220 44.779,59.722 44.667,60.006 44.667 C 60.868 44.667,61.815 43.952,61.828 43.292 C 61.835 42.932,62.167 42.899,62.167 43.258 C 62.167 43.524,63.359 44.157,63.872 44.163 C 64.032 44.165,64.541 44.400,65.004 44.685 C 65.467 44.970,66.162 45.304,66.548 45.428 C 67.283 45.664,68.891 46.257,70.167 46.764 C 72.216 47.577,73.051 48.628,74.392 52.083 C 75.259 54.314,77.381 58.390,78.516 60.000 C 81.593 64.369,81.833 65.107,80.299 65.500 C 79.905 65.601,79.308 65.789,78.972 65.918 C 78.636 66.047,77.736 66.231,76.972 66.326 C 75.362 66.527,73.571 66.902,72.500 67.261 C 68.931 68.458,66.283 68.772,65.083 68.141 C 64.808 67.996,64.321 67.830,64.000 67.772 C 63.294 67.643,62.203 66.939,61.606 66.227 C 61.365 65.939,60.961 65.653,60.709 65.591 C 59.983 65.414,59.042 64.685,58.387 63.793 C 58.056 63.341,57.096 62.284,56.254 61.444 C 55.305 60.496,54.587 59.616,54.361 59.125 C 53.955 58.240,53.868 58.200,53.315 58.648 C 52.977 58.921,52.915 59.153,52.838 60.426 C 52.789 61.248,52.671 61.916,52.570 61.949 C 52.387 62.010,52.000 61.323,52.000 60.938 C 52.000 60.101,50.756 59.824,50.564 60.618 C 50.305 61.694,48.694 64.455,48.173 64.717 C 47.677 64.967,47.555 65.301,47.910 65.437 C 48.090 65.506,48.387 65.326,48.802 64.895 C 50.985 62.629,51.449 62.446,52.573 63.407 C 53.557 64.250,53.890 67.655,53.125 69.061 C 51.900 71.313,47.455 76.014,43.415 79.331 C 42.133 80.384,40.935 81.434,40.754 81.664 C 39.858 82.805,38.357 84.085,37.483 84.454 C 37.111 84.611,36.861 84.546,35.697 83.985 C 34.953 83.627,34.125 83.333,33.858 83.333 C 32.958 83.333,32.532 82.503,32.438 80.564 C 32.394 79.658,32.269 78.692,32.160 78.417 C 31.851 77.632,31.512 76.138,31.506 75.526 C 31.503 75.219,31.396 74.769,31.268 74.526 C 31.140 74.282,30.944 73.446,30.831 72.667 C 30.719 71.887,30.560 70.800,30.478 70.250 C 30.221 68.523,30.116 64.294,30.319 63.833 C 30.561 63.283,31.431 61.732,31.907 61.000 C 32.116 60.679,32.459 60.117,32.669 59.750 C 34.103 57.251,38.022 53.000,38.893 53.000 C 39.244 53.000,40.000 52.644,40.000 52.479 C 40.000 52.199,39.205 51.934,38.000 51.813 C 31.910 51.198,26.510 48.831,24.447 45.871 C 23.647 44.723,22.261 43.007,21.314 41.991 C 19.778 40.343,19.833 40.465,19.833 38.739 C 19.833 37.770,19.744 36.942,19.603 36.605 C 19.467 36.280,19.430 35.953,19.511 35.807 C 19.696 35.477,19.816 27.547,19.646 26.939 C 19.364 25.934,20.151 25.212,21.021 25.678 C 21.204 25.776,22.042 25.926,22.885 26.013 C 23.727 26.099,24.792 26.278,25.250 26.410 C 25.708 26.542,26.608 26.696,27.250 26.752 C 27.892 26.808,29.654 27.032,31.167 27.251 C 34.869 27.787,38.680 28.298,40.000 28.435 C 41.545 28.595,42.605 29.115,43.566 30.182 C 44.283 30.977,45.500 33.212,45.500 33.732 C 45.500 33.836,45.650 34.201,45.833 34.544 C 46.017 34.886,46.167 35.264,46.167 35.384 C 46.167 35.505,46.279 35.749,46.417 35.926 C 46.764 36.376,47.167 35.868,47.167 34.979 C 47.167 34.636,47.247 34.145,47.344 33.888 C 47.442 33.631,47.587 32.219,47.667 30.750 C 47.746 29.281,47.924 27.555,48.061 26.915 C 48.198 26.274,48.359 25.454,48.419 25.092 C 48.578 24.130,54.335 18.839,55.917 18.203 C 58.043 17.346,62.503 16.539,66.136 16.352 C 67.890 16.262,69.458 16.111,69.621 16.016 C 70.115 15.728,70.660 15.812,71.091 16.242 M68.545 22.333 C 68.545 22.746,68.578 22.915,68.618 22.708 C 68.657 22.502,68.657 22.165,68.618 21.958 C 68.578 21.752,68.545 21.921,68.545 22.333 M68.762 29.060 C 68.702 29.623,68.652 30.271,68.650 30.500 C 68.647 30.729,68.538 31.287,68.406 31.739 C 68.274 32.191,68.167 32.962,68.167 33.452 C 68.167 33.943,68.066 34.585,67.944 34.880 C 67.822 35.175,67.756 35.705,67.797 36.057 C 67.903 36.944,67.409 37.808,65.793 39.570 C 65.449 39.944,65.128 40.374,65.078 40.526 C 64.996 40.775,63.903 41.333,63.497 41.333 C 63.222 41.333,63.315 40.568,63.625 40.286 C 64.175 39.786,64.833 37.976,64.833 36.964 C 64.833 36.681,64.878 36.644,65.033 36.800 C 65.646 37.412,66.304 35.815,65.782 34.980 C 65.577 34.651,66.004 33.871,66.468 33.729 C 67.093 33.538,67.252 33.352,67.366 32.681 C 67.432 32.294,67.597 31.757,67.732 31.486 C 67.945 31.059,67.946 30.935,67.740 30.539 C 67.434 29.952,67.438 29.471,67.756 28.709 C 68.418 27.127,68.948 27.312,68.762 29.060 M47.806 37.910 C 47.537 38.501,48.504 39.718,48.916 39.307 C 49.241 38.981,49.157 38.308,48.742 37.924 C 48.173 37.397,48.041 37.395,47.806 37.910 M44.252 38.997 C 44.129 39.196,44.285 39.500,44.510 39.500 C 44.713 39.500,44.714 39.049,44.512 38.924 C 44.426 38.871,44.309 38.904,44.252 38.997 M50.405 40.077 C 50.094 40.552,49.906 42.199,50.066 43.050 L 50.175 43.632 50.983 43.243 C 51.427 43.029,51.837 42.730,51.895 42.580 C 52.445 41.147,51.140 38.955,50.405 40.077 M41.753 40.495 C 41.622 40.708,42.159 41.524,42.352 41.405 C 42.662 41.214,42.518 40.333,42.177 40.333 C 41.999 40.333,41.808 40.406,41.753 40.495 M37.383 42.129 C 36.942 42.200,36.696 42.810,37.024 43.018 C 37.327 43.211,38.521 43.201,38.833 43.003 C 39.297 42.710,38.134 42.009,37.383 42.129 M39.914 43.337 C 39.703 43.679,41.138 45.218,41.825 45.386 C 42.563 45.567,42.926 44.636,42.520 43.602 C 42.380 43.245,40.114 43.014,39.914 43.337 M44.462 47.260 C 44.310 47.412,44.833 48.321,45.179 48.507 C 46.134 49.018,45.241 50.478,44.103 50.265 C 43.592 50.169,43.527 50.201,43.427 50.603 C 43.278 51.196,43.496 51.375,44.541 51.521 C 46.140 51.743,47.177 52.190,47.587 52.833 C 47.792 53.154,48.149 53.591,48.379 53.804 L 48.797 54.191 49.823 53.411 C 51.149 52.403,51.474 51.935,51.126 51.537 C 50.517 50.841,50.395 50.358,50.566 49.326 C 50.782 48.018,50.605 47.839,49.740 48.494 C 48.845 49.171,46.966 48.879,46.392 47.974 C 46.117 47.540,44.704 47.018,44.462 47.260 M40.909 49.608 C 40.393 50.164,40.396 50.302,40.931 50.505 C 41.566 50.747,42.404 50.485,42.471 50.023 C 42.600 49.138,41.592 48.870,40.909 49.608 M54.689 55.105 C 54.052 55.383,54.036 55.917,54.640 56.793 C 54.813 57.044,55.239 57.700,55.585 58.250 C 56.752 60.102,59.833 62.943,59.833 62.167 C 59.833 62.075,59.721 62.000,59.583 62.000 C 59.446 62.000,59.333 61.854,59.333 61.677 C 59.333 61.499,59.257 61.306,59.164 61.248 C 58.853 61.056,57.667 59.105,57.651 58.759 C 57.642 58.571,57.646 58.152,57.661 57.829 C 57.716 56.593,55.963 54.406,55.271 54.847 C 55.260 54.854,54.998 54.971,54.689 55.105 M46.278 55.944 C 46.078 56.145,46.161 56.788,46.415 56.998 C 46.613 57.163,46.678 57.159,46.740 56.977 C 47.026 56.138,46.735 55.488,46.278 55.944 M48.257 57.189 C 47.775 57.762,47.789 58.469,48.294 59.042 C 48.638 59.431,48.859 59.402,49.209 58.921 C 49.818 58.084,49.857 57.720,49.396 57.172 C 48.867 56.543,48.799 56.544,48.257 57.189 M30.542 105.792 C 40.327 105.815,56.340 105.815,66.125 105.792 C 75.910 105.768,67.904 105.748,48.333 105.748 C 28.762 105.748,20.756 105.768,30.542 105.792 " stroke="none" fill="#fc6423" fill-rule="evenodd"></path><path id="path1" d="M69.621 16.016 C 69.458 16.111,67.890 16.262,66.136 16.352 C 62.503 16.539,58.043 17.346,55.917 18.203 C 54.335 18.839,48.578 24.130,48.419 25.092 C 48.359 25.454,48.198 26.274,48.061 26.915 C 47.924 27.555,47.746 29.281,47.667 30.750 C 47.587 32.219,47.442 33.631,47.344 33.888 C 47.247 34.145,47.167 34.636,47.167 34.979 C 47.167 35.868,46.764 36.376,46.417 35.926 C 46.279 35.749,46.167 35.505,46.167 35.384 C 46.167 35.264,46.017 34.886,45.833 34.544 C 45.650 34.201,45.500 33.836,45.500 33.732 C 45.500 33.212,44.283 30.977,43.566 30.182 C 42.605 29.115,41.545 28.595,40.000 28.435 C 38.680 28.298,34.869 27.787,31.167 27.251 C 29.654 27.032,27.892 26.808,27.250 26.752 C 26.608 26.696,25.708 26.542,25.250 26.410 C 24.792 26.278,23.727 26.099,22.885 26.013 C 22.042 25.926,21.204 25.776,21.021 25.678 C 20.151 25.212,19.364 25.934,19.646 26.939 C 19.816 27.547,19.696 35.477,19.511 35.807 C 19.430 35.953,19.467 36.280,19.603 36.605 C 19.744 36.942,19.833 37.770,19.833 38.739 C 19.833 40.465,19.778 40.343,21.314 41.991 C 22.261 43.007,23.647 44.723,24.447 45.871 C 26.510 48.831,31.910 51.198,38.000 51.813 C 39.205 51.934,40.000 52.199,40.000 52.479 C 40.000 52.644,39.244 53.000,38.893 53.000 C 38.380 53.000,37.732 53.580,35.311 56.205 C 34.461 57.126,33.215 58.799,32.669 59.750 C 32.459 60.117,32.116 60.679,31.907 61.000 C 31.431 61.732,30.561 63.283,30.319 63.833 C 30.116 64.294,30.221 68.523,30.478 70.250 C 30.560 70.800,30.719 71.887,30.831 72.667 C 30.944 73.446,31.140 74.282,31.268 74.526 C 31.396 74.769,31.503 75.219,31.506 75.526 C 31.512 76.138,31.851 77.632,32.160 78.417 C 32.269 78.692,32.394 79.658,32.438 80.564 C 32.532 82.503,32.958 83.333,33.858 83.333 C 34.125 83.333,34.953 83.627,35.697 83.985 C 36.861 84.546,37.111 84.611,37.483 84.454 C 38.357 84.085,39.858 82.805,40.754 81.664 C 40.935 81.434,42.133 80.384,43.415 79.331 C 47.455 76.014,51.900 71.313,53.125 69.061 C 53.890 67.655,53.557 64.250,52.573 63.407 C 51.449 62.446,50.985 62.629,48.802 64.895 C 48.387 65.326,48.090 65.506,47.910 65.437 C 47.555 65.301,47.677 64.967,48.173 64.717 C 48.694 64.455,50.305 61.694,50.564 60.618 C 50.756 59.824,52.000 60.101,52.000 60.938 C 52.000 61.323,52.387 62.010,52.570 61.949 C 52.671 61.916,52.789 61.248,52.838 60.426 C 52.915 59.153,52.977 58.921,53.315 58.648 C 53.868 58.200,53.955 58.240,54.361 59.125 C 54.587 59.616,55.305 60.496,56.254 61.444 C 57.096 62.284,58.056 63.341,58.387 63.793 C 59.042 64.685,59.983 65.414,60.709 65.591 C 60.961 65.653,61.365 65.939,61.606 66.227 C 62.203 66.939,63.294 67.643,64.000 67.772 C 64.321 67.830,64.808 67.996,65.083 68.141 C 66.283 68.772,68.931 68.458,72.500 67.261 C 73.571 66.902,75.362 66.527,76.972 66.326 C 77.736 66.231,78.636 66.047,78.972 65.918 C 79.308 65.789,79.905 65.601,80.299 65.500 C 81.833 65.107,81.593 64.369,78.516 60.000 C 77.381 58.390,75.259 54.314,74.392 52.083 C 73.051 48.628,72.216 47.577,70.167 46.764 C 68.891 46.257,67.283 45.664,66.548 45.428 C 66.162 45.304,65.467 44.970,65.004 44.685 C 64.541 44.400,64.032 44.165,63.872 44.163 C 63.359 44.157,62.167 43.524,62.167 43.258 C 62.167 42.899,61.835 42.932,61.828 43.292 C 61.815 43.952,60.868 44.667,60.006 44.667 C 59.722 44.667,59.220 44.779,58.891 44.917 C 57.825 45.362,55.353 45.076,54.710 44.432 C 54.207 43.929,55.927 42.628,57.362 42.426 C 58.568 42.257,60.833 40.141,60.833 39.184 C 60.833 39.105,60.940 38.952,61.071 38.843 C 61.202 38.735,61.426 38.303,61.569 37.883 C 61.712 37.464,62.011 36.882,62.234 36.590 C 62.842 35.793,63.468 33.787,63.343 33.035 C 63.231 32.364,63.385 32.057,64.532 30.657 C 65.131 29.925,65.488 29.151,65.915 27.657 C 66.133 26.890,66.924 25.280,67.272 24.893 C 67.375 24.777,67.510 24.417,67.571 24.092 C 67.686 23.480,68.053 23.298,68.232 23.764 C 68.433 24.287,68.326 24.903,67.969 25.283 C 67.538 25.742,67.673 26.384,68.287 26.790 C 68.630 27.017,68.669 27.006,68.806 26.642 C 69.264 25.426,69.389 24.967,69.570 23.833 C 69.680 23.146,69.865 22.409,69.981 22.195 C 70.507 21.230,71.492 17.929,71.497 17.117 C 71.503 16.203,70.406 15.559,69.621 16.016 M68.618 22.708 C 68.578 22.915,68.545 22.746,68.545 22.333 C 68.545 21.921,68.578 21.752,68.618 21.958 C 68.657 22.165,68.657 22.502,68.618 22.708 M68.288 27.791 C 67.578 28.576,67.339 29.772,67.740 30.539 C 67.946 30.935,67.945 31.059,67.732 31.486 C 67.597 31.757,67.432 32.294,67.366 32.681 C 67.252 33.352,67.093 33.538,66.468 33.729 C 66.004 33.871,65.577 34.651,65.782 34.980 C 66.304 35.815,65.646 37.412,65.033 36.800 C 64.878 36.644,64.833 36.681,64.833 36.964 C 64.833 37.976,64.175 39.786,63.625 40.286 C 63.315 40.568,63.222 41.333,63.497 41.333 C 63.903 41.333,64.996 40.775,65.078 40.526 C 65.128 40.374,65.449 39.944,65.793 39.570 C 67.409 37.808,67.903 36.944,67.797 36.057 C 67.756 35.705,67.822 35.175,67.944 34.880 C 68.066 34.585,68.167 33.943,68.167 33.452 C 68.167 32.962,68.274 32.191,68.406 31.739 C 68.538 31.287,68.647 30.729,68.650 30.500 C 68.652 30.271,68.702 29.623,68.762 29.060 C 68.894 27.819,68.710 27.326,68.288 27.791 M48.742 37.924 C 49.157 38.308,49.241 38.981,48.916 39.307 C 48.504 39.718,47.537 38.501,47.806 37.910 C 48.041 37.395,48.173 37.397,48.742 37.924 M44.667 39.260 C 44.667 39.535,44.403 39.581,44.250 39.333 C 44.114 39.113,44.313 38.801,44.512 38.924 C 44.597 38.977,44.667 39.128,44.667 39.260 M51.561 40.301 C 51.861 40.735,52.000 41.151,52.000 41.620 C 52.000 42.617,51.879 42.811,50.983 43.243 L 50.175 43.632 50.066 43.050 C 49.806 41.663,50.297 39.667,50.898 39.667 C 51.021 39.667,51.319 39.952,51.561 40.301 M42.500 40.823 C 42.500 41.483,42.263 41.588,41.928 41.077 C 41.615 40.600,41.704 40.333,42.177 40.333 C 42.423 40.333,42.500 40.449,42.500 40.823 M38.833 42.620 C 39.184 42.936,38.801 43.162,37.917 43.162 C 37.065 43.162,36.766 42.975,36.907 42.531 C 37.089 41.956,38.150 42.005,38.833 42.620 M42.520 43.602 C 42.926 44.636,42.563 45.567,41.825 45.386 C 41.138 45.218,39.703 43.679,39.914 43.337 C 40.114 43.014,42.380 43.245,42.520 43.602 M45.619 47.458 C 45.966 47.619,46.314 47.851,46.392 47.974 C 46.966 48.879,48.845 49.171,49.740 48.494 C 50.605 47.839,50.782 48.018,50.566 49.326 C 50.395 50.358,50.517 50.841,51.126 51.537 C 51.474 51.935,51.149 52.403,49.823 53.411 L 48.797 54.191 48.379 53.804 C 48.149 53.591,47.792 53.154,47.587 52.833 C 47.177 52.190,46.140 51.743,44.541 51.521 C 43.496 51.375,43.278 51.196,43.427 50.603 C 43.527 50.201,43.592 50.169,44.103 50.265 C 45.241 50.478,46.134 49.018,45.179 48.507 C 43.955 47.852,44.364 46.878,45.619 47.458 M42.326 49.407 C 42.905 50.106,41.919 50.881,40.931 50.505 C 40.396 50.302,40.393 50.164,40.909 49.608 C 41.357 49.124,42.013 49.031,42.326 49.407 M55.855 55.070 C 56.966 55.537,57.712 56.677,57.661 57.829 C 57.646 58.152,57.642 58.571,57.651 58.759 C 57.667 59.105,58.853 61.056,59.164 61.248 C 59.257 61.306,59.333 61.499,59.333 61.677 C 59.333 61.854,59.446 62.000,59.583 62.000 C 59.721 62.000,59.833 62.075,59.833 62.167 C 59.833 62.943,56.752 60.102,55.585 58.250 C 55.239 57.700,54.813 57.044,54.640 56.793 C 54.036 55.917,54.052 55.383,54.689 55.105 C 54.998 54.971,55.260 54.854,55.271 54.847 C 55.283 54.839,55.546 54.940,55.855 55.070 M46.853 56.042 C 46.924 56.795,46.716 57.249,46.415 56.998 C 46.161 56.788,46.078 56.145,46.278 55.944 C 46.464 55.758,46.832 55.820,46.853 56.042 M49.396 57.172 C 50.142 58.059,49.055 59.904,48.294 59.042 C 47.789 58.469,47.775 57.762,48.257 57.189 C 48.799 56.544,48.867 56.543,49.396 57.172 " stroke="none" fill="#fbf5f3" fill-rule="evenodd"></path><path id="path2" d="M259.765 49.731 C 240.333 93.886,242.231 89.999,239.055 92.163 C 238.337 92.652,237.679 93.115,237.592 93.193 C 237.505 93.270,241.442 93.331,246.342 93.328 L 255.250 93.322 253.782 92.555 C 251.474 91.350,250.846 90.404,251.299 88.818 C 251.430 88.357,257.262 74.433,258.011 72.792 L 258.220 72.333 271.756 72.333 L 285.292 72.333 285.670 73.208 C 293.132 90.495,293.112 90.373,288.789 92.561 L 287.263 93.333 300.673 93.333 L 314.083 93.333 311.917 92.255 C 309.235 90.920,307.964 89.762,306.939 87.718 C 306.636 87.116,278.569 22.313,275.436 14.981 C 275.266 14.584,273.883 17.650,259.765 49.731 M197.874 17.816 C 199.624 18.959,201.402 20.681,201.908 21.724 C 202.681 23.320,202.678 23.190,202.630 56.750 L 202.583 88.583 202.129 89.509 C 201.643 90.498,200.478 91.555,198.462 92.834 L 197.417 93.497 203.417 93.498 C 206.717 93.499,212.055 93.450,215.280 93.390 L 221.143 93.280 219.613 92.265 C 217.974 91.177,216.468 89.465,216.267 88.460 C 216.212 88.184,216.167 80.618,216.167 71.646 L 216.167 55.333 225.708 55.338 C 238.397 55.345,238.605 55.381,239.891 57.793 L 240.490 58.917 240.494 51.833 L 240.497 44.750 240.104 45.593 C 239.662 46.542,238.615 47.535,237.500 48.062 C 236.764 48.410,236.558 48.418,226.458 48.464 L 216.167 48.512 216.167 36.084 L 216.167 23.656 228.375 23.705 L 240.583 23.754 241.656 24.153 C 243.100 24.690,245.076 26.062,245.951 27.134 L 246.667 28.012 246.667 22.506 L 246.667 17.000 221.645 17.000 L 196.624 17.000 197.874 17.816 M128.917 17.296 C 129.008 17.377,129.597 17.802,130.225 18.242 C 131.404 19.067,132.416 20.368,132.866 21.637 C 133.042 22.133,133.083 28.606,133.083 55.583 L 133.083 88.917 132.702 89.743 C 132.251 90.723,131.723 91.210,129.849 92.377 L 128.448 93.250 146.182 93.302 C 167.028 93.364,168.789 93.277,174.023 91.935 C 186.992 88.609,193.955 78.197,190.811 66.833 C 188.727 59.304,178.579 51.531,170.557 51.321 C 170.198 51.312,170.345 51.217,171.167 50.928 C 182.172 47.065,187.303 34.223,181.326 25.500 C 178.639 21.577,172.243 18.691,163.721 17.555 C 161.340 17.237,128.572 16.994,128.917 17.296 M157.973 23.162 C 167.685 24.591,171.424 28.024,171.412 35.500 C 171.405 39.582,170.607 41.620,168.019 44.168 C 164.559 47.574,160.000 48.883,150.798 49.113 L 146.500 49.220 146.500 36.201 L 146.500 23.182 147.125 23.077 C 147.469 23.020,147.825 22.947,147.917 22.916 C 148.591 22.687,155.973 22.868,157.973 23.162 M277.566 53.833 L 282.941 66.583 271.861 66.626 C 265.766 66.650,260.746 66.635,260.705 66.594 C 260.663 66.552,263.169 60.695,266.272 53.578 C 269.981 45.072,271.962 40.714,272.053 40.861 C 272.128 40.983,274.609 46.821,277.566 53.833 M164.052 55.652 C 175.180 58.097,180.802 68.001,176.671 77.885 C 173.388 85.742,162.514 88.937,147.125 86.567 L 146.500 86.471 146.500 70.802 L 146.500 55.132 154.458 55.212 C 161.819 55.286,162.540 55.319,164.052 55.652 M328.167 79.328 L 328.167 92.667 329.833 92.667 L 331.500 92.667 331.500 82.250 C 331.500 76.521,331.563 71.833,331.640 71.833 C 331.717 71.833,335.036 76.521,339.015 82.250 L 346.249 92.667 347.875 92.667 L 349.500 92.667 349.500 79.333 L 349.500 66.000 347.833 66.000 L 346.167 66.000 346.167 76.450 C 346.167 84.596,346.122 86.856,345.966 86.699 C 345.856 86.589,342.573 81.905,338.670 76.291 L 331.575 66.083 329.871 66.036 L 328.167 65.988 328.167 79.328 M355.000 79.333 L 355.000 92.667 363.250 92.667 L 371.500 92.667 371.500 91.167 L 371.500 89.667 365.000 89.667 L 358.500 89.667 358.500 85.167 L 358.500 80.667 364.500 80.667 L 370.500 80.667 370.500 79.250 L 370.500 77.833 364.500 77.833 L 358.500 77.833 358.500 73.333 L 358.500 68.833 364.917 68.833 L 371.333 68.833 371.333 67.417 L 371.333 66.000 363.167 66.000 L 355.000 66.000 355.000 79.333 M374.833 67.417 L 374.833 68.833 379.000 68.833 L 383.167 68.833 383.167 80.750 L 383.167 92.667 384.833 92.667 L 386.500 92.667 386.500 80.750 L 386.500 68.833 390.667 68.833 L 394.833 68.833 394.833 67.417 L 394.833 66.000 384.833 66.000 L 374.833 66.000 374.833 67.417 " stroke="none" fill="#04245c" fill-rule="evenodd"></path></g></svg>
      <div className="home_body">
        <div className="left">
        <Image src={business} alt="business" />
        <h1>Autenticação de dois fatores</h1>
        <p>Enviamos um código de verificação para o seu número registrado. Introduza o código para continuar.</p>
        </div>
        <div className="right">
          <form onSubmit={handleSubmit(submitForm)} className="login_form">
            <div className="header_form">
              <h1>Verifique o seu número</h1>
              <p>Introduza o código enviado para o seu telemóvel. <Link href={'/'}>Quer sair?</Link></p>
            </div>
            <div className="body_form">
            <div className="fragments_container">
              <input
                type="text"
                data-checked="false"
                className="phone_fragment"
                maxLength={1}
                {...register('field1')}
              />
              <input
                type="text"
                data-checked="false"
                className="phone_fragment"
                maxLength={1}
                {...register('field2')}
              />
              <input
                type="text"
                data-checked="false"
                className="phone_fragment"
                maxLength={1}
                {...register('field3')}
              />
              <input
                type="text"
                data-checked="false"
                className="phone_fragment"
                maxLength={1}
                {...register('field4')}
              />
              <input
                type="text"
                data-checked="false"
                className="phone_fragment"
                maxLength={1}
                {...register('field5')}
              />
              <input
                type="text"
                data-checked="false"
                className="phone_fragment"
                maxLength={1}
                {...register('field6')}
              />
            </div>
              <button type="submit" className="button_auth">
                Verificar
              </button>
              <div className='terms'><p>Não recebeu o código? <Link href="/phone">Renviar</Link>.</p></div>
            </div>
          </form>
            <p className="basic_text not_found_footer">
              © 2024 Banco de Fomento Angola
          </p>
        </div>
      </div>
    </div>
  )
}
