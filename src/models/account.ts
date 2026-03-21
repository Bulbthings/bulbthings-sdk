import { Include } from 'include';
import { Attribute } from '../decorators/attribute';
import { JsonApiModelConfig } from '../decorators/json-api-model';
import { Relation } from '../decorators/relation';
import { Company } from './company';
import { JsonApiModel } from './jsonapi-model';
import { Key } from './key';
import { Membership } from './membership';
import { Setting } from './setting';
import { UnitSetting } from './unit-setting';

@JsonApiModelConfig({
    endpoint: 'accounts',
})
export class Account extends JsonApiModel<Account> {
    @Attribute()
    label: string;

    @Attribute()
    email: string;

    @Attribute()
    password?: string;

    @Attribute()
    isVerified?: boolean;

    @Attribute()
    isBot?: boolean;

    @Attribute()
    locale?: string;

    @Attribute()
    meta?: {
        timezone?: string;
    };

    @Attribute()
    avatarFileId?: string;

    @Attribute()
    createdAt?: Date;

    @Attribute()
    updatedAt?: Date;

    @Relation('HasMany', () => Company)
    companies?: Include<Company[]>;

    @Relation('HasMany', () => Membership)
    memberships?: Include<Membership[]>;

    @Relation('HasMany', () => Key)
    keys?: Include<Key[]>;

    @Relation('HasMany', () => Setting)
    settings?: Include<Setting[]>;

    @Relation('HasMany', () => UnitSetting)
    unitSettings?: Include<UnitSetting[]>;
}
