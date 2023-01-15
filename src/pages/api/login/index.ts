// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { serialize } from 'cookie'
import jwt from 'jsonwebtoken'
import service from '@services/bff'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const response = await service.post(`/login`, {
    email: req.body.email,
    password: req.body.password,
  })
  console.log('herere')
  console.log(response.data)
  const token = jwt.sign(
    {
      ...req.body,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
    },
    'secret'
  )
  console.log('en el login')
  console.log(process.env.JWT_SECRET)

  const serialized = serialize('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 1000 * 60 * 60 * 24 * 30,
    path: '/',
  })

  res.setHeader('Set-Cookie', serialized)
  res.status(200).json({ name: 'John Doe' })
}
