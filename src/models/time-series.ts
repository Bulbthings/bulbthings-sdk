import { Attribute } from '../decorators/attribute';
import { JsonApiModelConfig } from '../decorators/json-api-model';
import { Relation } from '../decorators/relation';
import { Entity } from '../models/entity';
import { JsonApiModel } from '../models/jsonapi-model';
import { Include } from '../types/include';

@JsonApiModelConfig({
    endpoint: 'timeSeries',
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
    sourceEntity?: Include<Entity>;

    @Relation('BelongsTo', () => Entity)
    targetEntity?: Include<Entity>;
}
