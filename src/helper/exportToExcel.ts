import { saveAs } from 'file-saver'
import * as XLSX from 'xlsx'

// Export data to Excel
export const exportToExcel = (
  data?: any[] | null,
  tableId?: string | null,
  fileName?: string,
  indexArr?: number[],
  colWidth?: number,
  removeString?: string,
) => {
  let ws: XLSX.WorkSheet
  const wb: XLSX.WorkBook = XLSX.utils.book_new()

  // If data is provided as an array of objects, export it
  if (data && data.length > 0) {
    function processString(inputString: string) {
      // Remove "Accessor" from the string
      const withoutAccessor = inputString.replace(removeString, '')

      // Add a space between the two resulting words
      return withoutAccessor.replace(/([a-z])([A-Z])/g, '$1 $2')
    }// /if

    if (indexArr.length > 0) {
      data = data.map(item => {
        indexArr.forEach(deletekey => {
          if (deletekey in item)
            delete item[deletekey]
        })// /forEach

        return item
      })// /map
    }// /if

    ws = XLSX.utils.json_to_sheet(data)

    // Apply formatting as needed (e.g., column width, bold headers, alignment)
    const columnWidth = colWidth
    const wscols = []

    Object.keys(data[0]).forEach((key, index) => {
      if (!indexArr.includes(index)) {
        wscols.push({ wch: columnWidth })

        const headerCellAddress = `${XLSX.utils.encode_col(index)}1`
        if (!ws[headerCellAddress].s)
          ws[headerCellAddress].s = { font: { bold: true } }

        else
          ws[headerCellAddress].s.font = { bold: true }
      }
    })

    ws['!cols'] = wscols
  }
  else if (tableId) {
    // If data is not provided, and a tableId is given, export the table
    const myTable = document.getElementById(tableId) as HTMLElement
    const table: any = myTable.querySelector('table')
    const newTable = document.createElement('table')

    newTable.innerHTML = table?.innerHTML

    for (let i = 0; i < newTable.rows.length; i++) {
      indexArr.forEach((index: number) => {
        let cell
        if (i === 0)
          cell = newTable.rows[i].querySelectorAll('th')[index]

        else
          cell = newTable.rows[i].querySelectorAll('td')[index]

        if (cell) {
          cell.innerHTML = ''
          cell.remove()
        }
      })
    }

    // Convert the table to a worksheet
    ws = XLSX.utils.table_to_sheet(newTable)
  }
  else {
    // If neither data nor tableId is provided, return without exporting
    console.error('No data or tableId provided for export.')

    return
  }

  // Append the worksheet to the workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')

  // Generate the Excel file as an array buffer
  const arrayBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })

  // Convert the array buffer to a Blob
  const blob = new Blob([arrayBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })

  // Use FileSaver.js to trigger the download
  saveAs(blob, `${fileName}.xlsx`)
}
