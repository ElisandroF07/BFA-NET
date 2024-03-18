import Dashbaord from '@/pages/dashboard/page';
import nextAuthOptions from '@/libs/nextAuthOptions';
import { getServerSession } from 'next-auth';

export default async function Dashboard() {
  const session = await getServerSession(nextAuthOptions)
  const username: string = `${session?.user.personalData.name[0]} ${session?.user.personalData.name[session?.user.personalData.name.length - 1]}`
  const biNumber: string = `${session?.user.biNumber}`
  const email: string =`${session?.user.email}`
  const birthDate: string = `${session?.user.personalData.birthDate}`
  const country: string = `${session?.user.address.country}`
  const address: string = `${session?.user.address.full_address}`
  const fullName: string = `${session?.user.personalData.name.join(' ')}`
  return <Dashbaord fullName={fullName} username={username} biNumber={biNumber} email={email} birthDate={birthDate} country={country} address={address}/>;
}