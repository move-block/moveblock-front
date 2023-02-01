import type { NextApiRequest, NextApiResponse } from "next";
import { APTOS_BASE_URL } from "~consts";


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // const { name, account } = req.query as ModuleQueryParams;
  // if (!name || !account) {
  //   return res.status(400).json({ error: "Missing required query params" });
  // }
  if (req.method === "POST") {
    const response = await fetch(
      `${APTOS_BASE_URL}/transactions/simulate`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body),
      }
    );
    const  data  = await response.json();
    console.log(data)
    res.status(200).json(data);
  }

}
