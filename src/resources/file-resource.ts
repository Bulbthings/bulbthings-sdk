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

    /**
     * @param file a Blob/File (browser), a `{ uri, name, type }` object (React
     * Native), a Buffer, a stream, or a function returning one of those. A
     * stream can only be sent once, so pass `() => fs.createReadStream(path)`
     * for uploads to be retried after a network error.
     */
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
