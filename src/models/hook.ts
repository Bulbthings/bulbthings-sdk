import { JsonApiModel } from './jsonapi-model';
import { Attribute } from '../decorators/attribute';
import { JsonApiModelConfig } from '../decorators/json-api-model';

@JsonApiModelConfig({
    endpoint: 'hooks'
})
export class Hook extends JsonApiModel {
    @Attribute()
    isActive: boolean;

    @Attribute()
    name: string;

    @Attribute()
    url?: string;

    @Attribute()
    script?: string;

    @Attribute()
    triggeredOn: string[];
}
