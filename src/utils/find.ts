import * as JSONAPI from 'jsonapi-typescript';
import { JsonApiOptions } from '../interfaces/json-api-options';
import { JsonApiModel } from '../models/jsonapi-model';
import { request } from './http';
import { ModelType } from '../types/model-type';
import { JsonApiModelConfig } from '../interfaces/json-api-model-config';
import { BulbThings } from '..';
import { parseResource } from './parse';

export async function findAll<T extends JsonApiModel>(
    bulb: BulbThings,
    modelType: ModelType<T>,
    options?: JsonApiOptions
): Promise<{ meta?: any; data: T[] }> {
    const includedResources: { [id: string]: JSONAPI.ResourceObject } = {};
    const models: T[] = [];
    const endpoint = (Reflect.getMetadata(
        'JsonApiModelConfig',
        modelType
    ) as JsonApiModelConfig).endpoint;

    const res = await request('GET', `${bulb.basePath}/${endpoint}`, {
        params: options
    });

    // Build a map of included resources by id for fast access
    ((res as JSONAPI.CollectionResourceDoc).included || []).forEach(
        r => (includedResources[r.id] = r)
    );

    // Parse the data and build relationships
    (res as JSONAPI.CollectionResourceDoc).data.forEach(element => {
        const model = parseResource(element, modelType, includedResources);
        models.push(model);
    });

    return { meta: res.meta || {}, data: models };
}

export async function findById<T extends JsonApiModel>(
    bulb: BulbThings,
    modelType: ModelType<T>,
    id: string,
    options?: JsonApiOptions
): Promise<T> {
    const includedResources: { [id: string]: JSONAPI.ResourceObject } = {};
    const endpoint = (Reflect.getMetadata(
        'JsonApiModelConfig',
        modelType
    ) as JsonApiModelConfig).endpoint;

    const res = await request('GET', `${bulb.basePath}/${endpoint}/${id}`, {
        params: options
    });

    // Build a map of included resources by id for fast access
    ((res as JSONAPI.SingleResourceDoc).included || []).forEach(
        r => (includedResources[r.id] = r)
    );

    const model = parseResource(
        (res as JSONAPI.SingleResourceDoc).data,
        modelType,
        includedResources
    );

    return model;
}
