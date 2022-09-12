import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const resolvedPath = (filePath) => path.resolve(path.join(__dirname, filePath));

export const load = (filePath) => fs.readFileSync(resolvedPath(filePath), { encoding: 'utf-8' });

export const log = (results) => {
    const findings = results.filter((result) => result.findings.length);
    console.log(JSON.stringify(findings, null, 4));
};