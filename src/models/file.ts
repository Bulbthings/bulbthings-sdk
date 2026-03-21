import { Attribute } from '../decorators/attribute';
import { JsonApiModelConfig } from '../decorators/json-api-model';
import { Relation } from '../decorators/relation';
import { Account } from './account';
import { Company } from './company';
import { Entity } from './entity';
import { JsonApiModel } from './jsonapi-model';

@JsonApiModelConfig({ endpoint: 'files' })
export class File extends JsonApiModel<File> {
    /**
     * Identifier of the file source account. The source is the account which uploaded the file.
     */
    @Attribute()
    accountId?: string;

    /**
     * Identifier of the workspace the file belongs to.
     */
    @Attribute()
    companyId?: string;

    /**
     * Time at which the file was created.
     */
    @Attribute()
    createdAt?: Date;

    /**
     * Encoding type of the file.
     */
    @Attribute()
    encoding?: string;

    /**
     * Identifier of the target source entity. The target is the entity to which the file is
     * attached.
     */
    @Attribute()
    entityId?: string;

    /**
     * Specifies if the object a file or folder.
     */
    @Attribute()
    isFolder?: boolean;

    /**
     * Name of the file or folder
     */
    @Attribute()
    name: string;

    /**
     * Identifier of the folder the object is in.
     */
    @Attribute()
    parentFileId?: string;

    /**
     * Size of the file object in bytes.
     */
    @Attribute()
    size?: number;

    /**
     * Identifier of the file on the cloud storage service.
     */
    @Attribute()
    storageId?: string;

    /**
     * Media type (MIME) of the file. See [here](https://en.wikipedia.org/wiki/Media_type).
     */
    @Attribute()
    type?: string;

    /**
     * Time at which the file was last updated.
     */
    @Attribute()
    updatedAt?: Date;

    @Relation('BelongsTo', () => Company)
    company?: Company;

    @Relation('BelongsTo', () => Account)
    account?: Account;

    @Relation('BelongsTo', () => Entity)
    entity?: Entity;
}
