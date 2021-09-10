import fetch from 'cross-fetch';
import qs from 'qs';
import * as JSONAPI from 'jsonapi-typescript';
import { Bulbthings } from '../../src';
import { RequestOptions } from '../interfaces/request-options';
import formData from 'isomorphic-form-data';

export const upload = async (
    bulb: Bulbthings,
    url: string,
    options: { data?: any; file?: any; params?: RequestOptions } = {}
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

    const body: FormData = <any>new formData();
    // Important: `data` should come first so that it can be
    // parsed before `file` by Express middlewares
    body.append('data', JSON.stringify(options.data));
    body.append('file', options.file);

    const res = await fetch(url, {
        method: 'POST',
        body,
        headers: { Authorization: `Bearer ${apiToken}` },
    });

    if (res.status >= 400) {
        throw (await res.json()) as JSONAPI.DocWithErrors;
    }

    const text = await res.text();

    // Check if body is empty or not
    return text.length ? JSON.parse(text) : {};
};
