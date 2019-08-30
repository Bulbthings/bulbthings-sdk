import { RequestOptions } from './request-options';

export interface JsonApiOptions extends RequestOptions {
    fields?: {
        [resourceName: string]: string[];
    };
    include?: string[];
    filter?: string;
    group?: string[];
    sort?: string[];
    page?: {
        limit: number;
        offset?: number;
    };
}
