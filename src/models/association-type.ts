import { JsonApiModel } from './jsonapi-model';
import { JsonApiModelConfig } from '../decorators/json-api-model';
import { Attribute } from '../decorators/attribute';

@JsonApiModelConfig({
    endpoint: 'associationtypes'
})
export class AssociationType extends JsonApiModel {
    @Attribute()
    sourceEntityTypeId: string;

    @Attribute()
    targetEntityTypeId: string;

    @Attribute()
    sourceIsShared: boolean;

    @Attribute()
    targetIsShared: boolean;

    @Attribute()
    meta: any;
}
