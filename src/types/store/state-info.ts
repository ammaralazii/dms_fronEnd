import type { cases } from '../interfaces/cases'
import type { companyAdress } from '../interfaces/company-address'
import type { otherInformationInfo } from '../interfaces/other-information-info'
import type { roles } from '../interfaces/roles'
import type { sarsInfo } from '../interfaces/sars-info'

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
  companyInfo: any
  authorizedInfo: any[]
  foreignInf: any
  otherInformation: otherInformationInfo
  foreign_id: string
  sarsInfo: sarsInfo
  newAuthorizedInfo: otherInformationInfo[]
  allCompanyColumns: string[]
  allForeignClumns: string[]
}// /state interface
