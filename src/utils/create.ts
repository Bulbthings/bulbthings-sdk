import * as JSONAPI from 'jsonapi-typescript';
import { JsonApiModel } from '../models/jsonapi-model';
import { request } from './http';
import { ModelType } from '../types/model-type';
import { JsonApiModelConfig } from '../interfaces/json-api-model-config';
import { BulbThings } from '..';
import { stringifyModel } from './stringify';
import { parseResource } from './parse';

export async function create<T extends JsonApiModel>(
    bulb: BulbThings,
    modelType: ModelType<T>,
    data: any
): Promise<T> {
    const endpoint = (Reflect.getMetadata(
        'JsonApiModelConfig',
        modelType
    ) as JsonApiModelConfig).endpoint;

    // Build the request
    const model = new modelType({
        id: data.id,
        type: endpoint,
        attributes: data
    });
    const body = { data: stringifyModel(model, modelType) };

    // Fetch the results
    const res: JSONAPI.SingleResourceDoc = await request(
        'POST',
        `${bulb.basePath}/${endpoint}`,
        { meta: bulb.meta, body }
    );

    // Build a map of included resources by id for fast access
    const includedResources: { [id: string]: JSONAPI.ResourceObject } = {};
    ((res as JSONAPI.SingleResourceDoc).included || []).forEach(
        r => (includedResources[r.id] = r)
    );

    const created = parseResource(res.data, modelType, includedResources);
    return created;
}
