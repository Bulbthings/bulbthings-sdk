import fetch from 'cross-fetch';
import qs from 'qs';
import { JsonApiOptions } from '../interfaces/json-api-options';
import { TimeSeriesOptions } from '../interfaces/time-series-options';

interface HttpHeaders {
    [header: string]: string | string[];
}

export const request = async (
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
    url: string,
    options: {
        meta?: any;
        body?: any;
        headers?: HttpHeaders;
        params?: JsonApiOptions | TimeSeriesOptions;
    } = {},
) => {
    try {
        const params = Object.assign(
            {},
            options.meta,
            method === 'GET' ? options.params : null
        );

        if (params && Object.keys(params).length > 0) {
            const urlParams = qs.stringify(params, {
                arrayFormat: 'comma'
            });
            url = `${url}?${urlParams}`;
        }

        const res = await fetch(url, {
            method,
            body: options.body && JSON.stringify(options.body),
            headers: {
                Accept: 'application/vnd.api+json',
                'Content-Type': 'application/vnd.api+json'
            }
        });

        // TODO: better error management
        if (res.status >= 400) {
            const error = await res.json();
            throw error;
        }

        const text = await res.text();

        // Check if body is empty or not
        return text.length ? JSON.parse(text) : {};
    } catch (err) {
        throw (err);
    }
};
