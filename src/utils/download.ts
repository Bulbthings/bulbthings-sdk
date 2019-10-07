import fetch from 'cross-fetch';
import { JsonApiModel } from '../models/jsonapi-model';
import { ModelType } from '../types/model-type';
import { JsonApiModelConfig } from '../interfaces/json-api-model-config';
import { BulbThings } from '..';
import { RequestOptions } from '../interfaces/request-options';

export async function download<T extends JsonApiModel<T>>(
    bulb: BulbThings,
    modelType: ModelType<T>,
    id: string,
    options: RequestOptions = {}
): Promise<any> {
    const endpoint = (Reflect.getMetadata(
        'JsonApiModelConfig',
        modelType
    ) as JsonApiModelConfig).endpoint;

    const apiToken = options.apiToken || bulb.options.apiToken;

    const res = await fetch(
        `${bulb.options.coreUrl}/${endpoint}/download/${id}`,
        { method: 'GET', headers: { Authorization: `Bearer ${apiToken}` } }
    );

    return res;
}
