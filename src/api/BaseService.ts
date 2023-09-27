import hundlerErorr from '@/helper/hundlerErorr'
import axiosIns from '@/plugins/axios'
import axios from 'axios'

// TODO: Use this service for the entire project
const baseUrl = process.env.BaseUrl

export const baseService = {
  async get(url: string): Promise<object | null> {
    try {
      const result = await axiosIns.get(url)

      return result.data
    }
    catch (e) {
      hundlerErorr(e)

      return []
    }/* /try catch */
  },
  async create(url: string, data: object): Promise<object | null> {
    try {
      const result = await axiosIns.post(url, data)

      return result.data
    }
    catch (e) {
      hundlerErorr(e)

      return []
    }/* /try catch */
  },

  async update(url: string, data: object, id: string): Promise<object | null> {
    try {
      const result = await axiosIns.post(`${url}/${id}`, data)

      return result.data
    }
    catch (e) {
      hundlerErorr(e)

      return []
    }/* /try catch */
  },

  async put(url: string, data: object, id: string): Promise<object | null> {
    try {
      const result = await axiosIns.put(`${url}/${id}`, data)

      return result.data
    }
    catch (e) {
      hundlerErorr(e)

      return []
    }/* /try catch */
  },

  async delete(url: string, data: any): Promise<object | null> {
    try {
      console.log('data : ', data)

      const result = await axiosIns.delete(url, {
        data,
      })

      return result.data
    }
    catch (e) {
      hundlerErorr(e)

      return []
    }/* /try catch */
  },

  async checkEmail(url: string): Promise<object | null> {
    try {
      const result = await axios.get(`${baseUrl}api/${url}`)

      return result.data
    }
    catch (e: any) {
      hundlerErorr(e)

      return []
    }/* /try catch */
  }, // /checkEmail
}/* /baseService */
