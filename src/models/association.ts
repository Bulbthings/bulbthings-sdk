import { periodConverter } from '../converters/period';
import { Attribute } from '../decorators/attribute';
import { JsonApiModelConfig } from '../decorators/json-api-model';
import { Relation } from '../decorators/relation';
import { Period } from '../interfaces/period';
import { Include } from '../types/include';
import { AssociationType } from './association-type';
import { Company } from './company';
import { Entity } from './entity';
import { JsonApiModel } from './jsonapi-model';

@JsonApiModelConfig({
    endpoint: 'associations',
})
export class Association extends JsonApiModel<Association> {
    @Attribute()
    accountId?: string;

    @Attribute()
    companyId?: string;

    @Attribute()
    associationTypeId: string;

    @Attribute()
    sourceEntityId: string;

    @Attribute()
    targetEntityId: string;

    @Attribute({ converter: periodConverter })
    period?: Period;

    @Attribute()
    ratio?: number;

    @Attribute()
    quantity?: number;

    @Attribute()
    createdAt?: Date;

    @Attribute()
    updatedAt?: Date;

    @Attribute()
    meta?: {
        /**
         * Identifier of the origin of the association, for example an import ID, a booking ID, etc.
         */
        originId?: string;
    };

    @Relation('BelongsTo', () => Company)
    company?: Include<Company>;

    @Relation('BelongsTo', () => AssociationType)
    associationType?: Include<AssociationType>;

    @Relation('BelongsTo', () => Entity)
    sourceEntity?: Include<Entity>;

    @Relation('BelongsTo', () => Entity)
    targetEntity?: Include<Entity>;
}
