// eslint-disable-next-line sonarjs/cognitive-complexity
export function objectToFormData(
  obj: { [key: string]: any },
  formData?: FormData,
  parentKey?: string,
) {
  formData = formData || new FormData()
  parentKey = parentKey || ''

  const idxs: { [key: string]: number } = {}

  const append = (key: string, val: string) => {
    if (!val)
      return
    formData?.append(key, val)
  }

  for (const key in obj) {
    if (Array.isArray(obj[key])) {
      for (let i = 0; i < obj[key].length; i++) {
        if (!Object.hasOwn(idxs, key))
          idxs[key] = 0
        else idxs[key]++

        const arrayKey = parentKey ? `${parentKey}[${key}][${idxs[key]}]` : `${key}[${idxs[key]}]`
        const arrayVal = obj[key][i]

        if (typeof arrayVal === 'object' && !(arrayVal instanceof File))
          objectToFormData(arrayVal, formData, arrayKey)

        else append(arrayKey, arrayVal)
      }
    }
    else if (typeof obj[key] === 'object' && !(obj[key] instanceof File)) {
      objectToFormData(obj[key], formData, parentKey ? `${parentKey}[${key}]` : key)
    }
    else {
      const value = obj[key] == null ? '' : obj[key]
      const finalKey = parentKey ? `${parentKey}[${key}]` : key

      append(finalKey, value)
    }
  }

  return formData
}

