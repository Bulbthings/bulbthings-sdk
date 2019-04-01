import { JsonApiModel } from '../models/jsonapi-model';
import { ModelType } from '../types/model-type';

export function HasMany<T extends JsonApiModel>(type: ModelType<T>) {
    return function(target: any, propertyName: string | symbol) {
        const annotations = Reflect.getMetadata('HasMany', target) || [];
        annotations.push({ propertyName, type });
        Reflect.defineMetadata('HasMany', annotations, target);
    };
}
