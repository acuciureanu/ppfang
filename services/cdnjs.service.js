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

const createSandbox = (library) => load('../sandbox/index.html').replace('LIBRARY', library);

const getLibraries = async () =>
    client
        .get('/libraries')
        .then((response) => response.data.results.filter((result) => result.latest !== null && result.latest.endsWith(".js")))
        .catch((error) => console.log(error));

const probe = async (library) => {
    const page = await browser.newPage();

    await page.setJavaScriptEnabled(true);
    await page.goto(`data:text/html,${createSandbox(library.latest)}`, { waitUntil: 'networkidle0' });

    const results = await page.evaluate(() => probe());

    await page.close({ runBeforeUnload: true });

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
        .process(async (library) => {
            const result = await probe(library);

            if (result.findings.length > 0) {
                console.log(JSON.stringify(result, null, 2));
            }

            return result;
        });

    log(results);
    browser.close();
    return results;
};

export default { probeAll };
