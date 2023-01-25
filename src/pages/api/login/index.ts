// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { serialize } from 'cookie'
// import jwt from 'jsonwebtoken'
import service from '@services/bff'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const response = await service.post(`/login`, {
      email: req.body.email,
      password: req.body.password,
    })
    const serialized = serialize('token', response.data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 30,
      path: '/',
    })

    res.setHeader('Set-Cookie', serialized)
    res.status(200).json({ data: response.data })
  } catch (error) {
    return res.status(error.response.data.code).json(error.response.data)
  }
}
