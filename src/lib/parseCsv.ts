import { parseCsvRows } from "./csv";

export function parseCsv(text: string): Record<string, string>[] {
  return parseCsvRows<Record<string, string>>(text);
}
