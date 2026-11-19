import assert from 'node:assert';
import http from 'node:http';
import { AddressInfo } from 'node:net';
import { after, before, beforeEach, describe, it } from 'node:test';
import { Bulbthings } from '../src';

/**
 * Invariants under test: while an instance has rate-limited requests queued,
 * exactly one of its requests is being sent or retried at a time (never zero,
 * or every other request waits forever; never several, or the 429s grow with
 * the number of waiting requests).
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
        assert.strictEqual(bulbthings.rateLimitQueue.size, 0);
        await bulbthings.entities.findAll();
    });

    it('holds other requests of the instance while one retries, then lets them through', async () => {
        let isLimited = true;
        respond = (_, res) => (isLimited ? rateLimited(res) : ok(res));
        const bulbthings = newInstance();

        const retrying = bulbthings.entities.findAll();
        await waitFor(50);
        assert.strictEqual(bulbthings.rateLimitQueue.size > 0, true);

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
        assert.strictEqual(bulbthings.rateLimitQueue.size, 0);
    });

    it('retries one request at a time however many got a 429', async () => {
        let isLimited = true;
        respond = (_, res) => (isLimited ? rateLimited(res) : ok(res));
        const bulbthings = newInstance();

        const burst = Array.from({ length: 20 }, () =>
            bulbthings.entities.findAll()
        );
        await waitFor(50);
        const requestsAfterBurst = requestedPaths.length;
        await waitFor(100);
        const retries = requestedPaths.length - requestsAfterBurst;
        assert.ok(
            retries <= 15,
            `about one retry per second (10 expected), got ${retries}`
        );

        isLimited = false;
        await Promise.all(burst);
        assert.strictEqual(bulbthings.rateLimitQueue.size, 0);
        assert.strictEqual(bulbthings.rateLimitMutex.isLocked(), false);
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
        assert.strictEqual(limited.rateLimitQueue.size > 0, true);

        await other.entities.findAll();
        assert.strictEqual(other.rateLimitQueue.size, 0);

        isLimited = false;
        await retrying;
    });
});
