/**
 * Export utilities for CSV and PDF generation
 */

// CSV Export Function
export function exportToCSV<T extends Record<string, any>>(
  data: T[],
  filename: string,
  columns?: { key: keyof T; label: string }[]
) {
  if (data.length === 0) {
    console.warn('No data to export')
    return
  }

  // Use provided columns or auto-detect from first row
  const headers = columns
    ? columns.map((col) => col.label)
    : Object.keys(data[0])

  const keys = columns
    ? columns.map((col) => col.key as string)
    : Object.keys(data[0])

  // Create CSV content
  const csvContent = [
    // Header row
    headers.join(','),
    // Data rows
    ...data.map((row) =>
      keys
        .map((key) => {
          const value = row[key]
          // Handle dates
          if (value instanceof Date) {
            return `"${value.toLocaleDateString()}"`
          }
          // Handle strings with commas or quotes
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`
          }
          // Handle null/undefined
          if (value === null || value === undefined) {
            return ''
          }
          return value
        })
        .join(',')
    ),
  ].join('\n')

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// PDF Export Function (simple implementation without external library)
export function exportToPDF(
  title: string,
  data: Record<string, any>[],
  filename: string
) {
  // Create HTML content for PDF
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>${title}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 40px;
          }
          h1 {
            color: #171717;
            border-bottom: 2px solid #171717;
            padding-bottom: 10px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th {
            background-color: #171717;
            color: white;
            padding: 12px;
            text-align: left;
            font-weight: 600;
          }
          td {
            padding: 10px 12px;
            border-bottom: 1px solid #E5E5E5;
          }
          tr:nth-child(even) {
            background-color: #FAFAFA;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #E5E5E5;
            color: #737373;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
        <table>
          <thead>
            <tr>
              ${Object.keys(data[0] || {})
                .map((key) => `<th>${key.replace(/_/g, ' ').toUpperCase()}</th>`)
                .join('')}
            </tr>
          </thead>
          <tbody>
            ${data
              .map(
                (row) => `
              <tr>
                ${Object.values(row)
                  .map((value) => {
                    if (value instanceof Date) {
                      return `<td>${value.toLocaleDateString()}</td>`
                    }
                    return `<td>${value ?? ''}</td>`
                  })
                  .join('')}
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
        <div class="footer">
          <p>Manara - Enterprise Facility Management System</p>
          <p>Total Records: ${data.length}</p>
        </div>
      </body>
    </html>
  `

  // Open print dialog
  const printWindow = window.open('', '_blank')
  if (printWindow) {
    printWindow.document.write(htmlContent)
    printWindow.document.close()

    // Wait for content to load, then print
    printWindow.onload = () => {
      printWindow.print()
    }
  }
}

// Format data for export (remove unnecessary fields, format dates)
export function prepareDataForExport<T extends Record<string, any>>(
  data: T[],
  excludeFields: string[] = []
): Record<string, any>[] {
  return data.map((row) => {
    const cleaned: Record<string, any> = {}

    Object.entries(row).forEach(([key, value]) => {
      // Skip excluded fields
      if (excludeFields.includes(key)) {
        return
      }

      // Format dates
      if (value instanceof Date) {
        cleaned[key] = value.toLocaleDateString()
      }
      // Format numbers with currency symbol if it's an amount field
      else if (
        typeof value === 'number' &&
        (key.includes('amount') || key.includes('cost') || key.includes('rent') || key.includes('price'))
      ) {
        cleaned[key] = `${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
      }
      // Keep other values as-is
      else {
        cleaned[key] = value
      }
    })

    return cleaned
  })
}

// Bulk export multiple modules
export function exportMultipleModules(
  modules: { name: string; data: any[] }[],
  filename: string = 'facilitypro_export'
) {
  modules.forEach((module) => {
    exportToCSV(module.data, `${filename}_${module.name}_${Date.now()}`)
  })
}
