import { JsonApiModel } from './jsonapi-model';
import { Relation } from '../decorators/relation';
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

    @Relation('HasMany', () => AttributeType)
    attributetypes: AttributeType[];

    @Relation('HasMany', () => AssociationType)
    associationtypes: AssociationType[];
}
