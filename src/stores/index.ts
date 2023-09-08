import axiosIns from '@/plugins/axios'
import type { State } from '@/types/store/state-info'
import { defineStore } from 'pinia'
import { handleError } from 'vue'

const baseUrl = 'http://127.0.0.1:8000/api/'

export const useAlertsStore = defineStore('alerts', {
  state: (): State => {
    return {
      tosts: [], /* /tost */

      roles: [], // /roles,
      cases: [],
    }/* /return */
  }, /* /state */

  actions: {
    async getAllMasterData() {
      try {
        const roleResult = await axiosIns.get(`${baseUrl}role`)

        if (roleResult.status === 200)
          this.roles = roleResult.data.data

        const caseResult = await axiosIns.get(`${baseUrl}case`)

        if (caseResult.status === 200)
          this.cases = caseResult.data.data
      }
      catch (e) {
        handleError(e)
      }// /try catch
    }, // /getAllMasterData
  }, /* /action */
})/* /useAlertsStore */
