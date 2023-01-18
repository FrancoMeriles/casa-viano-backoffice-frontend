/* eslint-disable @typescript-eslint/no-unused-vars */
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import service from '@services/bff'
import { getErrorResponse } from '@utils/index'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const imageResponse = await service.put(
      `/products/${req.query.id}/images`,
      {
        ...req.body,
      },
      {
        headers: {
          Authorization: `Bearer ${req.cookies.token}`,
        },
      }
    )

    res.status(200).json({ product: imageResponse.data })
  } catch (err) {
    console.log(err)
    res.status(err.response.status).json(getErrorResponse(err))
  }
}
