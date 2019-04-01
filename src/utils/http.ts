// Using ES6 modules with Babel or TypeScript
import fetch from 'cross-fetch';
import * as qs from 'qs';
import { JsonApiOptions } from '../interfaces/json-api-options';

interface HttpHeaders {
    [header: string]: string | string[];
}

export const request = async (
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
    url: string,
    options: {
        body?: any;
        headers?: HttpHeaders;
        params?: JsonApiOptions;
    } = {}
) => {
    try {
        if (options.params && method === 'GET') {
            const params = qs.stringify(options.params, {
                arrayFormat: 'comma'
            });
            url = `${url}?${params}`;
        }

        const res = await fetch(url, {
            method,
            body: options.body && JSON.stringify(options.body),
            headers: {
                Accept: 'application/vnd.api+json',
                'Content-Type': 'application/vnd.api+json'
            }
        });

        if (res.status >= 400) {
            console.error(await res.json());
            throw new Error('Bad response from server');
        }

        const data = await res.json();

        return data;

        // console.log(data);
    } catch (err) {
        console.error(err);
    }
};
