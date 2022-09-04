import fs from 'node:fs';
import path from 'node:path';

export const sandboxHtml = fs.readFileSync(path.join(process.cwd(), '/sandbox/index.html'), { encoding: 'utf-8' });
