import { JsonApiModel } from './jsonapi-model';
import { JsonApiModelConfig } from '../decorators/json-api-model';
import { Attribute } from '../decorators/attribute';

@JsonApiModelConfig({
    endpoint: 'associationTypes'
})
export class AssociationType extends JsonApiModel<AssociationType> {
    @Attribute()
    companyId?: string;

    @Attribute()
    sourceEntityTypeId: string;

    @Attribute()
    targetEntityTypeId: string;

    @Attribute()
    sourceIsShared: boolean;

    @Attribute()
    targetIsShared: boolean;

    @Attribute()
    hasPeriod?: boolean;

    @Attribute()
    meta: any;
}
