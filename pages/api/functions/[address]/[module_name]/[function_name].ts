import type { NextApiRequest, NextApiResponse } from 'next';
import { API_BASE_URL } from '~consts';

interface FunctionQueryParams {
  address: string;
  module_name: string;
  function_name: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { address, module_name, function_name } =
    req.query as unknown as FunctionQueryParams;
  const response = await fetch(
    `${API_BASE_URL}/functions/${address}/${module_name}/${function_name}`
  );
  const data = await response.json();
  res.status(200).json(data);
}
