import { TimeSeries } from '../models/time-series';
import { Bulbthings } from '..';
import { TimeSeriesOptions } from '../interfaces/time-series-options';
import { findAll } from '../utils/find-all';

export class TimeSeriesResource {
    constructor(private bulbthings: Bulbthings) {}

    async getReport(options: TimeSeriesOptions): Promise<TimeSeries[]> {
        return (await findAll(this.bulbthings, TimeSeries, options)).data;
    }
}
