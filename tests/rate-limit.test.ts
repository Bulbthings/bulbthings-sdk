import assert from 'node:assert';
import http from 'node:http';
import { AddressInfo } from 'node:net';
import { after, before, beforeEach, describe, it } from 'node:test';
import { Bulbthings } from '../src';

/**
 * Invariant under test: whenever `isRateLimited` is true, one request of that
 * instance is retrying. Otherwise every other request waits forever.
 */
describe('rate limit gate', () => {
    const realSetTimeout = global.setTimeout;
    let respond: (req: http.IncomingMessage, res: http.ServerResponse) => void;
    let requestedPaths: string[];
    let server: http.Server;
    let coreUrl: string;

    const newInstance = () =>
        new Bulbthings({
            apiToken: 'token',
            coreUrl,
            disableEvents: true,
        });
    const json = (res: http.ServerResponse, status: number, body: any) => {
        res.statusCode = status;
        res.setHeader('Content-Type', 'application/vnd.api+json');
        res.end(JSON.stringify(body));
    };
    const ok = (res: http.ServerResponse) => json(res, 200, { data: [] });
    const rateLimited = (res: http.ServerResponse) =>
        json(res, 429, { errors: [{ status: '429', detail: 'rate limit' }] });
    const waitFor = (ms: number) =>
        new Promise((resolve) => realSetTimeout(resolve, ms));

    before(async () => {
        // Retry delays run 100x faster
        (global as any).setTimeout = (
            callback: (...args: any[]) => void,
            ms = 0,
            ...args: any[]
        ) => realSetTimeout(callback, ms / 100, ...args);
        console.warn = () => null;

        server = http.createServer((req, res) => {
            requestedPaths.push(req.url.split('?')[0]);
            respond(req, res);
        });
        await new Promise<void>((resolve) => server.listen(0, resolve));
        coreUrl = `http://localhost:${(server.address() as AddressInfo).port}`;
    });

    after(() => {
        global.setTimeout = realSetTimeout;
        server.close();
    });

    beforeEach(() => {
        requestedPaths = [];
    });

    it('keeps retrying a 429 received on the last network retry, so the gate reopens', async () => {
        respond = (req, res) =>
            requestedPaths.length <= 4
                ? req.socket.destroy()
                : requestedPaths.length === 5
                ? rateLimited(res)
                : ok(res);
        const bulbthings = newInstance();

        await bulbthings.entities.findAll();

        assert.strictEqual(requestedPaths.length, 6);
        assert.strictEqual(bulbthings.isRateLimited, false);
        await bulbthings.entities.findAll();
    });

    it('holds other requests of the instance while one retries, then lets them through', async () => {
        let isLimited = true;
        respond = (_, res) => (isLimited ? rateLimited(res) : ok(res));
        const bulbthings = newInstance();

        const retrying = bulbthings.entities.findAll();
        await waitFor(50);
        assert.strictEqual(bulbthings.isRateLimited, true);

        const held = [
            bulbthings.associations.findAll(),
            bulbthings.accounts.findAll(),
        ];
        await waitFor(100);
        assert.ok(
            requestedPaths.length > 1,
            'the first request keeps retrying'
        );
        assert.ok(
            requestedPaths.every((path) => path === '/entities'),
            'held requests must not reach the API'
        );

        isLimited = false;
        await Promise.all([retrying, ...held]);
        assert.strictEqual(bulbthings.isRateLimited, false);
    });

    it('does not hold the requests of another instance', async () => {
        let isLimited = true;
        respond = (req, res) =>
            isLimited && req.url.includes('clientId=limited')
                ? rateLimited(res)
                : ok(res);
        const limited = newInstance();
        limited.options.clientId = 'limited';
        const other = newInstance();

        const retrying = limited.entities.findAll();
        await waitFor(50);
        assert.strictEqual(limited.isRateLimited, true);

        await other.entities.findAll();
        assert.strictEqual(other.isRateLimited, false);

        isLimited = false;
        await retrying;
    });
});
