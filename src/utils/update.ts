import * as JSONAPI from 'jsonapi-typescript';
<<<<<<< HEAD
import { JsonApiUpdateOptions } from '../interfaces/json-api-update-options';
=======
>>>>>>> master
import { JsonApiModel } from '../models/jsonapi-model';
import { request } from './http';
import { ModelType } from '../types/model-type';
import { JsonApiModelConfig } from '../interfaces/json-api-model-config';
import { BulbThings } from '..';
import { parseResource } from './parse';
import { stringifyModel } from './stringify';

export async function update<T extends JsonApiModel>(
    bulb: BulbThings,
    modelType: ModelType<T>,
    id: string,
    data: any
): Promise<T> {
    const endpoint = (Reflect.getMetadata(
        'JsonApiModelConfig',
        modelType
    ) as JsonApiModelConfig).endpoint;
    const model = new modelType({
        id,
        type: endpoint,
        attributes: data
    });
    const body = { data: stringifyModel(model, modelType) };
    const res: JSONAPI.SingleResourceDoc = await request(
        'PATCH',
        `${bulb.basePath}/${endpoint}/${id}`,
        { body }
    );
    const updated = parseResource(res.data, modelType, {});
    return updated;
}
