import { JsonApiOptions } from './json-api-options';

export interface PathOptions extends JsonApiOptions {
    sourceFilter: string;
    targetFilter: string;
    associationTypes: string[];
    date?: Date;
}
