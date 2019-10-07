import { Relation } from '../decorators/relation';
import { Attribute } from '../decorators/attribute';
import { JsonApiModel } from './jsonapi-model';
import { Account } from './account';
import { JsonApiModelConfig } from '../decorators/json-api-model';
import { Company } from './company';
import { Period } from '../interfaces/period';
import { periodConverter } from '../converters/period';
import { Role } from './role';
import { Entity } from './entity';

@JsonApiModelConfig({
    endpoint: 'memberships'
})
export class Membership extends JsonApiModel<Membership> {
    @Attribute()
    companyId: string;

    @Attribute()
    accountId: string;

    @Attribute()
    roleId?: string;

    @Attribute()
    entityId?: string;

    @Attribute()
    isAdmin?: boolean;

    @Attribute()
    isActive?: boolean;

    @Attribute({ converter: periodConverter })
    period?: Period;

    @Relation('BelongsTo', () => Company)
    company?: Company;

    @Relation('BelongsTo', () => Account)
    account?: Account;

    @Relation('BelongsTo', () => Role)
    role?: Role;

    @Relation('BelongsTo', () => Entity)
    entity?: Entity;
}
