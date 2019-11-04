import { JsonApiOptions } from './json-api-options';

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export interface TimeSeriesOptions extends Omit<JsonApiOptions, 'page'> {
    from: Date;
    to: Date;
    attributeTypeId: string;
    alignmentPeriod:
        | 'second'
        | 'minute'
        | 'hour'
        | 'day'
        | 'week'
        | 'month'
        | 'quarter'
        | 'year';
    alignmentMethod: 'first' | 'last' | 'count' | 'sum' | 'avg' | 'min' | 'max';
    sourceFilter?: string;
    targetFilter?: string;
    unitId?: string;
}
