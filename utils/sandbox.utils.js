import fs from 'node:fs';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const sandboxHtml = fs.readFileSync(path.resolve(path.join(__dirname, '../sandbox/index.html')), {
    encoding: 'utf-8',
});
