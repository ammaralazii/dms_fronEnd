interface requestDate {
  [x: string]: Date | string
}/* /requestDate */

const getTime = (date?: Date) => {
  return date != null ? date.getTime() : 0
}/* /getTime */

// sort data from greatest to least
export default function (dates: requestDate[], dateField: string) {
  return dates.sort((a, b) => {
    return getTime(new Date(b[dateField])) - getTime(new Date(a[dateField]))
  })/* /return */
}/* /dates function  */

