import * as JSONAPI from 'jsonapi-typescript';
import { JsonApiUpdateOptions } from '../interfaces/json-api-update-options';
import { JsonApiModel } from '../models/jsonapi-model';
import { request } from './http';
import { ModelType } from '../types/model-type';
import { JsonApiModelConfig } from '../interfaces/json-api-model-config';
import { BulbThings } from '..';
import { parseResource } from './parse';
import { stringifyModel } from './stringify';

export async function updateAll<T extends JsonApiModel>(
    bulb: BulbThings,
    modelType: ModelType<T>,
    data: any,
    options: JsonApiUpdateOptions
): Promise<{ meta?: any; data?: T[] }> {
    const result: { meta?: any, data?: T[] } = {};
    return result;
}

export async function updateById<T extends JsonApiModel>(
    bulb: BulbThings,
    modelType: ModelType<T>,
    id: string,
    data: any,
    options: JsonApiUpdateOptions
): Promise<{ meta?: any, data?: T }> {
    const result: { meta?: any, data?: T } = {};
    const endpoint = (Reflect.getMetadata(
        'JsonApiModelConfig',
        modelType
    ) as JsonApiModelConfig).endpoint;
    const model = new modelType({
        id: data.id,
        type: endpoint,
        attributes: data
    });
    const body = { data: stringifyModel(model, modelType), options };
    const res: JSONAPI.SingleResourceDoc = await request(
        'POST',
        `${bulb.basePath}/${endpoint}`,
        { meta: bulb.meta, body }
    );
    result.data = parseResource(res.data, modelType, {});
    return result;
}
