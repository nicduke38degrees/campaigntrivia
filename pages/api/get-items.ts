// pages/api/transformed-data.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { accumulateTransformedData } from '../../lib/build-items';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const data = await accumulateTransformedData();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while fetching data', error: JSON.stringify(error) });
  }
}
