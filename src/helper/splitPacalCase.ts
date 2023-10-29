export default function (pascalCaseString: string | unknown) {
  return splitPascalCase(pascalCaseString as any)
}// /function

function splitPascalCase(inputString: string) {
  return inputString.split(/(?=[A-Z])/).join(' ')
}// /splitPascalCase
