/* eslint-disable @typescript-eslint/no-explicit-any */
export const capitalizeName = (name: any) =>
  `${name[0].toUpperCase()}${name.substring(1)}`

export const translateCategory = (category: string) =>
  category === 'used' ? 'Usado' : 'Nuevo'

export const getErrorUrl = (err: any) => {
  return `/error?url=${err?.config?.baseURL + err?.config?.url}&method=${
    err?.config?.method
  }&data=${JSON.stringify(err?.response?.data)}`
}

export const getErrorResponse = (err: any) => {
  return {
    message: err.response.statusText,
    status: err.response.status,
    data: err.response.data,
  }
}
