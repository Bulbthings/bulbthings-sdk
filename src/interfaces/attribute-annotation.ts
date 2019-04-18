import { Converter } from './converter';

export interface AttributeAnnotation {
    propertyName: string;
    type: any;
    converter: Converter;
}
