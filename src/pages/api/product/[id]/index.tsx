// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import service from '@services/bff'
import { getErrorResponse } from '@utils/index'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query

  try {
    const response = await service.get(`/products/${id}`)
    res.status(200).json({ ...response.data })
  } catch (err) {
    console.log(err)
    res.status(err.response.status).json(getErrorResponse(err))
  }
}
