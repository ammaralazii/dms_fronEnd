import router from '@/router'
import { useAlertsStore } from '@/stores'
import removeItemArray from './removeItemArray'

const alertStore = useAlertsStore()

export default function hundlerErorr(_err: any) {
  const payload = {
    color: 'error',
    timeOut: 5000,
    run: true,
    text: '',
    position: {
      top: true,
      right: false,
      left: false,
      bottom: false,
    },
    update: false,
  }/* /payload */

  console.error(_err)

  if (_err?.response?.status === 422 || _err?.response?.status === 500) {
    let errors = []
    if (typeof _err?.response?.data?.message === 'object' && _err?.response?.data?.message !== null) {
      errors = Object.values(_err?.response?.data?.message)
      if (Array.isArray(errors)) {
        errors.forEach(err => {
          if (Array.isArray(err)) {
            err.forEach(r => {
              payload.text = r as any
              alertStore.$state.tosts.push(payload)
              removeItemArray(payload, 5040)
            })
          }
          else {
            payload.text = err as any
            alertStore.$state.tosts.push(payload)
            removeItemArray(payload, 5040)
          }// /if
        })// /forEach
      }
      else {
        payload.text = errors
        alertStore.$state.tosts.push(payload)
        removeItemArray(payload, 5040)
      }
    }
    else {
      payload.text = _err?.response?.data?.message
      alertStore.$state.tosts.push(payload)
      removeItemArray(payload, 5040)
    }// end of if
  }
  else if (_err?.response?.status === 401) {
    localStorage.removeItem('userData')
    localStorage.removeItem('accessToken')
    localStorage.removeItem('userAbilities')
    router.push('/login')
  }// /if
}/* /hundlerErorr */
