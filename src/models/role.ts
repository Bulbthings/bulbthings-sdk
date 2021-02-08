import { JsonApiModel } from './jsonapi-model';
import { Relation } from '../decorators/relation';
import { Attribute } from '../decorators/attribute';
import { JsonApiModelConfig } from '../decorators/json-api-model';
import { Company } from './company';
import { Membership } from './membership';
import { Permission } from './permission';
import { Grant } from './grant';

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

    @Relation('BelongsTo', () => Company)
    company?: Company;

    @Relation('HasMany', () => Grant)
    grants?: Grant[];

    @Relation('HasMany', () => Permission)
    permissions?: Permission[];
}
