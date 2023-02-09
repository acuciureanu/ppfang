import { load, log } from '../utils/file.utils.js';
import puppeteer from 'puppeteer';
import { PromisePool } from '@supercharge/promise-pool';

const payload = load('../sandbox/js/check.payload.js');

const browser = await puppeteer.launch({ headless: true });

const probe = async (pageUrl) => {
    const page = await browser.newPage();

    await page.goto(pageUrl, { waitUntil: 'networkidle0' });

    await page.evaluate((payload) => {
        const script = document.createElement('script');
        script.innerHTML = payload;
        document.head.appendChild(script);
    }, payload);

    const results = await page.evaluate(() => probe());

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
