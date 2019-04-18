import { JsonApiModel } from './jsonapi-model';
import { HasMany } from '../decorators/has-many';
import { Attribute } from '../decorators/attribute';
import { AttributeType } from './attribute-type';
import { JsonApiModelConfig } from '../decorators/json-api-model';
import { AssociationType } from './association-type';

@JsonApiModelConfig({
    endpoint: 'entitytypes'
})
export class EntityType extends JsonApiModel {
    @Attribute()
    parentId: string;

    @Attribute()
    path: string[];

    @Attribute()
    name: string;

    @Attribute()
    label: string;

    @Attribute()
    description: string;

    @HasMany(AttributeType)
    attributetypes: AttributeType[];

    @HasMany(AssociationType)
    associationtypes: AssociationType[];
}
