import type { NextApiRequest, NextApiResponse } from "next";
import { API_BASE_URL } from "~consts";

interface ModuleQueryParams {
  name?: string;
  account?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { name, account } = req.query as ModuleQueryParams;
  if (!name || !account) {
    return res.status(400).json({ error: "Missing required query params" });
  }
  if (req.method === "POST") {
    const response = await fetch(
      `${API_BASE_URL}/accounts/${account}/modules/${name}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body),
      }
    );
    res.status(response.status).end();
  } else {
    const response = await fetch(
      `${API_BASE_URL}/accounts/${account}/modules/${name}`
    );
    const { data } = await response.json();
    res.status(200).json(data);
  }
}
