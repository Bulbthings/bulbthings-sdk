import * as JSONAPI from 'jsonapi-typescript';
import { JsonApiOptions } from '../interfaces/json-api-options';
import { JsonApiModel } from '../models/jsonapi-model';
import { request } from '../utils/http';
import { ModelType } from '../types/model-type';
import { JsonApiModelConfig } from '../interfaces/json-api-model-config';
import BulbThings from '..';
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
    const model = new modelType({
        id: data.id,
        type: endpoint,
        attributes: data
    });
    const body = { data: stringifyModel(model, modelType) };
    const res: JSONAPI.SingleResourceDoc = await request(
        'POST',
        `${bulb.basePath}/${endpoint}`,
        { body }
    );
    const created = parseResource(res.data, modelType, {});
    return created;
}
