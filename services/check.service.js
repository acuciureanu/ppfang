import { load, log } from '../utils/file.utils.js';
import puppeteer from 'puppeteer';
import { PromisePool } from '@supercharge/promise-pool';

const browser = await puppeteer.launch({ headless: true });

const payload = load('../sandbox/js/check.payload.js');

const probe = async (pageUrl) => {
    const page = await browser.newPage();

    await page.goto(pageUrl, { waitUntil: 'networkidle0' });

    const results = await page.evaluate(payload);

    await page.close();

    return { url: pageUrl, findings: results };
};

const probeAll = async (urls, concurrency = 10) => {
    const { results } = await PromisePool.for(urls)
        .withConcurrency(concurrency)
        .onTaskFinished((url, pool) => console.log(`[${pool.processedPercentage().toFixed(2)}%] Processed ${url} ...`))
        .process(probe);

    log(results);
    browser.close();
    return results;
};

export default { probeAll };
