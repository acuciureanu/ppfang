import axios from 'axios';
import config from '../app.config.js';
import { load, log } from '../utils/file.utils.js';
import puppeteer from 'puppeteer';
import { PromisePool } from '@supercharge/promise-pool';

const browser = await puppeteer.launch({ headless: true });

const client = axios.create({
    baseURL: config.cdnjs.api.url,
    timeout: 5000,
});

const sandboxHtml = load('../sandbox/index.html');

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

const probeAll = async (concurrency) => {
    const libraries = await getLibraries();
    const { results } = await PromisePool.withConcurrency(concurrency)
        .for(libraries)
        .onTaskFinished((library, pool) => {
            const stats = `[${pool.processedCount()}/${libraries.length} | ${pool.processedPercentage().toFixed(2)}%]`;
            console.log(`${stats} Processed ${library.latest} ...`);
        })
        .process(probe);

    log(results);
    browser.close();
    return results;
};

export default { probeAll };
