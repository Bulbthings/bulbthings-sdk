import fetch from 'cross-fetch';
import * as JSONAPI from 'jsonapi-typescript';
import qs from 'qs';
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

    const executeRequest = async (
        retries = 4,
        retryAfter = 1000
    ): Promise<any> => {
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

            // Check if body is empty or not
            const text = await res.text();
            return text.length ? JSON.parse(text) : {};
        } catch (error) {
            const networkError = isNetworkError(error);
            const rateLimitError = res?.status === 429;

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
            }

            if (networkError && retries > 0) {
                console.warn(
                    `[bulbthings][${method} ${url}] Network error, retrying in ${retryAfter}ms...`
                );
                await new Promise((resolve) => setTimeout(resolve, retryAfter));
                return await executeRequest(retries - 1, retryAfter * 3);
            }
            throw error;
        }
    };

    // While the instance is rate-limited, its requests take turns: only the one
    // holding the mutex is sent, and it retries alone until it gets through.
    // However many requests are waiting, at most one 429 per second comes back.
    const executeInTurn = async () => {
        try {
            return await bulb.rateLimitMutex.runExclusive(async () => {
                for (;;) {
                    try {
                        return await executeRequest();
                    } catch (error) {
                        if (res?.status === 429) {
                            console.warn(
                                `[bulbthings][${method} ${url}] Rate limit reached, retrying in 1000ms...`
                            );
                            await new Promise((resolve) =>
                                setTimeout(resolve, 1000)
                            );
                        } else {
                            throw error;
                        }
                    }
                }
            });
        } finally {
            if (!bulb.rateLimitMutex.isLocked()) {
                bulb.isRateLimited = false;
            }
        }
    };

    try {
        return bulb.isRateLimited
            ? await executeInTurn()
            : await executeRequest();
    } catch (error) {
        if (res?.status === 429) {
            bulb.isRateLimited = true;
            return await executeInTurn();
        }
        throw error;
    }
};
