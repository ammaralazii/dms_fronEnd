import axios from 'axios'

const axiosIns = axios.create({
  baseURL: process.env.baseUrl,

  // timeout: 1000,

  // You can add your headers here
  // ================================
  headers: {
    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
  },
})

// --------------------------------------------------
// Each Request
// --------------------------------------------------
//
axiosIns.interceptors.request.use(onEachRequest, onEachRequestRejected)

function onEachRequest(request: any) {
  setAccessTokenInHeader(request)

  return request
}

function onEachRequestRejected(error: unknown) {
  return Promise.reject(error)
}

function setAccessTokenInHeader(request: any) {
  // Get token from localStorage
  let accessToken = ''
  try {
    accessToken = JSON.parse(localStorage.getItem('accessToken') as string)
  }
  catch (error) {

  }

  // If token is present add it to request's Authorization Header
  if (accessToken)
    request.headers.Authorization = `Bearer ${accessToken}`
  else
    request.headers.Authorization = null
}

export default axiosIns
