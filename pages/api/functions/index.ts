import type { NextApiRequest, NextApiResponse } from 'next';
import { PaginatedQueryProps } from 'src/Api';
import { API_BASE_URL } from '~consts';

interface FunctionPostParams {
  account_address?: string;
  module_name?: string;
  function_name?: string;
}

type FunctionQueryParams = PaginatedQueryProps & {
  keyword: string;
  is_entry: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const { limit, offset, keyword, is_entry } =
      req.query as unknown as FunctionQueryParams;

    const queryParams = {
      limit: limit?.toString(),
      offset: offset?.toString(),
      keyword,
    };

    const searchParams = new URLSearchParams(
      Object.entries(queryParams).filter(([_, value]) => !!value) as [
        string,
        string
      ][]
    );
    const response = await fetch(
      `${API_BASE_URL}/functions${
        is_entry === 'true' ? '/entry-functions' : ''
      }?${searchParams}`
    );
    const data = await response.json();
    res.status(200).json(data);
  } else if (req.method === 'POST') {
    const { account_address, module_name, function_name } =
      req.query as FunctionPostParams;

    const response = await fetch(
      `${API_BASE_URL}/accounts/${account_address}/modules/${module_name}/functions/${function_name}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body),
      }
    );

    res.status(response.status).end();
  }
}
