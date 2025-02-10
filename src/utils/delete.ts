import { Bulbthings } from '..';
import { JsonApiModelConfig } from '../interfaces/json-api-model-config';
import { RequestOptions } from '../interfaces/request-options';
import { JsonApiModel } from '../models/jsonapi-model';
import { ModelType } from '../types/model-type';
import { request } from './http';

export async function deleteById<T extends JsonApiModel<T>>(
    bulb: Bulbthings,
    modelType: ModelType<T>,
    id: string,
    options?: RequestOptions
): Promise<void> {
    const { endpoint } = Reflect.getMetadata(
        'JsonApiModelConfig',
        modelType
    ) as JsonApiModelConfig;

    return request(
        bulb,
        'DELETE',
        `${bulb.options.coreUrl}/${endpoint}/${encodeURIComponent(id)}`,
        { params: options }
    );
}
