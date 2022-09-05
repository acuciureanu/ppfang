import axios from 'axios';
import config from '../app.config.js';
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer';
import process from 'node:process';
import { PromisePool } from '@supercharge/promise-pool';
import { sandboxHtml } from '../utils/sandbox.utils.js';

const browser = await puppeteer.launch({ headless: true });

const client = axios.create({
    baseURL: config.cdnjs.api.url,
    timeout: 1000,
});

const getLibraries = async () =>
    client
        .get('/libraries')
        .then((response) => response.data.results.filter((result) => result.latest !== null))
        .catch((error) => console.log(error));

const probe = async (library) => {
    const pageLoadConfig = { waitUntil: 'networkidle0' };

    const page = await browser.newPage();

    await page.setJavaScriptEnabled(false);
    await page.goto(`data:text/html,${sandboxHtml}`, pageLoadConfig);

    const injectedHtml = await page.evaluate((library) => {
        document.querySelector('#target').setAttribute('src', `${library.latest}`);
        return document.documentElement.outerHTML;
    }, library);

    await page.setJavaScriptEnabled(true);

    await page.goto(`data:text/html,${injectedHtml}`, pageLoadConfig);

    const results = await page.evaluate('probe()');

    await page.close();

    return { name: library.name, url: library.latest, findings: results };
};

const save = (results) => {
    const findings = results.filter((result) => result.findings.length);
    const output = path.join(process.cwd(), config.cdnjs.export.filename);
    fs.writeFileSync(output, JSON.stringify(findings));
    console.log(`Saved findings to: ${output}`);
};

const probeAll = async () => {
    const libraries = await getLibraries();
    const { results } = await PromisePool.withConcurrency(config.cdnjs.concurrency)
        .for(libraries)
        .onTaskFinished((library, pool) => {
            const stats = `[${pool.processedCount()}/${libraries.length} | ${pool.processedPercentage().toFixed(2)}%]`;
            console.log(`${stats} Processed ${library.latest} ...`);
        })
        .process(probe);

    save(results);
    browser.close();
    return results;
};

export default { probeAll };
