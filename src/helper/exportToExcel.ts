import { saveAs } from 'file-saver'
import * as XLSX from 'xlsx'

// 👉 Export To Excel
export const exportToExcel = async (tabrleId: string) => {
  const myTable = document.getElementById(tabrleId) as HTMLElement
  const table = myTable.querySelector('table')

  if (table) {
    // Convert the table to a worksheet
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(table)

    // Create a new workbook and add the worksheet to it
    const wb: XLSX.WorkBook = XLSX.utils.book_new()

    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')

    // Generate the Excel file as an array buffer
    const arrayBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' })

    // Convert the array buffer to a Blob
    const blob = new Blob([arrayBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })

    // Use FileSaver.js to trigger the download
    saveAs(blob, 'exported-data.xlsx')
  }
}// /exportToExcel
