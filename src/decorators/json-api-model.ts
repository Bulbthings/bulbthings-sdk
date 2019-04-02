import { JsonApiModelConfig } from '../interfaces/json-api-model-config';

export function JsonApiModelConfig(config: JsonApiModelConfig): ClassDecorator {
    return function(target: any) {
        Reflect.defineMetadata('JsonApiModelConfig', config, target);
    };
}
