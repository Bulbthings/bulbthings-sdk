import { JsonApiModel } from '../models/jsonapi-model';
import { request } from './http';
import { ModelType } from '../types/model-type';
import { JsonApiModelConfig } from '../interfaces/json-api-model-config';
import { BulbThings } from '..';

export async function deleteById<T extends JsonApiModel>(
    bulb: BulbThings,
    modelType: ModelType<T>,
    id: string
): Promise<void> {
    const endpoint = (Reflect.getMetadata(
        'JsonApiModelConfig',
        modelType
    ) as JsonApiModelConfig).endpoint;

    return request('DELETE', `${bulb.basePath}/${endpoint}/${id}`, { meta: bulb.meta });
}
