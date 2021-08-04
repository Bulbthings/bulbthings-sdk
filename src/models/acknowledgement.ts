import { JsonApiModel } from './jsonapi-model';
import { Relation } from '../decorators/relation';
import { Attribute } from '../decorators/attribute';
import { JsonApiModelConfig } from '../decorators/json-api-model';
import { Company } from './company';
import { Account } from './account';
import { Event } from './event';

@JsonApiModelConfig({
    endpoint: 'acknowledgements',
})
export class Acknowledgement extends JsonApiModel<Acknowledgement> {
    @Attribute()
    companyId?: string;

    @Attribute()
    accountId?: string;

    @Attribute()
    eventId: string;

    @Attribute()
    createdAt?: Date;

    @Relation('BelongsTo', () => Company)
    company?: Company;

    @Relation('BelongsTo', () => Account)
    account?: Account;

    @Relation('BelongsTo', () => Event)
    event?: Event;
}
