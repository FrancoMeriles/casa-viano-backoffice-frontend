export type AttributesType = {
  key: string
  value: string
}

export type ImagesType = {
  _id: string
  principal: boolean
  path: string
  code: string
}

export interface ProductsInterface {
  _id: string
  slug: string
  name: string
  description: number
  body: number
  is_available: boolean
  condition: string
  featured: boolean
  attributes: AttributesType[]
  images: ImagesType[]
}
