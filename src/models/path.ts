import { periodConverter } from '../converters/period';
import { Attribute } from '../decorators/attribute';
import { JsonApiModelConfig } from '../decorators/json-api-model';
import { Relation } from '../decorators/relation';
import { Period } from '../interfaces/period';
import { Include } from '../types/include';
import { Company } from './company';
import { Entity } from './entity';
import { JsonApiModel } from './jsonapi-model';

@JsonApiModelConfig({
    endpoint: 'paths',
})
export class Path extends JsonApiModel<Path> {
    @Attribute()
    companyId?: string;

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
    nodes?: string[];

    @Attribute()
    edges?: string[];

    @Attribute()
    depth?: number;

    @Relation('BelongsTo', () => Company)
    company?: Include<Company>;

    @Relation('BelongsTo', () => Entity)
    sourceEntity?: Include<Entity>;

    @Relation('BelongsTo', () => Entity)
    targetEntity?: Include<Entity>;
}
