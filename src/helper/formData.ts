// this function for convert json data to form data .
interface arrayOfObject {
  arrayName: string
  data: any
}

// eslint-disable-next-line sonarjs/cognitive-complexity
export default function (data: any, arrayOfObject?: arrayOfObject) {
  try {
    const formData = new FormData()

    if (arrayOfObject) {
      const arr = []

      Object.keys(arrayOfObject.data).forEach(key => {
        if (arrayOfObject.data[`${key}`] || arrayOfObject.data[`${key}`] === 0 || arrayOfObject.data[`${key}`] === false)
          formData.append(`${arrayOfObject.arrayName}[${arr.length}].${key}`, arrayOfObject.data[`${key}`])
      })/* /foreach */
      if (!data) {
        for (const pair of formData.entries())
          console.log(`${pair[0]} - ${pair[1]}`)

        return formData
      }/* end of if */
    }/* end of if */

    if (data) {
      const values = Object.values(data)

      Object.keys(data).forEach((key: any, index: number) => {
        if (values[index] && !Array.isArray(values[index]))
          formData.append(`${key}`, values[index] as unknown | any)
        else if (values[index] === 0 || values[index] === false)
          formData.append(`${key}`, values[index] as any)

        else if (values[index] as unknown | any[0])
          formData.append(`${key}`, values[index] as unknown | any)
      })/* /forEach */

      if (formData.entries()) {
        for (const pair of formData.entries())
          console.log(`${pair[0]} - ${pair[1]}`)
      }/* end of if */

      return formData
    }/* /forEach */

    return
  }/* /try */
  catch (e) {
    console.error(e)
  }/* /cathc */
}/* /form data  */
