import { isEmpty, isEmptyArray, isNullOrUndefined } from '@/@core/utils/index'

// 👉 Required Validator
export const requiredValidator = (value: unknown) => {
  if (isNullOrUndefined(value) || isEmptyArray(value) || value === false)
    return 'هذا الحقل مطلوب'

  return !!String(value).trim().length || 'هذا الحقل مطلوب'
}/* /requiredValidator */

// 👉 Email Validator
export const emailValidator = (value: unknown) => {
  if (isEmpty(value))
    return true

  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  if (Array.isArray(value))
    return value.every(val => re.test(String(val))) || 'البريد الالكتروني غير صحيح'

  return re.test(String(value)) || 'البريد الالكتروني غير صحيح'
}/* /emailValidator */

// 👉 Email Validator
export const passwordValidator = (password: string) => {
  const regExp = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%&*()]).{8,}/

  let validPassword = regExp.test(password)

  if (password === undefined)
    validPassword = true

  return (
    // eslint-disable-next-line operator-linebreak
    validPassword ||
    'The password must contain uppercase and lowercase letters, symbols and numbers, and must not be less than eight characters'
  )
}/* /passwordValidator */

// 👉 Integer Validator
export const integerValidator = (value: unknown) => {
  if (isEmpty(value))
    return true

  if (Array.isArray(value))
    return value.every(val => /^-?[0-9]+$/.test(String(val))) || 'الحقل يجب ان يكون رقم صحيح'

  return /^-?[0-9]+$/.test(String(value)) || 'الحقل يجب ان يكون رقم صحيح'
}/* /integerValidator */

// 👉 date Validator
export const dateValidator = (value: unknown) => {
  const start = Date.parse('1992-01-01')
  const end = Date.now()
  const d = Date.parse(value as any)

  let date = true
  date = d.valueOf() >= start.valueOf() && d.valueOf() <= end.valueOf()

  return date || 'يجب ان يكون اقل او يساوي التاريخ الحالي'
}/* /dateValidator */

// 👉 Length Validator
export const lengthValidator = (value: unknown, minLength: number, maxLength: number) => {
  if (isEmpty(value))
    return true

  // eslint-disable-next-line no-mixed-operators
  return String(value).length >= minLength && String(value).length <= maxLength || `النص يجب ان يكون بين ${minLength} و ${maxLength} حرف`
}

export const phonValidato = (value: any) => {
  const keys = ['077', '078', '075']
  const phonePattern = /^\d{11}$/

  const is_valid_number = keys.some(elem => value.match(`^${elem}`))

  if (is_valid_number && phonePattern.test(value))
    return true

  return 'صيغة الرقم غير صحيحة'
}/* /phonValidato */
