export default function (obj: any) {
  const value = Object.values(obj)
  const key = Object.keys(obj)
  const newObj: any = {}

  for (let i = 0; i < value.length; i++) {
    if (value[i])
      newObj[key[i]] = value[i]
  }// /for loop

  if (newObj)
    return newObj
  else
    return null
}
