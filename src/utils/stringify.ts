import * as JSONAPI from 'jsonapi-typescript';
import { JsonApiModel } from '../models/jsonapi-model';
import { ModelType } from '../types/model-type';
import { JsonApiModelConfig } from '../interfaces/json-api-model-config';

export function stringifyModel<T extends JsonApiModel>(
    model: T,
    modelType: ModelType<T>
): JSONAPI.ResourceObject {
    const type = (Reflect.getMetadata(
        'JsonApiModelConfig',
        modelType
    ) as JsonApiModelConfig).endpoint;

    // Build the attributes object
    const attributes: JSONAPI.AttributesObject = model
        .getAttributeMetadata()
        .reduce((acc, el) => {
            if (model[el.propertyName] !== undefined) {
                acc[el.propertyName] = el.converter.stringify(
                    model[el.propertyName]
                );
            }
            return acc;
        }, {});

    const resource: JSONAPI.ResourceObject = { type, attributes };

    if (model.id) {
        resource.id = model.id;
    }

    return resource;
}
