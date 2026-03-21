import { IncludePaths, IsAny } from 'include';
import { RequestOptions } from './request-options';

export interface JsonApiOptions<T = any> extends RequestOptions {
    fields?: {
        [resourceName: string]: string[];
    };
    include?: IsAny<T> extends true ? string[] : IncludePaths<T>[];
    filter?: string;
    group?: string[];
    sort?: string[];
    page?: {
        limit: number;
        offset?: number;
    };
}
