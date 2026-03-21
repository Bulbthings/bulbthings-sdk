import { Attribute } from '../decorators/attribute';
import { JsonApiModelConfig } from '../decorators/json-api-model';
import { Relation } from '../decorators/relation';
import { Include } from '../types/include';
import { Company } from './company';
import { Entity } from './entity';
import { JsonApiModel } from './jsonapi-model';
import { Membership } from './membership';
import { Role } from './role';

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
    company?: Include<Company>;

    @Relation('BelongsTo', () => Membership)
    membership?: Include<Membership>;

    @Relation('BelongsTo', () => Role)
    role?: Include<Role>;

    @Relation('BelongsTo', () => Entity)
    entity?: Include<Entity>;
}
