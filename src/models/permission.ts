import { Include } from 'include';
import { Attribute } from '../decorators/attribute';
import { JsonApiModelConfig } from '../decorators/json-api-model';
import { Relation } from '../decorators/relation';
import { Company } from './company';
import { JsonApiModel } from './jsonapi-model';
import { Role } from './role';

@JsonApiModelConfig({
    endpoint: 'permissions',
})
export class Permission extends JsonApiModel<Permission> {
    @Attribute()
    bypassScope?: boolean;

    @Attribute()
    companyId?: string;

    @Attribute()
    roleId: string;

    @Attribute()
    resource: string;

    @Attribute()
    filter?: string;

    @Attribute()
    rights: string[];

    @Relation('BelongsTo', () => Company)
    company?: Include<Company>;

    @Relation('BelongsTo', () => Role)
    role?: Include<Role>;
}
