import * as XLSX from "xlsx";

export interface ExportColumn<T> {
  header: string;
  accessor: (row: T) => string | number;
}

export function exportRowsToExcel<T>({
  fileName,
  sheetName,
  columns,
  rows,
}: {
  fileName: string;
  sheetName: string;
  columns: ExportColumn<T>[];
  rows: T[];
}): void {
  if (rows.length === 0) return;

  const data = rows.map((row) => {
    const out: Record<string, string | number> = {};
    columns.forEach((col) => {
      out[col.header] = col.accessor(row);
    });
    return out;
  });

  const ws = XLSX.utils.json_to_sheet(data);
  ws["!cols"] = columns.map((col) => ({
    wch: Math.max(col.header.length + 4, 18),
  }));

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName.slice(0, 31));
  XLSX.writeFile(wb, fileName);
}
