import fetch from 'cross-fetch';
import qs from 'qs';
import * as JSONAPI from 'jsonapi-typescript';
import { JsonApiOptions } from '../interfaces/json-api-options';
import { TimeSeriesOptions } from '../interfaces/time-series-options';
import { BulbThings } from '../../src';

interface HttpHeaders {
    [header: string]: string | string[];
}

export const request = async (
    bulb: BulbThings,
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
    url: string,
    options: {
        body?: any;
        headers?: HttpHeaders;
        params?: JsonApiOptions | TimeSeriesOptions;
    } = {}
) => {
    const apiToken =
        (options.params && options.params.apiToken) || bulb.options.apiToken;

    if (options.params) {
        // Avoid leaking the token in the URL
        delete options.params.apiToken;

        if (Object.keys(options.params).length) {
            url = `${url}?${qs.stringify(options.params, {
                arrayFormat: 'comma'
            })}`;
        }
    }

    const res = await fetch(url, {
        method,
        body: options.body && JSON.stringify(options.body),
        headers: {
            Accept: 'application/vnd.api+json',
            'Content-Type': 'application/vnd.api+json',
            Authorization: `Bearer ${apiToken}`,
            ...options.headers
        }
    });

    if (res.status >= 400) {
        throw (await res.json()) as JSONAPI.DocWithErrors;
    }

    const text = await res.text();

    // Check if body is empty or not
    return text.length ? JSON.parse(text) : {};
};
