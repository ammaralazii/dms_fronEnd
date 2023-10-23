import type { cases } from '../interfaces/cases'
import type { personalAdress } from '../interfaces/personal-address'
import type { personalInfo } from '../interfaces/personal-info'
import type { roles } from '../interfaces/roles'

export interface State {
  tosts: any
  roles: roles[]
  cases: cases[]
  userCount: number
  activeUserCount: number
  permissionItems: any[]
  deviceId: string
  personalInformation: personalAdress | personalInfo | any
}// /state interface
