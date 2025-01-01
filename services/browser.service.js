import puppeteer from 'puppeteer';
import genericPool from 'generic-pool';

/**
 * Browser Pool Manager for optimized Puppeteer instances
 * @class BrowserPoolManager
 */
class BrowserPoolManager {
    constructor(config = {}) {
        this.config = {
            maxConcurrency: config.maxConcurrency || 5,
            timeout: config.timeout || 30000,
            retryAttempts: config.retryAttempts || 3,
            ...config,
        };

        this.pool = genericPool.createPool(
            {
                create: async () => {
                    const browser = await puppeteer.launch({
                        args: [
                            '--no-sandbox',
                            '--disable-setuid-sandbox',
                            '--disable-dev-shm-usage',
                            '--disable-accelerated-2d-canvas',
                            '--disable-gpu',
                        ],
                        headless: 'new',
                    });
                    return browser;
                },
                destroy: async (browser) => {
                    await browser.close();
                },
            },
            {
                max: this.config.maxConcurrency,
                min: 1,
                acquireTimeoutMillis: this.config.timeout,
                idleTimeoutMillis: 30000,
                evictionRunIntervalMillis: 1000,
            }
        );

        // Metrics
        this.metrics = {
            totalRequests: 0,
            failedRequests: 0,
            averageResponseTime: 0,
        };
    }

    /**
     * Acquires a browser instance with retry mechanism
     * @returns {Promise<Browser>}
     */
    async acquireBrowser() {
        let attempts = 0;
        while (attempts < this.config.retryAttempts) {
            try {
                const browser = await this.pool.acquire();
                return browser;
            } catch (error) {
                attempts++;
                if (attempts === this.config.retryAttempts) {
                    throw new Error(`Failed to acquire browser after ${attempts} attempts: ${error.message}`);
                }
                await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempts) * 1000));
            }
        }
    }

    /**
     * Releases a browser instance back to the pool
     * @param {Browser} browser
     */
    async releaseBrowser(browser) {
        await this.pool.release(browser);
    }

    /**
     * Creates a new page with optimized settings
     * @param {Browser} browser
     * @returns {Promise<Page>}
     */
    async createOptimizedPage(browser) {
        const page = await browser.newPage();

        // Resource blocking
        await page.setRequestInterception(true);
        page.on('request', (request) => {
            const resourceType = request.resourceType();
            if (['image', 'stylesheet', 'font', 'media'].includes(resourceType)) {
                request.abort();
            } else {
                request.continue();
            }
        });

        // Performance settings
        await page.setDefaultNavigationTimeout(this.config.timeout);
        await page.setDefaultTimeout(this.config.timeout);

        return page;
    }

    /**
     * Gets current pool statistics
     * @returns {Object}
     */
    getMetrics() {
        return {
            ...this.metrics,
            poolSize: this.pool.size,
            available: this.pool.available,
            pending: this.pool.pending,
        };
    }

    /**
     * Drains and closes the pool
     */
    async cleanup() {
        await this.pool.drain();
        await this.pool.clear();
    }
}

export default BrowserPoolManager;
