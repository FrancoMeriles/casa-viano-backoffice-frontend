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
  try {
    const usersResponse = await service.post(
      `/users`,
      {
        user: req.body,
      },
      { headers: { Authorization: `Bearer ${req.cookies.token}` } }
    )

    res.status(200).json({ product: usersResponse.data })
  } catch (err) {
    console.log(err)
    res.status(err.response.status).json(getErrorResponse(err))
  }
}
