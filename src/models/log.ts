import { Attribute } from '../decorators/attribute';
import { JsonApiModelConfig } from '../decorators/json-api-model';
import { Relation } from '../decorators/relation';
import { CoreEventType } from '../types/core-event-type';
import { Account } from './account';
import { Company } from './company';
import { Entity } from './entity';
import { JsonApiModel } from './jsonapi-model';

@JsonApiModelConfig({
    endpoint: 'logs',
})
export class Log extends JsonApiModel<Log> {
    @Attribute()
    accountId?: string;

    @Attribute()
    companyId?: string;

    @Attribute()
    data?: {
        contextId?: string;
        environmentId?: string;
        keyId?: string;
        previousData?: { [key: string]: any };
        resource?: { [key: string]: any };
    };

    @Attribute()
    meta?: { [key: string]: any };

    @Attribute()
    sourceEntityId?: null | string;

    @Attribute()
    targetEntityId?: null | string;

    @Attribute()
    time?: Date;

    @Attribute()
    type?: CoreEventType;

    @Relation('BelongsTo', () => Company)
    company?: Company;

    @Relation('BelongsTo', () => Account)
    account?: Account;

    @Relation('BelongsTo', () => Entity)
    sourceEntity?: Entity;

    @Relation('BelongsTo', () => Entity)
    targetEntity?: Entity;
}
