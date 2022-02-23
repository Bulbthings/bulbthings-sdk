import { JsonApiModel } from './jsonapi-model';
import { Attribute } from '../decorators/attribute';
import { JsonApiModelConfig } from '../decorators/json-api-model';

@JsonApiModelConfig({
    endpoint: 'unitTypes',
})
export class UnitType extends JsonApiModel<UnitType> {
    @Attribute()
    label: string;
}
