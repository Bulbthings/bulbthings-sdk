export function BelongsTo(config: any = {}) {
    return function(target: any, propertyName: string | symbol) {
        const type = Reflect.getMetadata('design:type', target, propertyName);
        const annotations = Reflect.getMetadata('BelongsTo', target) || [];
        annotations.push({ propertyName, type });
        Reflect.defineMetadata('BelongsTo', annotations, target);
    };
}
