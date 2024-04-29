import * as JSONAPI from 'jsonapi-typescript';
import { v4 as uuidv4 } from 'uuid';
import { Bulbthings } from '..';
import { JsonApiModelConfig } from '../interfaces/json-api-model-config';
import { RequestOptions } from '../interfaces/request-options';
import { JsonApiModel } from '../models/jsonapi-model';
import { ModelType } from '../types/model-type';
import { request } from './http';
import { parseResource } from './parse';
import { stringifyModel } from './stringify';
import { upload } from './upload';

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

    model.id = model.id || uuidv4();

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
