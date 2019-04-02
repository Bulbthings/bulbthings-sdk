import { Annotation } from '../interfaces/annotation';

export function BelongsTo(): PropertyDecorator {
    return function(target: any, propertyName: string | symbol) {
        const type = Reflect.getMetadata('design:type', target, propertyName);
        const annotations: Annotation[] =
            Reflect.getMetadata('BelongsTo', target) || [];
        annotations.push({ propertyName: propertyName.toString(), type });
        Reflect.defineMetadata('BelongsTo', annotations, target);
    };
}
