import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  console.log('evento');
  return res.status(200).json({ message: 'test' });
};
