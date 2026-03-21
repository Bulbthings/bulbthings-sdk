import { Include } from 'include';
import { periodConverter } from '../converters/period';
import { Attribute } from '../decorators/attribute';
import { JsonApiModelConfig } from '../decorators/json-api-model';
import { Relation } from '../decorators/relation';
import { Period } from '../interfaces/period';
import { Account } from './account';
import { Company } from './company';
import { Entity } from './entity';
import { Grant } from './grant';
import { JsonApiModel } from './jsonapi-model';

@JsonApiModelConfig({
    endpoint: 'memberships',
})
export class Membership extends JsonApiModel<Membership> {
    @Attribute()
    companyId: string;

    @Attribute()
    accountId: string;

    @Attribute()
    entityId?: string;

    @Attribute()
    isAdmin?: boolean;

    @Attribute()
    isActive?: boolean;

    @Attribute({ converter: periodConverter })
    period?: Period;

    @Relation('BelongsTo', () => Company)
    company?: Include<Company>;

    @Relation('BelongsTo', () => Account)
    account?: Include<Account>;

    @Relation('BelongsTo', () => Entity)
    entity?: Include<Entity>;

    @Relation('HasMany', () => Grant)
    grants?: Include<Grant[]>;
}
