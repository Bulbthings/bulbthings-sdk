import fetch from 'cross-fetch';
import qs from 'qs';
import * as JSONAPI from 'jsonapi-typescript';
import { BulbThings } from '../../src';
import { RequestOptions } from '../interfaces/request-options';
import formData from 'isomorphic-form-data';

export const upload = async (
    bulb: BulbThings,
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
            arrayFormat: 'comma'
        })}`;
    }

    /* This is necessary to extract vital information when the file
       is a stream or a buffer for example. fileOption needs to be available
       to input the filename and such */
    let fileData;
    let fileOption;
    if (typeof options.file === 'object' && options.file.data) {
        fileData = options.file.data;
        fileOption = options.file.option;
    } else {
        fileData = options.file.data;
    }

    const body: FormData = <any>new formData();
    body.append('file', fileData, fileOption);
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
