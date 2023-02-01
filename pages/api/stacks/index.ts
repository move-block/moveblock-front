import type { NextApiRequest, NextApiResponse } from 'next';
import { API_BASE_URL } from '~consts';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { address, ...params } = req.query;
  const searchParams = new URLSearchParams(params as Record<string, string>);
  const response = await fetch(
    `${API_BASE_URL}/block-stacks/${address}?${searchParams}`,
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
