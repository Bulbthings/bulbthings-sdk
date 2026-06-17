import fetch from 'cross-fetch';
import formData from 'isomorphic-form-data';
import * as JSONAPI from 'jsonapi-typescript';
import qs from 'qs';
import { ApiError, Bulbthings } from '../../src';
import { RequestOptions } from '../interfaces/request-options';
import { isNetworkError } from './http';

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
        console.log(`[bulbthings][POST ${url}]`);
    }

    const body: FormData = <any>new formData();
    // Important: `data` should come first so that it can be
    // parsed before `file` by Express middlewares
    body.append('data', JSON.stringify(options.data));
    body.append('file', options.file);

    let res: Response;

    const executeRequest = async (retries = 4, retryAfter = 1000) => {
        try {
            res = await fetch(url, {
                method: 'POST',
                body,
                headers: {
                    Authorization: `Bearer ${apiToken}`,
                    'Bulbthings-Environment': environmentId,
                    'Geo-Position': bulb.options.geoPosition
                        ? `${bulb.options.geoPosition.lat};${bulb.options.geoPosition.lng}`
                        : undefined,
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

                if (retries > 0) {
                    console.warn(
                        `[bulbthings][POST ${url}] ${
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
                        networkError ? retryAfter * 3 : 1000
                    );
                }
            }
            throw error;
        }
    };

    return await executeRequest();
};
