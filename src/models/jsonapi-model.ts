import * as JSONAPI from 'jsonapi-typescript';
import { AttributeAnnotation } from '../interfaces/attribute-annotation';
import { RelationAnnotation } from '../interfaces/relation-annotation';
import { RelationType } from 'relation-type';

export class JsonApiModel {
    id: string;

    constructor(data?: JSONAPI.ResourceObject) {
        if (data) {
            this.id = data.id;
            Object.assign(this, data.attributes);
        }
    }

    public getRelationMetadata(type: RelationType): RelationAnnotation[] {
        return Reflect.getMetadata(type, this) || [];
    }

    public getAttributeMetadata(): AttributeAnnotation[] {
        return Reflect.getMetadata('Attribute', this) || [];
    }
}
