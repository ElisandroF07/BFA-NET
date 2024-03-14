import axios from "axios";
import { parseCookies } from "nookies";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export  function getAPIClient(ctx?: any) {
  const { 'nextauth.token': token } = parseCookies(ctx)

  const api = axios.create({
    baseURL: 'http://localhost:5000'
  })

  api.interceptors.request.use(config => {
    console.log(config);
    return config;
  })

  if (token) {
    api.defaults.headers.Authorization = `Bearer ${token}`;
  }

  return api;
}