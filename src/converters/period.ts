import { Period } from '../interfaces/period';
import { Converter } from '../interfaces/converter';

export const periodConverter: Converter = {
    parse: (value: { from: 'string'; to: 'string'; bounds: 'string' }) => {
        try {
            return {
                from: value.from ? new Date(value.from) : null,
                to: value.to ? new Date(value.to) : null,
                bounds: value.bounds
            };
        } catch (err) {
            console.warn(`periodConverter error with value ${value}:`, err);
            return value;
        }
    },
    stringify: (value: Period) => value
};
