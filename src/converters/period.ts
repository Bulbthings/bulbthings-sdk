import { Converter } from '../interfaces/converter';
import { Period } from '../interfaces/period';

export const periodConverter: Converter = {
    parse: (value: { from: 'string'; to: 'string'; bounds: 'string' }) => {
        try {
            return value
                ? {
                      from: value.from ? new Date(value.from) : null,
                      to: value.to ? new Date(value.to) : null,
                      bounds: value.bounds,
                  }
                : value;
        } catch (err) {
            console.warn(`[bulbthings][periodConverter] error ${value}:`, err);
            return value;
        }
    },
    stringify: (value: Period) => value,
};
