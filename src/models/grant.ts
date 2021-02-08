import { Relation } from '../decorators/relation';
import { Attribute } from '../decorators/attribute';
import { JsonApiModel } from './jsonapi-model';
import { JsonApiModelConfig } from '../decorators/json-api-model';
import { Company } from './company';
import { Role } from './role';
import { Entity } from './entity';
import { Membership } from './membership';

@JsonApiModelConfig({
    endpoint: 'grants',
})
export class Grant extends JsonApiModel<Grant> {
    @Attribute()
    companyId?: string;

    @Attribute()
    membershipId: string;

    @Attribute()
    roleId: string;

    @Attribute()
    entityId?: string;

    @Relation('BelongsTo', () => Company)
    company?: Company;

    @Relation('BelongsTo', () => Membership)
    membership?: Membership;

    @Relation('BelongsTo', () => Role)
    role?: Role;

    @Relation('BelongsTo', () => Entity)
    entity?: Entity;
}
