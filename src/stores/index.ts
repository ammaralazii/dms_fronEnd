import type { State } from '@/types/store/state-info'
import { defineStore } from 'pinia'

export const useAlertsStore = defineStore('alerts', {
  state: (): State => {
    return {
      tosts: [
      ], /* /tost */
    }/* /return */
  }, /* /state */

  actions: {

  }, /* /action */
})/* /useAlertsStore */
