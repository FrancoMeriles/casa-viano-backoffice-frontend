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
  const { images, ...product } = req.body
  const filterImages = req.body.images.filter(
    (image: ImagesType) => image.principal && image.code
  )

  try {
    const productResponse = await service.post(
      `/products`,
      {
        product: product,
      },
      { headers: { Authorization: `Bearer ${req.cookies.token}` } }
    )
    console.log('product response')
    console.log(productResponse)
    const imagesResponse = await service.put(
      `/products/${productResponse?.data?.product?._id}/images`,
      {
        images: filterImages,
      },
      { headers: { Authorization: `Bearer ${req.cookies.token}` } }
    )
    console.log('images response')
    console.log(imagesResponse)
    res.status(200).json({ ...productResponse.data })
  } catch (err) {
    console.log('fallop')
    console.log(err)
    res.status(err.response.status).json(getErrorResponse(err))
  }
}
