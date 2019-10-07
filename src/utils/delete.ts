import { JsonApiModel } from '../models/jsonapi-model';
import { request } from './http';
import { ModelType } from '../types/model-type';
import { JsonApiModelConfig } from '../interfaces/json-api-model-config';
import { BulbThings } from '..';
import { RequestOptions } from '../interfaces/request-options';

export async function deleteById<T extends JsonApiModel<T>>(
    bulb: BulbThings,
    modelType: ModelType<T>,
    id: string,
    options?: RequestOptions
): Promise<void> {
    const endpoint = (Reflect.getMetadata(
        'JsonApiModelConfig',
        modelType
    ) as JsonApiModelConfig).endpoint;

    return request(
        bulb,
        'DELETE',
        `${bulb.options.coreUrl}/${endpoint}/${id}`,
        { params: options }
    );
}
