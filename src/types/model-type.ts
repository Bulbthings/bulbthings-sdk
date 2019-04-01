import * as JSONAPI from 'jsonapi-typescript';
import { JsonApiModel } from '../models/jsonapi-model';

// Helper type to represent Class objects
// and allow instantiation with 'new()'
export type ModelType<T extends JsonApiModel> = {
    new (data?: JSONAPI.ResourceObject): T;
};
