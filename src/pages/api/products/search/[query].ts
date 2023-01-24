/* eslint-disable @typescript-eslint/no-unused-vars */
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import service from '@services/bff'
import { getErrorResponse } from '@utils/index'
import { ImagesType } from '@app-types/products'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const query = req.query.query
  try {
    const productResponse = await service.get(`/products/search`, {
      params: { name: query },
    })
    res.status(200).json({ ...productResponse.data })
  } catch (err) {
    console.log(err)
    res.status(err.response.status).json(getErrorResponse(err))
  }
}
