import axiosIns from '@/plugins/axios'
import type { State } from '@/types/store/state-info'
import { defineStore } from 'pinia'

export const useAlertsStore = defineStore('alerts', {
  state: (): State => {
    return {
      tosts: [], /* /tost */

      roles: [], // /roles,
      cases: [],
      userCount: 0,
      activeUserCount: 0,
      permissionItems: [],
    }/* /return */
  }, /* /state */

  actions: {
    async getAllMasterData() {
      try {
        const roleResult = await axiosIns.get('role')

        if (roleResult.status === 200)
          this.roles = roleResult.data.data

        const caseResult = await axiosIns.get('case')

        if (caseResult.status === 200)
          this.cases = caseResult.data.data

        const userCount = await axiosIns.get('total_users')

        if (userCount.status === 200)
          this.userCount = userCount.data.data

        const activeUserCount = await axiosIns.get('active_users')

        if (activeUserCount.status === 200)
          this.activeUserCount = activeUserCount.data.data
      }
      catch (e) {
        console.error('Error : ', e)
      }// /try catch
    }, // /getAllMasterData
    async fetchPermissions() {
      const permission = await axiosIns.get('permission')
      if (permission.status === 200)
        return permission?.data?.data
    },
    async fetchDevices(params: any) {
      return axiosIns.get('device', { params })
    }, // /fetchDevices
    async fetchCards(params: any) { return axiosIns.get('card', { params }) }, // /fetchDevices
  }, /* /action */
})/* /useAlertsStore */
