import Papa from "papaparse";

export type CsvRow = Record<string, unknown>;

export function parseCsvRows<T extends CsvRow = Record<string, string>>(
  content: string,
  options: Papa.ParseConfig<T> = {},
): T[] {
  const result = Papa.parse<T>(content, {
    header: true,
    skipEmptyLines: true,
    ...options,
  });

  if (result.errors.length > 0) {
    throw new Error(
      `CSV parsing errors: ${result.errors.map((error) => error.message).join(", ")}`,
    );
  }

  return result.data;
}

export function unparseCsvRows<T extends CsvRow>(rows: T[]): string {
  return Papa.unparse(rows);
}
