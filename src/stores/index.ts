import axiosIns from '@/plugins/axios'
import type { State } from '@/types/store/state-info'
import { defineStore } from 'pinia'
import { handleError } from 'vue'

const baseUrl = 'http://crm.project/api/'

export const useAlertsStore = defineStore('alerts', {
  state: (): State => {
    return {
      tosts: [], /* /tost */

      roles: [], // /roles,
      cases: [],
      userCount: 0,
      activeUserCount: 0,
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

        const userCount = await axiosIns.get(`${baseUrl}total_users`)

        if (userCount.status === 200)
          this.userCount = userCount.data.data

        const activeUserCount = await axiosIns.get(`${baseUrl}active_users`)

        if (activeUserCount.status === 200)
          this.activeUserCount = activeUserCount.data.data
      }
      catch (e) {
        handleError(e)
      }// /try catch
    }, // /getAllMasterData
  }, /* /action */
})/* /useAlertsStore */
