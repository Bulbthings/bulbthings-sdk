import { Relation } from '../decorators/relation';
import { Attribute } from '../decorators/attribute';
import { JsonApiModel } from './jsonapi-model';
import { JsonApiModelConfig } from '../decorators/json-api-model';
import { Membership } from './membership';
import { Key } from './key';
import { Company } from './company';

@JsonApiModelConfig({
    endpoint: 'accounts'
})
export class Account extends JsonApiModel {
    @Attribute()
    label: string;

    @Attribute()
    email: string;

    @Attribute()
    password?: string;

    @Attribute()
    isVerified: boolean;

    @Attribute()
    isBot: boolean;

    @Attribute()
    locale?: string;

    @Attribute()
    createdAt: Date;

    @Attribute()
    updatedAt: Date;

    @Relation('HasMany', () => Company)
    companies?: Company[];

    @Relation('HasMany', () => Membership)
    memberships?: Membership[];

    @Relation('HasMany', () => Key)
    keys?: Key[];
}
