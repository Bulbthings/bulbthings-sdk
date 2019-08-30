import fetch from 'cross-fetch';
import * as JSONAPI from 'jsonapi-typescript';
import { BulbThings } from '../../src';
import { RequestOptions } from '../interfaces/request-options';

export const upload = async (
    bulb: BulbThings,
    url: string,
    options: { data: any; file: any; params?: RequestOptions }
) => {
    const apiToken =
        (options.params && options.params.apiToken) || bulb.options.apiToken;

    const body = new FormData();
    body.append('file', options.file);
    body.append('data', JSON.stringify(options.data));

    const res = await fetch(url, {
        method: 'POST',
        body,
        headers: { Authorization: `Bearer ${apiToken}` }
    });

    if (res.status >= 400) {
        throw (await res.json()) as JSONAPI.DocWithErrors;
    }

    const text = await res.text();

    // Check if body is empty or not
    return text.length ? JSON.parse(text) : {};
};
