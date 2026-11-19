import fetch from 'cross-fetch';
import * as JSONAPI from 'jsonapi-typescript';
import qs from 'qs';
import { v4 as uuidv4 } from 'uuid';
import { ApiError, Bulbthings } from '../../src';
import { JsonApiOptions } from '../interfaces/json-api-options';
import { TimeSeriesOptions } from '../interfaces/time-series-options';

interface HttpHeaders {
    [header: string]: string | string[];
}

export const isNetworkError = (error: any) => {
    const networkErrorMessages = [
        'Failed to fetch', // Chrome
        'NetworkError when attempting to fetch resource.', // Firefox
        'The Internet connection appears to be offline.', // Safari 16
        'Load failed', // Safari 17+
        'Network request failed', // `cross-fetch`
        'fetch failed', // Undici (Node.js)
        'FetchError', // node-fetch (Node.js)
    ];
    const isValid =
        error &&
        (error.name === 'TypeError' || error.name === 'FetchError') &&
        typeof error.message === 'string';

    // Extra check for Safari 17+ as it has a very generic error message.
    // Network errors in Safari have no stack.
    return isValid
        ? error.message === 'Load failed'
            ? error.stack === undefined
            : networkErrorMessages.includes(error.message) ||
              networkErrorMessages.includes(error.name)
        : false;
};

export const request = async (
    bulb: Bulbthings,
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
    url: string,
    options: {
        body?: any;
        headers?: HttpHeaders;
        params?: JsonApiOptions | TimeSeriesOptions;
    } = {}
) => {
    options.params = Object.assign(
        {},
        bulb.options.companyId
            ? { companyId: bulb.options.companyId }
            : undefined,
        bulb.options.clientId ? { clientId: bulb.options.clientId } : undefined,
        options.params
    );

    const apiToken = options.params.apiToken || bulb.options.apiToken;
    const environmentId = bulb.options.environment || 'app.bulbthings.com';

    // Avoid leaking the token in the URL
    delete options.params.apiToken;

    if (Object.keys(options.params).length) {
        url = `${url}?${qs.stringify(options.params, {
            arrayFormat: 'comma',
        })}`;
    }

    if (bulb.options.log) {
        console.log(`[bulbthings][${method} ${url}]`);
    }

    let res: Response;
    const requestId = uuidv4();

    const executeRequest = async (
        retries = 4,
        retryAfter = 1000,
        hasLock = false
    ) => {
        // A retry runs inside the turn of the attempt that called it: taking
        // the mutex again would wait on itself forever
        const mustTakeLock =
            !hasLock &&
            (bulb.rateLimitQueue.size > 0 || bulb.rateLimitMutex.isLocked());
        const release = mustTakeLock
            ? await bulb.rateLimitMutex.acquire()
            : () => {};

        try {
            res = null; // Clear previous res object
            res = await fetch(url, {
                method,
                body: options.body && JSON.stringify(options.body),
                headers: {
                    Accept: 'application/vnd.api+json',
                    'Content-Type': 'application/vnd.api+json',
                    Authorization: `Bearer ${apiToken}`,
                    'Bulbthings-Environment': environmentId,
                    'Geo-Position': bulb.options.geoPosition
                        ? `${bulb.options.geoPosition.lat};${bulb.options.geoPosition.lng}`
                        : undefined,
                    ...options.headers,
                },
            });

            if (res.status >= 400) {
                throw (await res.json()) as JSONAPI.DocWithErrors;
            }
            bulb.rateLimitQueue.delete(requestId);

            // Check if body is empty or not
            const text = await res.text();
            return text.length ? JSON.parse(text) : {};
        } catch (error) {
            const networkError = isNetworkError(error);
            const rateLimitError = res?.status === 429;

            if (rateLimitError) {
                bulb.rateLimitQueue.add(requestId);
            } else {
                bulb.rateLimitQueue.delete(requestId);
            }

            if (networkError || rateLimitError) {
                bulb.listeners
                    .filter((l) =>
                        networkError
                            ? l.events.includes('networkError')
                            : l.events.includes('rateLimitError')
                    )
                    .forEach((l) =>
                        l.callback({
                            id: null,
                            type: networkError
                                ? 'networkError'
                                : 'rateLimitError',
                            data: {
                                environmentId,
                                resource: {
                                    message: networkError
                                        ? error.message
                                        : (error as ApiError)?.errors?.[0]
                                              ?.detail,
                                },
                            },
                        })
                    );

                if (rateLimitError || retries > 0) {
                    console.warn(
                        `[bulbthings][${method} ${url}] ${
                            networkError
                                ? `Network error`
                                : 'Rate limit reached'
                        }, retrying in ${retryAfter}ms...`
                    );
                    await new Promise((resolve) =>
                        setTimeout(resolve, retryAfter)
                    );
                    return await executeRequest(
                        networkError ? retries - 1 : 4,
                        networkError ? retryAfter * 3 : 1000,
                        hasLock || mustTakeLock
                    );
                }
            }
            throw error;
        } finally {
            release();
        }
    };

    return await executeRequest();
};
