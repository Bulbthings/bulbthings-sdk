import * as JSONAPI from 'jsonapi-typescript';
import { JsonApiModel } from '../models/jsonapi-model';
import { request, upload } from './http';
import { ModelType } from '../types/model-type';
import { JsonApiModelConfig } from '../interfaces/json-api-model-config';
import { BulbThings } from '..';
import { stringifyModel } from './stringify';
import { parseResource } from './parse';

export async function create<T extends JsonApiModel>(
    bulb: BulbThings,
    modelType: ModelType<T>,
    data: any,
    file?: any
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

    // Fetch the results
    let res: JSONAPI.SingleResourceDoc;

    if (file) {
        res = await upload('POST', `${bulb.options.coreUrl}/${endpoint}`, {
            meta: bulb.meta,
            data: stringifyModel(model, modelType),
            file
        });
    } else {
        res = await request('POST', `${bulb.options.coreUrl}/${endpoint}`, {
            meta: bulb.meta,
            body: { data: stringifyModel(model, modelType) }
        });
    }

    // Build a map of included resources by id for fast access
    const includedResources: {
        [type: string]: { [id: string]: JSONAPI.ResourceObject };
    } = {};
    ((res as JSONAPI.SingleResourceDoc).included || []).forEach(r => {
        includedResources[r.type] = includedResources[r.type] || {};
        includedResources[r.type][r.id] = r;
    });

    const created = parseResource(res.data, modelType, includedResources);
    return created;
}
