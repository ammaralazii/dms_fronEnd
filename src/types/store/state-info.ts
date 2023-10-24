import type { cases } from '../interfaces/cases'
import type { companyAdress } from '../interfaces/company-address'
import type { roles } from '../interfaces/roles'

export interface State {
  tosts: any
  roles: roles[]
  cases: cases[]
  userCount: number
  activeUserCount: number
  permissionItems: any[]
  deviceId: string
  personalItem: any
  personalAddress: any
  companyAddress: companyAdress
}// /state interface
