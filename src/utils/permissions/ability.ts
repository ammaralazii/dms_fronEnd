import { Ability } from '@casl/ability'
import type { UserAbility } from './AppAbility'

// this will be used to provide access to authorized screens for users that have it by default.
export const initialAbility: UserAbility[] = [
  // like login screen
  {
    action: 'read',
    subject: 'Auth',
  },

  // like dashboard screen
  {
    action: 'manage',
    subject: 'Auth',
  },
]

//  Read ability from localStorage
// 👉 Handles auto fetching previous abilities if already logged in user
// ℹ️ You can update this if you store user abilities to more secure place
// ❗ Anyone can update localStorage so be careful and please update this
const stringifiedUserAbilities = localStorage.getItem('userAbilities')
const existingAbility = stringifiedUserAbilities ? JSON.parse(stringifiedUserAbilities) : null

export default new Ability(existingAbility || initialAbility)
