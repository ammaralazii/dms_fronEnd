export default function (oldObj: any, newObj: any) {
  const oldKeys = Object.keys(oldObj)
  const obj: any = {}

  for (let i = 0; i < oldKeys.length; i++) {
    if (newObj[oldKeys[i]])
      obj[oldKeys[i]] = newObj[oldKeys[i]]
    else
      obj[oldKeys[i]] = null
  }// /for

  return obj
}// /function
