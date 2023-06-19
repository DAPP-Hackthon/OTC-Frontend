import type { NextApiRequest, NextApiResponse } from 'next';
import Moralis from 'moralis';
import { EvmChain } from '@moralisweb3/common-evm-utils';

export default async function getPrice(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { address } = req.query;
  try {
    const chain = EvmChain.ETHEREUM;

    await Moralis.start({
      apiKey: process.env.NEXT_PUBLIC_MORALIS_API_KEY,
    });

    const response = await Moralis.EvmApi.token.getTokenPrice({
      address: address as string,
      chain,
    });
    console.log(response.raw)
    res.status(200).json(response);
  } catch (e) {
    console.error(e);
  }
}