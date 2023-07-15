import type { UserAbility } from '@/plugins/casl/AppAbility'
import { initialAbility } from './ability'

export default function (permissions: any[]): UserAbility[] {
  const abilities: UserAbility[] = [...initialAbility]

  permissions.forEach((permission: { PermissionNameEn: string }) => {
    const actionAndSubject: any = permission?.PermissionNameEn?.split('-')

    abilities.push({
      action: actionAndSubject[1],
      subject: actionAndSubject[0],
    })
  })

  return abilities
}// /permissions
