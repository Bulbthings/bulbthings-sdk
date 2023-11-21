import fetch from 'cross-fetch';
import * as JSONAPI from 'jsonapi-typescript';
import qs from 'qs';
import { Bulbthings } from '../../src';
import { JsonApiOptions } from '../interfaces/json-api-options';
import { TimeSeriesOptions } from '../interfaces/time-series-options';

interface HttpHeaders {
    [header: string]: string | string[];
}

const isNetworkError = (error: any) => {
    const networkErrorMessages = [
        'Failed to fetch', // Chrome
        'NetworkError when attempting to fetch resource.', // Firefox
        'The Internet connection appears to be offline.', // Safari 16
        'Load failed', // Safari 17+
        'Network request failed', // `cross-fetch`
        'fetch failed', // Undici (Node.js)
    ];
    const isValid =
        error &&
        Object.prototype.toString.call(error) === '[object Error]' &&
        error.name === 'TypeError' &&
        typeof error.message === 'string';
    // Extra check for Safari 17+ as it has a very generic error message.
    // Network errors in Safari have no stack.
    return isValid
        ? error.message === 'Load failed'
            ? error.stack === undefined
            : networkErrorMessages.includes(error.message)
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
        options.params
    );

    const apiToken = options.params.apiToken || bulb.options.apiToken;

    // Avoid leaking the token in the URL
    delete options.params.apiToken;

    if (Object.keys(options.params).length) {
        url = `${url}?${qs.stringify(options.params, {
            arrayFormat: 'comma',
        })}`;
    }

    if (bulb.options.log) {
        console.log(`[bulbthings-sdk][${method} ${url}]`);
    }

    let res: Response;

    try {
        res = await fetch(url, {
            method,
            body: options.body && JSON.stringify(options.body),
            headers: {
                Accept: 'application/vnd.api+json',
                'Content-Type': 'application/vnd.api+json',
                Authorization: `Bearer ${apiToken}`,
                'Bulbthings-Environment':
                    bulb.options.environment || 'bulbthings',
                'Geo-Position': bulb.options.geoPosition
                    ? `${bulb.options.geoPosition.lat};${bulb.options.geoPosition.lng}`
                    : undefined,
                ...options.headers,
            },
        });
    } catch (error) {
        if (isNetworkError(error)) {
            bulb.listeners
                .filter((l) => l.type === 'networkError')
                .forEach((l) =>
                    l.listener(<any>{
                        data: JSON.stringify({
                            resource: { message: error.message },
                        }),
                    })
                );
        }
        throw error;
    }

    if (res.status >= 400) {
        throw (await res.json()) as JSONAPI.DocWithErrors;
    }

    // Check if body is empty or not
    const text = await res.text();
    return text.length ? JSON.parse(text) : {};
};
