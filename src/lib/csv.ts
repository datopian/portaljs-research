import Papa from "papaparse";

export type CsvRow = Record<string, unknown>;

type ParseCsvRowsOptions<T> = Papa.ParseConfig<T> & {
  throwOnErrors?: boolean;
};

export function parseCsvRows<T extends CsvRow = Record<string, string>>(
  content: string,
  options: ParseCsvRowsOptions<T> = {},
): T[] {
  const { throwOnErrors = true, ...parseOptions } = options;
  const result = Papa.parse<T>(content, {
    header: true,
    skipEmptyLines: true,
    ...parseOptions,
  });

  if (throwOnErrors && result.errors.length > 0) {
    throw new Error(
      `CSV parsing errors: ${result.errors.map((error) => error.message).join(", ")}`,
    );
  }

  return result.data;
}

export function unparseCsvRows<T extends CsvRow>(rows: T[]): string {
  return Papa.unparse(rows);
}
