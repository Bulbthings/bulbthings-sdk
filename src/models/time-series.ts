import { JsonApiModel } from '../models/jsonapi-model';
import { Entity } from '../models/entity';
import { AttributeType } from '../models/attribute-type';
import { BelongsTo } from '../decorators/belongs-to';
import { Attribute } from '../decorators/attribute';
import { JsonApiModelConfig } from '../decorators/json-api-model';

@JsonApiModelConfig({
    endpoint: 'timeseries'
})
export class TimeSeries extends JsonApiModel {
    @Attribute()
    entityId: string;

    @Attribute()
    attributeTypeId: string;

    @Attribute()
    time: Date;

    @Attribute()
    value: any;

    @Attribute()
    delta: any;

    @BelongsTo()
    entity: Entity;

    @BelongsTo()
    attributetype: AttributeType;
}
