// pages/api/authMiddleware.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { parseCookies } from 'nookies';

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const  authMiddleware = (handler: (arg0: NextApiRequest, arg1: NextApiResponse) => any) => async (req: NextApiRequest, res: NextApiResponse) => {
  const { "bfatoken.token": token } = parseCookies({ req });

  if (!token) {
    return res.status(302).json({ redirect: '/login' });
  }

  return handler(req, res);
};

export default authMiddleware;
