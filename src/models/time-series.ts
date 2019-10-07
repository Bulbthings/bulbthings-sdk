import { JsonApiModel } from '../models/jsonapi-model';
import { Entity } from '../models/entity';
import { Relation } from '../decorators/relation';
import { Attribute } from '../decorators/attribute';
import { JsonApiModelConfig } from '../decorators/json-api-model';

@JsonApiModelConfig({
    endpoint: 'timeSeries'
})
export class TimeSeries extends JsonApiModel<TimeSeries> {
    @Attribute()
    time: Date;

    @Attribute()
    sourceEntityId: string;

    @Attribute()
    targetEntityId: string;

    @Attribute()
    value: any;

    @Relation('BelongsTo', () => Entity)
    sourceEntity?: Entity;

    @Relation('BelongsTo', () => Entity)
    targetEntity?: Entity;
}
