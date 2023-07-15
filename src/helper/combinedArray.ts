export default function (data: any) {
  const combinedArray: any = []

  for (let i = 0; i < data.length; i++)
    combinedArray.push(...data[i])

  return combinedArray
}
