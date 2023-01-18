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
  const { images, ...testimonial } = req.body
  const filterImages = req.body.images.filter((image: ImagesType) => image.code)

  try {
    const testimonialResponse = await service.post(
      `/testimonials`,
      {
        testimonial: testimonial,
      },
      { headers: { Authorization: `Bearer ${req.cookies.token}` } }
    )
    const imagesResponse = await service.put(
      `/testimonials/${testimonialResponse?.data?.testimonial?._id}/images`,
      {
        images: filterImages,
      },
      { headers: { Authorization: `Bearer ${req.cookies.token}` } }
    )
    res
      .status(200)
      .json({ product: testimonialResponse.data, images: imagesResponse.data })
  } catch (err) {
    console.log(err)
    res.status(err.response.status).json(getErrorResponse(err))
  }
}
