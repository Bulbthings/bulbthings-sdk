import assert from 'node:assert';
import http from 'node:http';
import { AddressInfo } from 'node:net';
import { after, before, describe, it } from 'node:test';
import { Bulbthings } from '../src';

describe('getCached', () => {
    let requestedPaths: string[] = [];
    let server: http.Server;
    let coreUrl: string;

    before(async () => {
        server = http.createServer((req, res) => {
            requestedPaths.push(req.url.split('?')[0]);
            res.setHeader('Content-Type', 'application/vnd.api+json');
            res.end(
                JSON.stringify({
                    data: {
                        type: 'accounts',
                        id: 'a2612f51-3049-4083-a784-0f018b874501',
                        attributes: { label: 'Bot' },
                    },
                })
            );
        });
        await new Promise<void>((resolve) => server.listen(0, resolve));
        coreUrl = `http://localhost:${(server.address() as AddressInfo).port}`;
    });

    after(() => server.close());

    it('caches a resource fetched by an alias under that alias', async () => {
        requestedPaths = [];
        const bulbthings = new Bulbthings({
            apiToken: 'token',
            coreUrl,
            disableEvents: true,
        });

        const [first, second] = await Promise.all([
            bulbthings.accounts.getCached('self'),
            bulbthings.accounts.getCached('self'),
        ]);
        const third = await bulbthings.accounts.getCached('self');
        const byId = await bulbthings.accounts.getCached(
            'a2612f51-3049-4083-a784-0f018b874501'
        );

        assert.deepStrictEqual(requestedPaths, ['/accounts/self']);
        assert.strictEqual(first.id, 'a2612f51-3049-4083-a784-0f018b874501');
        assert.strictEqual(second, first);
        assert.strictEqual(third, first);
        assert.strictEqual(byId, first);
    });
});
