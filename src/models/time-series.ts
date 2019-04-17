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
    time: Date;

    @Attribute()
    sourceEntityId: string;

    @Attribute()
    targetEntityId: string;

    @Attribute()
    value: any;

    @BelongsTo()
    sourceEntity: Entity;

    @BelongsTo()
    targetEntity: Entity;
}
