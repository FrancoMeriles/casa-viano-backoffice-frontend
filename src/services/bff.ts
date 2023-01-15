import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://89.117.32.28:3000/api/v1',
})

export default instance
