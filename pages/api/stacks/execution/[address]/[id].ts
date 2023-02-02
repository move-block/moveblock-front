import type { NextApiRequest, NextApiResponse } from 'next';
import { API_BASE_URL } from '~consts';

interface QueryProps {
  address: string;
  id: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const { id, address } = req.query as unknown as QueryProps;
  const response = await fetch(
    `${API_BASE_URL}/block-stacks/${address}/execute/stacks/${id} `,
    {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'aptos-auth': address,
      },
    }
  );
  const data = await response.text();
  console.log(data);
  res.status(response.status).send(data.replaceAll("\"", ""));
}
