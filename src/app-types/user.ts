export type UserTokenType = {
  email: string
  exp: number
  iat: number
  sub: string
}

export type UserType = {
  _id: string
  name: string
  email: string
}
