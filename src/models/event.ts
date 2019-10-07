import { JsonApiModel } from './jsonapi-model';
import { Relation } from '../decorators/relation';
import { Attribute } from '../decorators/attribute';
import { JsonApiModelConfig } from '../decorators/json-api-model';
import { EventType } from './event-type';
import { Entity } from './entity';
import { Action } from './action';
import { Company } from './company';
import { Account } from './account';

@JsonApiModelConfig({
    endpoint: 'events'
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
    entityId: string;

    @Attribute()
    privateForEntityId?: string;

    @Attribute()
    time?: Date;

    @Attribute()
    payload: {
        data: any;
        text: string;
        sections: { type: string; value: any }[];
    };

    @Relation('BelongsTo', () => Company)
    company?: Company;

    @Relation('BelongsTo', () => EventType)
    eventType?: EventType;

    @Relation('BelongsTo', () => Account)
    account?: Account;

    @Relation('BelongsTo', () => Entity)
    entity?: Entity;

    @Relation('HasMany', () => Action)
    actions?: Action[];
}
