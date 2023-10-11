import * as JSONAPI from 'jsonapi-typescript';
import { Bulbthings } from '..';
import { JsonApiModelConfig } from '../interfaces/json-api-model-config';
import { JsonApiOptions } from '../interfaces/json-api-options';
import { JsonApiModel } from '../models/jsonapi-model';
import { ModelType } from '../types/model-type';
import { request } from './http';
import { parseResource } from './parse';

export async function findAll<T extends JsonApiModel<T>>(
    bulb: Bulbthings,
    modelType: ModelType<T>,
    options?: JsonApiOptions
): Promise<{ meta?: any; data: T[] }> {
    const models: T[] = [];
    const { endpoint } = Reflect.getMetadata(
        'JsonApiModelConfig',
        modelType
    ) as JsonApiModelConfig;

    const res = await request(
        bulb,
        'GET',
        `${bulb.options.coreUrl}/${endpoint}`,
        { params: options }
    );

    // Build a map of included resources by id for fast access
    const includedResources: {
        [type: string]: { [id: string]: JSONAPI.ResourceObject };
    } = {};
    ((res as JSONAPI.CollectionResourceDoc).included || []).forEach((r) => {
        includedResources[r.type] = includedResources[r.type] || {};
        includedResources[r.type][r.id] = r;
    });

    // Parse the data and build relationships
    (res as JSONAPI.CollectionResourceDoc).data.forEach((element) => {
        const model = parseResource({
            resource: element,
            type: modelType,
            includedResources,
            cache: !options?.fields ? bulb.cache : null,
        });
        models.push(model);
    });

    return { meta: res.meta || {}, data: models };
}
