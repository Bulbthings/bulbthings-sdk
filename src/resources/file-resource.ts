import { Bulbthings } from '..';
import { RequestOptions } from '../interfaces/request-options';
import { File } from '../models/file';
import { create } from '../utils/create';
import { download } from '../utils/download';
import { Resource } from './resource';

export class FileResource extends Resource<File> {
    constructor(protected bulbthings: Bulbthings) {
        super(bulbthings, File);
    }

    async create(
        data: Omit<File, 'getRelationMetadata' | 'getAttributeMetadata'>,
        file?: any,
        options?: RequestOptions
    ): Promise<File> {
        return create(this.bulbthings, this.modelType, data, file, options);
    }

    async download(id: string, options?: RequestOptions): Promise<any> {
        return download(this.bulbthings, this.modelType, id, options);
    }
}
