import { Path } from '../models/path';
import { Bulbthings } from '..';
import { PathOptions } from '../interfaces/path-options';
import { findAll } from '../utils/find-all';

export class PathResource {
    constructor(private bulbthings: Bulbthings) {}

    async findAll(options: PathOptions): Promise<Path[]> {
        return (await findAll(this.bulbthings, Path, options)).data;
    }
}
