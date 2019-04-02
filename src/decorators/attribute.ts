import { AttributeConfig } from '../interfaces/attribute-config';
import { Annotation } from '../interfaces/annotation';

export function Attribute(config: AttributeConfig = {}): PropertyDecorator {
    return function(target: any, propertyName: string | symbol) {
        const type = Reflect.getMetadata('design:type', target, propertyName);
        const annotations: Annotation[] =
            Reflect.getMetadata('Attribute', target) || [];

        annotations.push({
            propertyName: propertyName.toString(),
            type,
            converter: {
                parse:
                    (config.converter && config.converter.parse) ||
                    ((value: any) => {
                        if (type === Date) {
                            return new Date(value);
                        }
                        return value;
                    }),
                stringify:
                    (config.converter && config.converter.stringify) ||
                    ((value: any) => value)
            }
        });

        Reflect.defineMetadata('Attribute', annotations, target);
    };
}
