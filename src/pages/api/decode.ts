import { NextApiRequest, NextApiResponse } from "next";
//import { brotliCompressSync } from "zlib";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  function bin2buf(binary: string): Buffer {
    return Buffer.from(BigInt("0b" + binary).toString(16), "hex");
  }
  const { binary } = req.body;
  const text = bin2buf(binary).toString("utf16le");
  res.status(200).json({ text });
}
