import { Log } from '../models/log';
import { Resource } from '../resources/resource';

export type LogResource = Omit<Resource<Log>, 'create' | 'updateById'>;
