import { NextApiRequest, NextApiResponse } from 'next';
import { parseCookies } from 'nookies';

export default async function protectedRoute(req: NextApiRequest, res: NextApiResponse) {
  const { "bfatoken.token": token } = parseCookies({ req });

  if (!token) {
    return res.status(302).json({ redirect: '/login' });
  }

  return res.status(200).end();
}