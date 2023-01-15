type ImagesType = {
  principal: boolean
  path: string
}

export interface TestimonialInterface {
  _id: string
  comment: string
  name: string
  occupation: string
  image: ImagesType
}
