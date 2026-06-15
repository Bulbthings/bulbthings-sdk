import fetch from 'cross-fetch';
import * as JSONAPI from 'jsonapi-typescript';
import { ApiError, Bulbthings } from '../index';
import { JsonApiModelConfig } from '../interfaces/json-api-model-config';
import { RequestOptions } from '../interfaces/request-options';
import { JsonApiModel } from '../models/jsonapi-model';
import { ModelType } from '../types/model-type';
import { isNetworkError } from './http';

export async function download<T extends JsonApiModel<T>>(
    bulb: Bulbthings,
    modelType: ModelType<T>,
    id: string,
    options: RequestOptions = {}
): Promise<any> {
    const endpoint = (
        Reflect.getMetadata(
            'JsonApiModelConfig',
            modelType
        ) as JsonApiModelConfig
    ).endpoint;

    const apiToken = options.apiToken || bulb.options.apiToken;
    const url = `${bulb.options.coreUrl}/${endpoint}/${id}/download`;
    const environmentId = bulb.options.environment || 'app.bulbthings.com';

    if (bulb.options.log) {
        console.log(`[bulbthings][GET ${url}]`);
    }

    let res: Response;

    const executeRequest = async (retries = 4, retryAfter = 1000) => {
        try {
            res = await fetch(url, {
                method: 'GET',
                headers: { Authorization: `Bearer ${apiToken}` },
            });

            if (res.status >= 400) {
                throw (await res.json()) as JSONAPI.DocWithErrors;
            }

            return res;
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
                        `[bulbthings][GET ${url}] ${
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
}
