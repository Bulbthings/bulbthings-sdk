import { Attribute } from '../decorators/attribute';
import { JsonApiModelConfig } from '../decorators/json-api-model';
import { Relation } from '../decorators/relation';
import { Account } from './account';
import { Association } from './association';
import { Code } from './code';
import { Company } from './company';
import { EntityType } from './entity-type';
import { File } from './file';
import { JsonApiModel } from './jsonapi-model';

@JsonApiModelConfig({
    endpoint: 'entities',
})
export class Entity extends JsonApiModel<Entity> {
    @Attribute()
    companyId?: string;

    @Attribute()
    entityTypeId: string;

    @Attribute()
    label?: string;

    @Attribute()
    customLabel?: string;

    @Attribute()
    attributes?: {
        [attributeTypeId: string]: any;
    };

    @Attribute()
    accountId?: string;

    @Attribute()
    avatarFileId?: string;

    @Attribute()
    createdAt?: Date;

    @Attribute()
    updatedAt?: Date;

    /**
     * Time at which the entity status was changed to `deleted`.
     */
    @Attribute()
    deletedAt?: Date;

    @Attribute()
    status?: 'active' | 'archived' | 'deleted' | 'draft' | 'locked';

    @Attribute()
    meta?: {
        hasStock?: boolean;
    };

    @Relation('BelongsTo', () => Company)
    company?: Company;

    @Relation('BelongsTo', () => EntityType)
    entityType?: EntityType;

    @Relation('BelongsTo', () => Account)
    account?: Account;

    @Relation('HasMany', () => Association)
    associations?: Association[];

    @Relation('BelongsTo', () => File)
    avatarFile?: File;

    @Relation('HasMany', () => File)
    files?: File[];

    @Relation('HasMany', () => Code)
    codes?: Code[];
}
