import type { NextApiRequest, NextApiResponse } from 'next';
import { API_BASE_URL } from '~consts';

interface FunctionQueryParams {
  account_address?: string;
  module_name?: string;
  function_name?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const searchParams = new URLSearchParams(
      req.query as Record<string, string>
    );
    const response = await fetch(`${API_BASE_URL}/functions?${searchParams}`);
    const data = await response.json();
    res.status(200).json(data);
  } else if (req.method === 'POST') {
    const { account_address, module_name, function_name } =
      req.query as FunctionQueryParams;

    const response = await fetch(
      `${API_BASE_URL}/accounts/${account_address}/modules/${module_name}/functions/${function_name}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: req.body,
      }
    );

    res.status(response.status).end();
  }
}
