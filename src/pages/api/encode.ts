import { NextApiRequest, NextApiResponse } from "next";
//import { brotliCompressSync } from "zlib";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  function buf2bin(buffer: Buffer): string {
    return BigInt("0x" + buffer.toString("hex"))
      .toString(2)
      .padStart(buffer.length * 8, "0");
  }
  const { text } = req.body;
  const binaryText = Buffer.from(text, "utf16le");
  //const binaryTextCompress = brotliCompressSync(binaryText);
  const binary = buf2bin(binaryText);
  res.status(200).json({ binary });
}
