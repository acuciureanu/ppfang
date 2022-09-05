import axios from 'axios';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import config from '../app.config.js';
import { sandboxHtml } from '../utils/sandbox.utils.js';
import { Cluster } from 'puppeteer-cluster';

const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_CONTEXT,
    maxConcurrency: 10,
});

const client = axios.create({
    baseURL: config.cdnjs.api.url,
    timeout: 5000,
});

const getLibraries = async () =>
    client
        .get('/libraries')
        .then((response) => response.data.results.filter((result) => result.latest !== null))
        .catch((error) => console.log(error));

const probe = async ({ page, data: { name, latest } }) => {
    const pageLoadConfig = { waitUntil: 'networkidle0' };

    await page.setJavaScriptEnabled(false);
    await page.goto(`data:text/html,${sandboxHtml}`, pageLoadConfig);

    const injectedHtml = await page.evaluate((latest) => {
        document.querySelector('#target').setAttribute('src', `${latest}`);
        return document.documentElement.outerHTML;
    }, latest);

    await page.setJavaScriptEnabled(true);

    await page.goto(`data:text/html,${injectedHtml}`, pageLoadConfig);

    const findings = await page.evaluate('probe()');

    console.log(`${findings.length ? '[ FOUND ]' : '---------'} Processed ${latest} ...`);

    return { name, url: latest, findings };
};

const keepFindings = (libraries) => libraries.filter((library) => library.findings.length);

const saveFindings = (findings) => {
    const output = path.join(process.cwd(), config.cdnjs.export.filename);
    fs.writeFileSync(output, JSON.stringify(findings));
    console.log(`Saved findings to: ${output}`);
};

const probeAll = async () => {
    const libraries = await getLibraries();

    const promisedLibraries = libraries.map((library) => cluster.execute(library, probe));

    Promise.all(promisedLibraries).then(keepFindings).then(saveFindings);

    await cluster.idle();
    await cluster.close();
};

export default { probeAll };
