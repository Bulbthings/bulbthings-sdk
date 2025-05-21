import fetch from 'cross-fetch';
import { Bulbthings } from '..';
import { JsonApiModelConfig } from '../interfaces/json-api-model-config';
import { RequestOptions } from '../interfaces/request-options';
import { JsonApiModel } from '../models/jsonapi-model';
import { ModelType } from '../types/model-type';

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

    const res = await fetch(
        `${bulb.options.coreUrl}/${endpoint}/${id}/download`,
        { method: 'GET', headers: { Authorization: `Bearer ${apiToken}` } }
    );

    return res;
}
