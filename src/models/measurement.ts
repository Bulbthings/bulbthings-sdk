import { Period } from '../interfaces/period';
import { JsonApiModel } from '../models/jsonapi-model';
import { Entity } from '../models/entity';
import { BelongsTo } from '../decorators/belongs-to';
import { JsonApiModelConfig } from '../decorators/json-api-model';
import { Attribute } from '../decorators/attribute';
import { periodConverter } from '../converters/period';
import { AttributeType } from './attribute-type';

@JsonApiModelConfig({
    endpoint: 'measurements'
})
export class Measurement extends JsonApiModel {
    @Attribute()
    sourceEntityId: string;

    @Attribute()
    targetEntityId: string;

    @Attribute()
    attributeTypeId: string;

    @Attribute()
    value: any;

    @Attribute()
    isAbsolute: boolean;

    @Attribute({ converter: periodConverter })
    period: Period;

    @Attribute()
    unitId: string;

    @BelongsTo()
    attributetype: AttributeType;

    @BelongsTo()
    source: Entity;

    @BelongsTo()
    target: Entity;
}
