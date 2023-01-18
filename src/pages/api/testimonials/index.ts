// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import service from '@services/bff'
import { getErrorResponse } from '@utils/index'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const response = await service.get(`/testimonials`)
    res.status(200).json({ ...response.data })
  } catch (err) {
    res.status(err.response.status).json(getErrorResponse(err))
  }
}
