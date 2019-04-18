import { JsonApiModel } from '../models/jsonapi-model';
import { ModelType } from '../types/model-type';
import { RelationAnnotation } from '../interfaces/relation-annotation';
import { RelationType } from '../types/relation-type';

// Cannot use Reflect.getMetadata('design:type', ...) because of circular
// dependencies between models so a factory method needs to be provided
// https://github.com/Microsoft/TypeScript/issues/4521#issuecomment-135908451
export function Relation<T extends JsonApiModel>(
    relationType: RelationType,
    typeFactory: () => ModelType<T>
): PropertyDecorator {
    return function(target: any, propertyName: string | symbol) {
        const annotations: RelationAnnotation[] =
            Reflect.getMetadata(relationType, target) || [];

        annotations.push({
            propertyName: propertyName.toString(),
            // Can't execute typeFactory() here, needs to be evaluated later
            type: typeFactory
        });

        Reflect.defineMetadata(relationType, annotations, target);
    };
}
