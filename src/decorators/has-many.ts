import { JsonApiModel } from '../models/jsonapi-model';
import { ModelType } from '../types/model-type';
import { Annotation } from '../interfaces/annotation';

export function HasMany<T extends JsonApiModel>(
    type: ModelType<T>
): PropertyDecorator {
    return function(target: any, propertyName: string | symbol) {
        const annotations: Annotation[] =
            Reflect.getMetadata('HasMany', target) || [];
        annotations.push({ propertyName: propertyName.toString(), type });
        Reflect.defineMetadata('HasMany', annotations, target);
    };
}
