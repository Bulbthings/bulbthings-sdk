export interface Converter {
    parse?: (value: any) => any;
    stringify?: (value: any) => any;
}
