import { BelongsTo } from '../decorators/belongs-to';
import { JsonApiModel } from './jsonapi-model';
import { AssociationType } from './association-type';
import { Entity } from './entity';
import { Period } from '../interfaces/period';
import { JsonApiModelConfig } from '../decorators/json-api-model';
import { Attribute } from '../decorators/attribute';
import { periodConverter } from '../converters/period';

@JsonApiModelConfig({
    endpoint: 'associations'
})
export class Association extends JsonApiModel {
    // @Attribute()
    associationTypeId: string;

    // @Attribute()
    sourceEntityId: string;

    // @Attribute()
    targetEntityId: string;

    @Attribute({ converter: periodConverter })
    period: Period;

    // @Attribute()
    ratio: number;

    @BelongsTo()
    associationtype: AssociationType;

    @BelongsTo()
    source: Entity;

    @BelongsTo()
    target: Entity;
}
