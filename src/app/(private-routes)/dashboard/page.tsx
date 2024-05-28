import Dashbaord from '@/pages/dashboard/page';
import nextAuthOptions from '@/libs/nextAuthOptions';
import { getServerSession } from 'next-auth';
import api from '@/services/api';
import Custom500INT from '@/pages/500INT/page';
import Inative from '@/pages/inative/page';

export default async function Dashboard() {
  const session = await getServerSession(nextAuthOptions)
  try {
    const response = await api.get(`/getBiNumber/${session?.user.email}`)
    const user = await api.get(`/getUserData/${response.data.biNumber}`);
    const card = await api.get(`/getCardData/${response.data.biNumber}`);
    const account = await api.get(`/getAccountData/${response.data.biNumber}`);
    if (account.data.account.state === "Ativa") {
      return <Dashbaord email={session?.user.email || ""} biNumber={response.data.biNumber} userData={user.data.client} cardData={card.data.card} accountData={account.data.account}/>;
    } 
    else {
      return <Inative/>
    }
  }
  catch (error) {
    //console.log(error)
    return <Custom500INT/>
  }
  
}