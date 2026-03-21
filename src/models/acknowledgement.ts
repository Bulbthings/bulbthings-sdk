import { Attribute } from '../decorators/attribute';
import { JsonApiModelConfig } from '../decorators/json-api-model';
import { Relation } from '../decorators/relation';
import { Include } from '../types/include';
import { Account } from './account';
import { Company } from './company';
import { Event } from './event';
import { JsonApiModel } from './jsonapi-model';

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
    company?: Include<Company>;

    @Relation('BelongsTo', () => Account)
    account?: Include<Account>;

    @Relation('BelongsTo', () => Event)
    event?: Include<Event>;
}
