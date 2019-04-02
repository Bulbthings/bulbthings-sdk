import { Period } from '../interfaces/period';
import { JsonApiModel } from '../models/jsonapi-model';
import { Entity } from '../models/entity';
import { BelongsTo } from '../decorators/belongs-to';
import { JsonApiModelConfig } from '../decorators/json-api-model';

@JsonApiModelConfig({
    endpoint: 'units'
})
export class Unit extends JsonApiModel {
    // @Attribute()
    code: string;

    // @Attribute()
    symbol: string;

    // @Attribute()
    label: string;

    // @Attribute()
    isConstant: boolean;

    // @Attribute()
    isBaseUnit: boolean;

    // @BelongsTo()
    // unittype: UnitType;
}
