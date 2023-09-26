export interface deviceInfo {
  DeviceId?: string
  BoxNoMain: string | number
  BoxNoSub: string | number
  DeviceSerialNumber: string
  DeviceMAC: string
  FWVersion: string
  DeciveImportDate?: Date
  DeviceRecivedDate: Date
  AgreementCMC?: string
  DeviceType?: string
  DeviceManufctur: string
  CostomerGroup?: string
  StatusLVN?: string
  created_at?: Date
  updated_at?: Date
  files?: any[]
  accessories?: any[]
  IMEI: string | number
  DeviceCode?: string
}
