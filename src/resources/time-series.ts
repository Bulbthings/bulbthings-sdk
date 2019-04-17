import { TimeSeries } from '../models/time-series';
import BulbThings from '..';
import { TimeSeriesOptions } from '../interfaces/time-series-options';
import { findAll } from '../utils/find';

export class TimeSeriesResource {
    constructor(private bulbthings: BulbThings) {}

    async getReport(options: TimeSeriesOptions): Promise<TimeSeries[]> {
        return (await findAll(this.bulbthings, TimeSeries, options)).data;
    }
}
