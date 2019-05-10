import { IBulbFailure, IBulbError } from '../interfaces/i-bulb-failure';

function isIBulbFailure(input: any): input is IBulbFailure {
    return true;
}

function isIBulbError(input: any): input is IBulbError {
    return true;
}

export class BulbError extends Error implements IBulbFailure {
    public errors;
    public meta;

    constructor(failure: IBulbFailure) {
        super();
        /* super() extends Error mess with proto, this sets it back :
           https://stackoverflow.com/questions/41102060/typescript-extending-error-class */
        (this as any).__proto__ = new.target.prototype;
        this.errors = failure.errors;
        this.meta = failure.meta;
    }

    mergeFailure(bulbError: BulbError) {
        this.errors = this.errors.concat(bulbError.errors);
    }

    static fromError(input: any): BulbError {
        let error: BulbError;

        /* Check if is IBulbError[] for manually thrown err */
        /* Check if is IBulbFailure for json thrown err */
        /* Check if Error for js thrown err */
        if (input instanceof BulbError) {
            error = <BulbError>input;
            error.mergeFailure(input);
        } else if (input instanceof Error) {
            error = new BulbError({
                errors: [{
                    code: 'SDK',
                    title: error.message,
                    detail: error.message,
                    stack: error.stack
                }]
            });
        } else if (isIBulbFailure(input)) {
            error = new BulbError(input as any as IBulbFailure);
        } else if (isIBulbError(input)) {
            error = new BulbError({ errors: [input] });
        } else {
            error = new BulbError({
                errors: [{
                    code: 'SDK',
                    title: 'Data type not supported in BulbError',
                    detail: 'Check meta for details',
                    meta: input
                }]
            });
        }

        return error;
    }
}
