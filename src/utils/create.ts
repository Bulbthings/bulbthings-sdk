import * as JSONAPI from 'jsonapi-typescript';
import { JsonApiModel } from '../models/jsonapi-model';
import { request } from './http';
import { upload } from './upload';
import { ModelType } from '../types/model-type';
import { JsonApiModelConfig } from '../interfaces/json-api-model-config';
import { Bulbthings } from '..';
import { stringifyModel } from './stringify';
import { parseResource } from './parse';
import { RequestOptions } from '../interfaces/request-options';

export async function create<T extends JsonApiModel<T>>(
    bulb: Bulbthings,
    modelType: ModelType<T>,
    data: any,
    file?: any,
    options?: RequestOptions
): Promise<T> {
    const { endpoint } = Reflect.getMetadata(
        'JsonApiModelConfig',
        modelType
    ) as JsonApiModelConfig;

    // Build the request
    const model = new modelType(data);

    // Fetch the results
    let res: JSONAPI.SingleResourceDoc;

    if (file) {
        res = await upload(bulb, `${bulb.options.coreUrl}/${endpoint}`, {
            data: stringifyModel(model, modelType),
            file,
            params: options,
        });
    } else {
        res = await request(
            bulb,
            'POST',
            `${bulb.options.coreUrl}/${endpoint}`,
            {
                body: { data: stringifyModel(model, modelType) },
                params: options,
            }
        );
    }

    // Build a map of included resources by id for fast access
    const includedResources: {
        [type: string]: { [id: string]: JSONAPI.ResourceObject };
    } = {};
    ((res as JSONAPI.SingleResourceDoc).included || []).forEach((r) => {
        includedResources[r.type] = includedResources[r.type] || {};
        includedResources[r.type][r.id] = r;
    });

    const created = parseResource({
        resource: res.data,
        type: modelType,
        includedResources,
    });
    return created;
}
