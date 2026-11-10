import assert from 'node:assert';
import fs from 'node:fs';
import http from 'node:http';
import { AddressInfo } from 'node:net';
import os from 'node:os';
import path from 'node:path';
import { after, before, beforeEach, describe, it } from 'node:test';
import { Bulbthings } from '../src';

describe('file upload retries', () => {
    const realSetTimeout = global.setTimeout;
    const fileContent = 'restitution pdf '.repeat(1000);
    const filePath = path.join(os.tmpdir(), `sdk-upload-test-${process.pid}`);
    let receivedBodies: string[];
    let server: http.Server;
    let coreUrl: string;

    const newInstance = () =>
        new Bulbthings({
            apiToken: 'token',
            coreUrl,
            disableEvents: true,
        });
    const upload = (file: any) =>
        newInstance().files.create(
            { companyId: 'company', name: 'restitution.pdf' } as any,
            file
        );

    before(async () => {
        // Retry delays run 100x faster
        (global as any).setTimeout = (
            callback: (...args: any[]) => void,
            ms = 0,
            ...args: any[]
        ) => realSetTimeout(callback, ms / 100, ...args);
        console.warn = () => null;
        fs.writeFileSync(filePath, fileContent);

        // The first upload drops the connection once its body is received
        server = http.createServer((req, res) => {
            let body = '';
            req.on('data', (chunk) => (body += chunk));
            req.on('end', () => {
                receivedBodies.push(body);
                if (receivedBodies.length === 1) {
                    req.socket.destroy();
                } else {
                    res.statusCode = 201;
                    res.setHeader('Content-Type', 'application/vnd.api+json');
                    res.end(
                        JSON.stringify({
                            data: { id: 'file', type: 'files', attributes: {} },
                        })
                    );
                }
            });
        });
        await new Promise<void>((resolve) => server.listen(0, resolve));
        coreUrl = `http://localhost:${(server.address() as AddressInfo).port}`;
    });

    after(() => {
        global.setTimeout = realSetTimeout;
        server.close();
        fs.unlinkSync(filePath);
    });

    beforeEach(() => {
        receivedBodies = [];
    });

    it('resends the whole file from a factory after a network error', async () => {
        await upload(() => fs.createReadStream(filePath));

        assert.strictEqual(receivedBodies.length, 2);
        assert.ok(receivedBodies[1].includes(fileContent));
    });

    it('resends a Buffer after a network error', async () => {
        await upload(Buffer.from(fileContent));

        assert.strictEqual(receivedBodies.length, 2);
        assert.ok(receivedBodies[1].includes(fileContent));
    });

    it('does not resend a bare stream, which the first attempt consumed', async () => {
        await assert.rejects(upload(fs.createReadStream(filePath)));

        assert.strictEqual(receivedBodies.length, 1);
    });
});
