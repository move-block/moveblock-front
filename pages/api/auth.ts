import type { NextApiRequest, NextApiResponse } from 'next';
import { API_BASE_URL } from '~consts';

type QueryProps = {
  accountAddress: string;
  moduleAddress: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { accountAddress, moduleAddress } = req.query as unknown as QueryProps;
  const response = await fetch(
    `${API_BASE_URL}/accounts/${accountAddress}/contains/${moduleAddress} `
  );
  const isAuthorized = await response.text();

  res.status(200).send(isAuthorized);
}
