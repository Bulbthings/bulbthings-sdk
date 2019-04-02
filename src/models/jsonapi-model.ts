import * as JSONAPI from 'jsonapi-typescript';
import { Annotation } from '../interfaces/annotation';

export class JsonApiModel {
    id: string;

    constructor(data?: JSONAPI.ResourceObject) {
        if (data) {
            this.id = data.id;
            Object.assign(this, data.attributes);
        }
    }

    public getMetadata(name: string): Annotation[] {
        return Reflect.getMetadata(name, this) || [];
    }
}
