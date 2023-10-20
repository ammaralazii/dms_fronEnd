export default function (data: any[]) {
  if (data) {
    return data.sort((a: any, b: any) => {
      const nameA = a?.name?.common?.toLowerCase()
      const nameB = b?.name?.common?.toLowerCase()
      if (nameA < nameB)
        return -1

      if (nameA > nameB)
        return 1

      return 0
    })
  }

  return []
}// /export by text
