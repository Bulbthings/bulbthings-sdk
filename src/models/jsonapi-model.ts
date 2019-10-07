import * as JSONAPI from 'jsonapi-typescript';
import { AttributeAnnotation } from '../interfaces/attribute-annotation';
import { RelationAnnotation } from '../interfaces/relation-annotation';
import { RelationType } from '../types/relation-type';

export class JsonApiModel<T> {
    id?: string;

    constructor(
        data?: Omit<T, 'getRelationMetadata' | 'getAttributeMetadata'>
    ) {
        if (data) {
            Object.assign(this, data);
        }
    }

    public getRelationMetadata(type: RelationType): RelationAnnotation[] {
        return Reflect.getMetadata(type, this) || [];
    }

    public getAttributeMetadata(): AttributeAnnotation[] {
        return Reflect.getMetadata('Attribute', this) || [];
    }
}

// export class JsonApiModelActiveRecord extends JsonApiModel {
//     constructor(data?: JSONAPI.ResourceObject | any) {
//         if (data && !data.id) {
//             data = { id: null, attributes: data };
//         }
//         super(data);
//     }

//     public refresh(options?: JsonApiOptions): void {
//         const data = await findById(null, this, this.id, options);
//         Object.assign(this, data.attributes);
//     }
// }
