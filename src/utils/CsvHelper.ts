
import fs from 'fs'
import { parse } from 'csv-parse/sync'

export class CsvHelper {
    static readCsv(filePath: string): Record<string, string>[] {
        return parse(fs.readFileSync(filePath, 'utf8'), {
            columns: true, // First row as the header
            skip_empty_lines: true,
            trim: true,
        }) as Record<string, string>[];
    }
}

/*
    After calling this method on loginpagefix.spec.ts file, this generic method start giving error.
    Resolve; I just refreshed this page and the error disappeared
*/