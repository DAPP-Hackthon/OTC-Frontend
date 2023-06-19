import { NextApiRequest, NextApiResponse } from 'next';
import Moralis from 'moralis';
import { EvmChain } from '@moralisweb3/common-evm-utils';

export default async function tokenPrice(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {query} = req;

  try {
    // const chain = EvmChain.ETHEREUM;
    await Moralis.start({
      apiKey:process.env.NEXT_PUBLIC_MORALIS_API_KEY,
    });

    const responseOne = await Moralis.EvmApi.token.getTokenPrice({
      address: query.addressOne as string,
   
    });

    const responseTwo = await Moralis.EvmApi.token.getTokenPrice({
      address: query.addressTwo as string,
    });

    const usdPrices = {
      tokenOne: responseOne.raw.usdPrice,
      tokenTwo: responseTwo.raw.usdPrice,
      ratio: responseOne.raw.usdPrice / responseTwo.raw.usdPrice,
    };

    return res.status(200).json(usdPrices);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}