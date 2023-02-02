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
  const url = `${API_BASE_URL}/block-stacks/${address}/stacks/${id}`;
  const headers = {
    'Content-Type': 'application/json',
    'aptos-auth': address as string,
  };

  if (req.method === 'GET') {
    const response = await fetch(url, {
      headers,
    });
    const data = await response.json();

    res.status(200).json(data);
  } else if (req.method === 'PUT') {
    const response = await fetch(url, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(req.body),
    });
    res.status(response.status).end();
  } else if (req.method === 'DELETE') {
    const response = await fetch(url, {
      method: 'DELETE',
      headers,
    });
    res.status(response.status).end();
  }
}
