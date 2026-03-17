import { NextApiRequest, NextApiResponse } from "next";
import { conn } from "@/lib/db";

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const response = await conn.query("SELECT NOW()");
  
  console.log(response);

  //return res.json({ message: "DB connected..." });
}
