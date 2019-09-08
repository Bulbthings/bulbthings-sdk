import { Relation } from '../decorators/relation';
import { Attribute } from '../decorators/attribute';
import { JsonApiModel } from './jsonapi-model';
import { JsonApiModelConfig } from '../decorators/json-api-model';
import { Company } from './company';
import { Membership } from './membership';
import { Key } from './key';

@JsonApiModelConfig({
    endpoint: 'accounts'
})
export class Account extends JsonApiModel {
    @Attribute()
    companyId: string;

    @Attribute()
    email: string;

    @Attribute()
    password?: string;

    @Attribute()
    isAdmin: boolean;

    @Attribute()
    isActive: boolean;

    @Relation('BelongsTo', () => Company)
    company?: Company;

    @Relation('HasMany', () => Membership)
    memberships?: Membership[];

    @Relation('HasMany', () => Key)
    keys?: Key[];
}
