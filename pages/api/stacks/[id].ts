import type { NextApiRequest, NextApiResponse } from 'next';
import { API_BASE_URL } from '~consts';

interface QueryProps {
  id: string;
  address: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id, address } = req.query as unknown as QueryProps;
  const response = await fetch(
    `${API_BASE_URL}/block-stacks/${address}/stacks/${id}`,
    {
      headers: {
        'Content-Type': 'application/json',
        'aptos-auth': address as string,
      },
    }
  );
  const data = await response.json();

  res.status(200).json(data);
}
