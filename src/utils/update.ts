import * as JSONAPI from 'jsonapi-typescript';
import { JsonApiModel } from '../models/jsonapi-model';
import { request } from './http';
import { ModelType } from '../types/model-type';
import { JsonApiModelConfig } from '../interfaces/json-api-model-config';
import { Bulbthings } from '..';
import { parseResource } from './parse';
import { stringifyModel } from './stringify';
import { RequestOptions } from '../interfaces/request-options';

export async function update<T extends JsonApiModel<T>>(
    bulb: Bulbthings,
    modelType: ModelType<T>,
    id: string,
    data: any,
    options?: RequestOptions
): Promise<T> {
    const endpoint = (Reflect.getMetadata(
        'JsonApiModelConfig',
        modelType
    ) as JsonApiModelConfig).endpoint;

    // Build the request
    const model = new modelType({ id, ...data });
    const body = { data: stringifyModel(model, modelType) };

    // Fetch the results
    const res: JSONAPI.SingleResourceDoc = await request(
        bulb,
        'PATCH',
        `${bulb.options.coreUrl}/${endpoint}/${id}`,
        { body, params: options }
    );

    // Build a map of included resources by id for fast access
    const includedResources: {
        [type: string]: { [id: string]: JSONAPI.ResourceObject };
    } = {};
    ((res as JSONAPI.SingleResourceDoc).included || []).forEach((r) => {
        includedResources[r.type] = includedResources[r.type] || {};
        includedResources[r.type][r.id] = r;
    });

    const updated = parseResource(res.data, modelType, includedResources);
    return updated;
}
