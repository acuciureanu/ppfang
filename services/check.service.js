import { load, log } from '../utils/file.utils.js';
import puppeteer from 'puppeteer';
import { PromisePool } from '@supercharge/promise-pool';

const payload = load('../sandbox/js/check.payload.js');

const probe = async (pageUrl, page) => {
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
    const browser = await puppeteer.launch({ headless: 'new' });
    const pages = await browser.pages();

    try {
        const { results } = await PromisePool.for(urls)
            .withConcurrency(concurrency)
            .onTaskFinished((url, pool) =>
                console.log(`[${pool.processedPercentage().toFixed(2)}%] Processed ${url} ...`)
            )
            .process(async (url) => {
                const page = pages.length > 0 ? pages.shift() : await browser.newPage();
                const result = await probe(url, page);
                pages.push(page);
                return result;
            });

        log(results);
        return results;
    } finally {
        for (const page of pages) {
            if (!page.isClosed()) {
                await page.close();
            }
        }
        await browser.close();
    }
};

export default { probeAll };
