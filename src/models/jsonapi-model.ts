import * as JSONAPI from 'jsonapi-typescript';

export class JsonApiModel {
    id: string;

    constructor(data?: JSONAPI.ResourceObject) {
        if (data) {
            this.id = data.id;
            Object.assign(this, data.attributes);
        }
    }

    public getMetadata(name: string): { propertyName: string; type: any }[] {
        return Reflect.getMetadata(name, this) || [];
    }
}

// export const dateRangeConverter = <PropertyConverter>{
//     mask: (value: any) => {
//         try {
//             return JSON.parse(
//                 value
//                     .replace('(,', '(null,')
//                     .replace(',)', ',null)')
//                     .replace('(', '[')
//                     .replace(')', ']')
//                     .replace('-infinity', 'null')
//                     .replace('infinity', 'null')
//             ).map(d => d && new Date(d));
//         } catch (err) {
//             console.warn(`dateRangeConverter error with value ${value}:`, err);
//             return value;
//         }
//     },
//     unmask: (value: any) => JSON.stringify(value)
// };

// export const periodConverter = <PropertyConverter>{
//     mask: (value: { from: 'string'; to: 'string'; bounds: 'string' }) => {
//         try {
//             return {
//                 from: value.from ? new Date(value.from) : null,
//                 to: value.to ? new Date(value.to) : null,
//                 bounds: value.bounds
//             };
//         } catch (err) {
//             console.warn(`periodConverter error with value ${value}:`, err);
//             return value;
//         }
//     },
//     unmask: (value: Period) => value
// };
// export interface Period {
//     from: Date;
//     to: Date;
//     bounds: '[]' | '(]' | '[)' | '()';
// }
