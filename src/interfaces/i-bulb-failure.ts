import * as JSONAPI from 'jsonapi-typescript';

export interface IBulbError extends JSONAPI.ErrorObject {
    code: 'API' | 'SDK' | 'Connection';
    stack?: string;
}

export interface IBulbFailure {
    errors: IBulbError[];
    meta?: object;
}
