import { Include } from 'include';
import { Attribute } from '../decorators/attribute';
import { JsonApiModelConfig } from '../decorators/json-api-model';
import { Relation } from '../decorators/relation';
import { Company } from './company';
import { Grant } from './grant';
import { JsonApiModel } from './jsonapi-model';
import { Permission } from './permission';

@JsonApiModelConfig({
    endpoint: 'roles',
})
export class Role extends JsonApiModel<Role> {
    @Attribute()
    companyId?: string;

    @Attribute()
    label: string;

    @Attribute()
    description?: string;

    @Attribute()
    meta?: {
        /**
         * Whether or not the role is editable.
         */
        isReadOnly?: boolean;
        /**
         * Whether or not roles of this type should be hidden from end users.
         */
        isSystem?: boolean;
    };

    @Relation('BelongsTo', () => Company)
    company?: Include<Company>;

    @Relation('HasMany', () => Grant)
    grants?: Include<Grant[]>;

    @Relation('HasMany', () => Permission)
    permissions?: Include<Permission[]>;
}
