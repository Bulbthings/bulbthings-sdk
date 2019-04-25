export interface JsonApiOptions {
    tenant?: string;
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
