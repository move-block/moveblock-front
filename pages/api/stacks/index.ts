import type { NextApiRequest, NextApiResponse } from 'next';
import { API_BASE_URL } from '~consts';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { address, ...params } = req.query;
  const url = `${API_BASE_URL}/block-stacks/${address}`;
  const headers = {
    'Content-Type': 'application/json',
    'aptos-auth': address as string,
  };

  if (req.method === 'GET') {
    const searchParams = new URLSearchParams(params as Record<string, string>);
    const response = await fetch(`${url}?${searchParams}`, {
      headers,
    });
    const data = await response.json();

    res.status(200).json(data);
  } else if (req.method === 'POST') {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(req.body),
    });
    const data = await response.text();

    res.status(response.status).json({
      id: data,
    });
  }
}
