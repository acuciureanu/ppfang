import { jest } from '@jest/globals';
import BrowserPoolManager from '../browser.service.js';

jest.setTimeout(30000); // Increase timeout to 30 seconds

describe('BrowserPoolManager', () => {
    let browserPool;

    beforeEach(() => {
        browserPool = new BrowserPoolManager({
            maxConcurrency: 2,
            timeout: 5000,
            retryAttempts: 2,
        });
    });

    afterEach(async () => {
        try {
            await browserPool.cleanup();
        } catch (error) {
            console.warn('Cleanup failed:', error);
        }
    });

    test('should create browser pool with correct configuration', () => {
        expect(browserPool.config.maxConcurrency).toBe(2);
        expect(browserPool.config.timeout).toBe(5000);
        expect(browserPool.config.retryAttempts).toBe(2);
    });

    test('should acquire and release browser successfully', async () => {
        const browser = await browserPool.acquireBrowser();
        expect(browser).toBeDefined();

        await browserPool.releaseBrowser(browser);
        const metrics = browserPool.getMetrics();
        expect(metrics.poolSize).toBeGreaterThan(0);
    });

    test('should create optimized page with correct settings', async () => {
        const browser = await browserPool.acquireBrowser();

        // Mock the page methods
        const mockSetRequestInterception = jest.fn();
        const mockSetDefaultNavigationTimeout = jest.fn();
        const mockSetDefaultTimeout = jest.fn();
        const mockNewPage = jest.fn().mockResolvedValue({
            setRequestInterception: mockSetRequestInterception,
            setDefaultNavigationTimeout: mockSetDefaultNavigationTimeout,
            setDefaultTimeout: mockSetDefaultTimeout,
            on: jest.fn(),
        });

        browser.newPage = mockNewPage;

        const page = await browserPool.createOptimizedPage(browser);

        expect(mockSetRequestInterception).toHaveBeenCalledWith(true);
        expect(mockSetDefaultNavigationTimeout).toHaveBeenCalledWith(5000);
        expect(mockSetDefaultTimeout).toHaveBeenCalledWith(5000);

        await browserPool.releaseBrowser(browser);
    });
});
