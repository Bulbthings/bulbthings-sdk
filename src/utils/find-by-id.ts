import * as JSONAPI from 'jsonapi-typescript';
import { Bulbthings } from '..';
import { JsonApiModelConfig } from '../interfaces/json-api-model-config';
import { JsonApiOptions } from '../interfaces/json-api-options';
import { JsonApiModel } from '../models/jsonapi-model';
import { ModelType } from '../types/model-type';
import { request } from './http';
import { parseResource } from './parse';

export async function findById<T extends JsonApiModel<T>>(
    bulb: Bulbthings,
    modelType: ModelType<T>,
    id: string,
    options?: JsonApiOptions
): Promise<T> {
    const { endpoint } = Reflect.getMetadata(
        'JsonApiModelConfig',
        modelType
    ) as JsonApiModelConfig;

    const res = await request(
        bulb,
        'GET',
        `${bulb.options.coreUrl}/${endpoint}/${encodeURIComponent(id)}`,
        { params: options }
    );

    // Build a map of included resources by id for fast access
    const includedResources: {
        [type: string]: { [id: string]: JSONAPI.ResourceObject };
    } = {};
    ((res as JSONAPI.SingleResourceDoc).included || []).forEach((r) => {
        includedResources[r.type] = includedResources[r.type] || {};
        includedResources[r.type][r.id] = r;
    });

    const model = parseResource({
        resource: (res as JSONAPI.SingleResourceDoc).data,
        type: modelType,
        includedResources,
        cache: !options?.fields ? bulb.cache : null,
    });

    return model;
}
