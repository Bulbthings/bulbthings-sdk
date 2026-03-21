import { Attribute } from '../decorators/attribute';
import { JsonApiModelConfig } from '../decorators/json-api-model';
import { Relation } from '../decorators/relation';
import { Include } from '../types/include';
import { Account } from './account';
import { Action } from './action';
import { Company } from './company';
import { Entity } from './entity';
import { EventType } from './event-type';
import { JsonApiModel } from './jsonapi-model';

@JsonApiModelConfig({
    endpoint: 'events',
})
export class Event extends JsonApiModel<Event> {
    @Attribute()
    companyId?: string;

    @Attribute()
    eventTypeId: string;

    @Attribute()
    priority?: 'info' | 'warning' | 'danger' | 'success';

    @Attribute()
    accountId?: string;

    @Attribute()
    entityId?: string;

    @Attribute()
    privateForAccountId?: string;

    @Attribute()
    time?: Date;

    @Attribute()
    label?: string;

    @Attribute()
    payload: {
        data: any;
        text: string;
        sections: { type: string; value: any }[];
    };

    @Relation('BelongsTo', () => Company)
    company?: Include<Company>;

    @Relation('BelongsTo', () => EventType)
    eventType?: Include<EventType>;

    @Relation('BelongsTo', () => Account)
    account?: Include<Account>;

    @Relation('BelongsTo', () => Entity)
    entity?: Include<Entity>;

    @Relation('HasMany', () => Action)
    actions?: Include<Action[]>;
}
