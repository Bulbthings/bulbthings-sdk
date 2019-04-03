import { JsonApiModel } from '../models/jsonapi-model';
import { Attribute } from '../decorators/attribute';
import { JsonApiModelConfig } from '../decorators/json-api-model';

@JsonApiModelConfig({
    endpoint: 'units'
})
export class Unit extends JsonApiModel {
    @Attribute()
    code: string;

    @Attribute()
    symbol: string;

    @Attribute()
    label: string;

    @Attribute()
    isConstant: boolean;

    @Attribute()
    isBaseUnit: boolean;

    // @BelongsTo()
    // unittype: UnitType;
}
