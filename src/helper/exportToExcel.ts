import { saveAs } from 'file-saver'
import * as XLSX from 'xlsx'

// 👉 Export To Excel
export const exportToExcel = async (
  tableId: string,
  fileName: string,
  indexArr: number[],
  colWidth: number,
) => {
  const myTable = document.getElementById(tableId) as HTMLElement
  const table: any = myTable.querySelector('table')

  const newTable = document.createElement('table')

  newTable.innerHTML = table?.innerHTML

  if (newTable.innerHTML) {
    for (let i = 0; i < newTable.rows.length; i++) {
      indexArr.forEach((index: number) => {
        let cell
        if (i === 0)
          cell = newTable.rows[i].querySelectorAll('th')[index]
        else cell = newTable.rows[i].querySelectorAll('td')[index]

        if (cell) {
          cell.innerHTML = ''
          cell.remove()
        }
      })
    }

    // Convert the table to a worksheet
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(newTable)

    // Set fixed column width
    const columnWidth = colWidth // Set the desired width in pixels
    const wscols = []

    // Calculate the number of columns in the worksheet
    const numberOfColumns = XLSX.utils.decode_range(ws['!ref']).e.c + 1

    for (let i = 0; i < numberOfColumns; i++)
      wscols.push({ wch: columnWidth })

    ws['!cols'] = wscols

    // Apply bold formatting to the header cells
    for (let i = 0; i < numberOfColumns; i++) {
      const headerCellAddress = `${XLSX.utils.encode_col(i)}1` // Assuming the header row is the first row (row 1)
      if (ws[headerCellAddress] && !ws[headerCellAddress].s)
        ws[headerCellAddress].s = { font: { bold: true } }
      else if (ws[headerCellAddress] && ws[headerCellAddress].s)
        ws[headerCellAddress].s.font = { bold: true }
    }

    // Set text alignment for cells (e.g., center-aligned)
    for (let r = 2; r <= ws['!ref'].split(':')[1].replace(/\D/g, ''); r++) {
      for (let c = 0; c < numberOfColumns; c++) {
        const cellAddress = `${XLSX.utils.encode_col(c)}${r}`
        if (ws[cellAddress]) {
          if (!ws[cellAddress].s)
            ws[cellAddress].s = {}
          ws[cellAddress].s.alignment = { horizontal: 'right' } // Adjust alignment as needed
        }
      }
    }

    // Create a new workbook and add the worksheet to it
    const wb: XLSX.WorkBook = XLSX.utils.book_new()

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
}

