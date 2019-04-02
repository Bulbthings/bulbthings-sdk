import { Converter } from './converter';

export interface Annotation {
    propertyName: string;
    type: any;
    converter?: Converter;
}
