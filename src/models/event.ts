import { JsonApiModel } from './jsonapi-model';
import { Relation } from '../decorators/relation';
import { Attribute } from '../decorators/attribute';
import { JsonApiModelConfig } from '../decorators/json-api-model';
import { EventType } from './event-type';
import { Entity } from './entity';

@JsonApiModelConfig({
    endpoint: 'events'
})
export class Event extends JsonApiModel {
    @Attribute()
    eventTypeId: string;

    @Attribute()
    priority: 'info' | 'warning' | 'danger' | 'success';

    @Attribute()
    sourceEntityId: string;

    @Attribute()
    targetEntityId: string;

    @Attribute()
    privateForEntityId: string;

    @Attribute()
    time: Date;

    @Attribute()
    payload: {
        data: any;
        text: string;
        sections: { type: string; value: any }[];
    };

    @Relation('BelongsTo', () => EventType)
    eventType: EventType;

    @Relation('BelongsTo', () => Entity)
    sourceEntity: Entity;

    @Relation('BelongsTo', () => Entity)
    targetEntity: Entity;
}
